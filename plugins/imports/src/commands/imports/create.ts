/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import type { CommerceLayerClient, Import } from '@commercelayer/sdk'
import { generateInputs } from '../../input'
import { SingleBar } from 'cli-progress'
import { clUtil, clConfig } from '@commercelayer/cli-core'
import { Monitor } from '../../monitor'
import { Chunk, Batch, splitChunks, splitImports } from '../../chunk'
import chalk from 'chalk'
import cliux from 'cli-ux'


const MAX_INPUTS = 0	// 0 = No Max
const MAX_CHUNKS = 10
const MIN_DELAY = 1000
const ERROR_429_DELAY = 10000
const SECURITY_DELAY = 50


const importsDelay = (parallelRequests: number): number => {

	const unitDelayBurst = clConfig.api.requests_max_secs_burst / clConfig.api.requests_max_num_burst
	const unitDelayAvg = clConfig.api.requests_max_secs_avg / clConfig.api.requests_max_num_avg

	const delayBurst = parallelRequests * unitDelayBurst
	const delayAvg = parallelRequests * unitDelayAvg

	const delay = Math.ceil(Math.max(delayBurst, delayAvg) * 1000)

	const secDelay = Math.max(MIN_DELAY, delay + SECURITY_DELAY)

	return secDelay

}


export default class ImportsCreate extends Command {

	static description = 'create a new import'

	static aliases = ['imp:create']

	static examples = [
		'$ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>',
		'$ cl imp:create skus -c -i <input-file-path>',
	]

	static flags = {
		...Command.flags,
		type: flags.string({
			char: 't',
			description: 'the type of resource being imported',
			required: true,
			options: clConfig.imports.types,
			helpValue: clConfig.imports.types.slice(0, 4).join('|') + '|...',
		}),
		parent: flags.string({
			char: 'p',
			description: 'the id of the parent resource to be associated with imported data',
		}),
		inputs: flags.string({
			char: 'i',
			description: 'the path of the file containing the data to import',
			required: true,
		}),
		csv: flags.boolean({
			char: 'C',
			description: 'accept input file in CSV format',
			dependsOn: ['inputs'],
		}),
		blind: flags.boolean({
			char: 'b',
			description: 'execute in blind mode without showing the progress monitor',
			exclusive: ['quiet', 'silent'],
		}),
		quiet: flags.boolean({
			char: 'q',
			description: 'execute command without showing warning messages',
			exclusive: ['blind'],
		}),
	}


	cl!: CommerceLayerClient

	monitor!: Monitor

	private completed = 0


	async run() {

		const { flags } = this.parse(ImportsCreate)

		this.cl = this.commercelayerInit(flags)


		// Check access to API before executing the command
		await this.checkAccessToken()


		try {

			const type = flags.type
			const parentId = flags.parent
			const inputFile = this.specialFolder(flags.inputs)

			const monitor = !flags.blind

			const inputs: Array<any> = await generateInputs(inputFile, flags).catch(error => this.error(error.message))
			const inputsLength = inputs.length

			// Check import size
			const humanized = type.replace(/_/g, ' ')
			if (inputsLength === 0) this.error(`No ${humanized} to import`)
			else
			if ((MAX_INPUTS > 0) && (inputsLength > MAX_INPUTS)) this.error(`You are trying to import ${chalk.yellowBright(String(inputsLength))} ${humanized}. Using the CLI you can import up to ${MAX_INPUTS} items at a time`, {
				suggestions: [`Split your input file into multiple files containing each a maximum of ${MAX_INPUTS} items`],
			})

			// Split input
			const chunks: Array<Chunk> = splitImports({
				resource_type: type,
				parent_resource_id: parentId,
				cleanup_records: false,
				inputs,
			})

			// Split chunks
			const batches: Array<Batch> = splitChunks(chunks, MAX_CHUNKS)


			const resource = type.replace(/_/g, ' ')
			const multiChunk = chunks.length > 1
			const multiBatch = batches.length > 1

			// Show multi chunk/batch messages
			if (!flags.quiet && !flags.blind) {
				// Multi chunk message
				if (multiChunk) {
					const groupId = chunks[0]?.group_id
					const msg1 = `The input file contains ${chalk.yellowBright(String(inputsLength))} ${resource}, more than the maximun ${clConfig.imports.max_size} elements allowed for each single import.`
					const msg2 = `The import will be split into a set of ${chalk.yellowBright(String(chunks.length))} distinct chunks with the same unique group ID ${chalk.underline.yellowBright(groupId)}.`
					const msg3 = `Execute the command ${chalk.italic(`imports:group ${groupId}`)} to retrieve all the related imports`
					this.log(`\n${msg1} ${msg2} ${msg3}`)
				}
				// Multi batch message
				if (multiBatch) {
					const msg1 = `The ${chunks.length} generated chunks will be elaborated in batches of ${MAX_CHUNKS}`
					this.log(`\n${msg1}`)
				}
				if (multiChunk || multiBatch) {
					this.log()
					await cliux.anykey()
				}
			}


			if (monitor) {
				for (const batch of batches) {
					if (multiBatch) this.log(`\nProcessing batch # ${chalk.yellowBright(String(batch.batch_number))} of ${chalk.yellowBright(String(batch.total_batches))}...`)
					this.monitor = Monitor.create(batch.items_count, this.log)
					await this.parallelizeImports(batch.chunks, monitor)
				}
				this.log(`\nImport of ${chalk.yellowBright(String(inputsLength))} ${humanized} completed.`)
			} else {
				await this.parallelizeImports(chunks, monitor)
				this.log(`\nThe import of ${chalk.yellowBright(String(inputsLength))} ${resource} has been started`)
			}

			this.log()


		} catch (error) {
			this.handleError(error, flags)
		}

	}


	private async checkAccessToken() {
		try {
			await this.cl.application.retrieve()
		} catch (error) {
			if (this.cl.isApiError(error) && error.status && (error.status >= 400)) {
				const err = error.first()
				this.error(`${err.title}: ${err.detail}`)
			}
		}
	}


	private async parallelizeImports(chunks: Chunk[], monitor: boolean): Promise<void> {

		const imports: Array<Promise<Import>> = []

		this.completed = 0
		for (const chunk of chunks) {
			const imp = this.createParallelImport(chunk, monitor)
			if (imp) imports.push(imp)
		}

		if (monitor && this.monitor) {
			await Promise.allSettled(imports)
			this.monitor.stop()
		}

	}


	private async createImport(chunk: Chunk): Promise<Import> {
		return this.cl.imports.create({
			resource_type: chunk.resource_type,
			parent_resource_id: chunk.parent_resource_id,
			cleanup_records: chunk.cleanup_records,
			inputs: chunk.inputs,
			reference: `${chunk.group_id}-${String(chunk.chunk_number).padStart(4, '0')}`,
			reference_origin: 'cli-plugin-imports',
			metadata: {
				chunk_number: `${chunk.chunk_number}/${chunk.total_chunks}`,
				chunk_items: `${chunk.start_item}-${chunk.end_item}`,
				group_id: chunk.group_id,
			},
		})
	}


	private async createParallelImport(chunk: Chunk, monitor?: boolean): Promise<Import> {

		let bar: SingleBar

		if (monitor && this.monitor) bar = this.monitor.createBar(chunk)

		return this.createImport(chunk).then(async i => {

			let imp: Import = i

			if (monitor && this.monitor) {

				let barValue = 0
				if (bar) barValue = this.monitor.updateBar(bar, 0, { importId: i.id, status: 'waiting...' })

				do {

					await clUtil.sleep(importsDelay(chunk.total_batch_chunks - this.completed))
					const tmp = await this.cl.imports.retrieve(imp.id).catch(async err => {
						if (this.cl.isApiError(err) && (err.status === 429)) {
							if (imp && imp.status) barValue = this.monitor.updateBar(bar, barValue, { status: chalk.cyanBright(imp.status) })
							await clUtil.sleep(ERROR_429_DELAY)
						}
					})

					if (tmp) {
						imp = tmp
						if (bar) barValue = this.monitor.updateBar(bar, undefined, {
							processed: Number(imp.processed_count),
							warnings: Number(imp.warnings_count),
							errors: Number(imp.errors_count),
							status: imp.status,
						})
					}

				}
				while (!['completed', 'interrupted'].includes(imp.status || ''))

				this.completed++

			}


			return imp

		}).catch(error => {
			this.monitor.updateBar(bar, undefined, { message: this.monitor.message(/* error.message || */'Error', 'error') })
			return Promise.reject(error)
		})

	}

}
