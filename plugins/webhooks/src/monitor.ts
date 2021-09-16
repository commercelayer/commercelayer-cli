import chalk from 'chalk'
import cliProgress, { SingleBar, MultiBar } from 'cli-progress'
import apiConf from './api-conf'
import type { Chunk } from './chunk'


const MAX_IMPORT_SIZE = apiConf.imports_max_size


type HeaderColumn = { title: string; width: number; pad: boolean; style: Function }

type Payload = {
	importId?: string;
	processed?: number;
	warnings?: number;
	errors?: number;
	message?: string;
}


class Monitor {

	private multibar: MultiBar

	private totalItems: number

	constructor(totalItems: number) {
		this.totalItems = totalItems
		this.multibar = new cliProgress.MultiBar({
			format: `| {range} | ${chalk.greenBright('{bar}')} | ${chalk.yellowBright('{percentage}%')} | {value}/{total} | {processed} | {warnings} | {errors} | ${chalk.blueBright('{import}')} |${chalk.italic('{message}')}`,
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true,
			clearOnComplete: false,
			autopadding: true,
			formatValue: barFormatValue,
		})
	}


	static create(totalItems: number, log?: Function) {
		const monitor = new Monitor(totalItems)
		if (log) {
			log()
			log(monitor.progressHeader())
		}
		return monitor
	}


	createBar(chunk: Chunk): SingleBar {

		const ml = String(chunk.total_items).length
		const range = `${chunk.start_item}-${chunk.end_item}`.padStart((ml * 2) + 1, ' ')
		const maxImportLength = String(MAX_IMPORT_SIZE).length

		const bar: SingleBar = this.multibar.create(chunk.inputs.length, 0, {
			range,
			import: '   ----   ',
			processed: '0'.padStart(maxImportLength, ' '),
			warnings: '0'.padStart(maxImportLength, ' '),
			errors: '0'.padStart(maxImportLength, ' '),
			message: '',
		})

		return bar

	}


	updateBar(bar: SingleBar, value?: number, payload?: Payload) {

		const maxImportLength = String(MAX_IMPORT_SIZE).length
		const updCount = (value === undefined) ? ((payload?.processed || 0) + (payload?.warnings || 0) + (payload?.errors || 0)) : value

		let message = payload?.message || ((updCount === 0) ? 'Waiting ...' : '')
		if (!message.startsWith(' ')) message = ' ' + message

		const updPayload: any = { message }
		if (payload?.processed) updPayload.processed = String(payload.processed).padStart(maxImportLength, ' ')
		if (payload?.warnings) updPayload.warnings = String(payload.warnings).padStart(maxImportLength, ' ')
		if (payload?.errors) updPayload.errors = String(payload.errors).padStart(maxImportLength, ' ')
		if (payload?.importId) updPayload.import = payload.importId

		if (bar) bar.update(updCount, updPayload)

	}


	message(message: string, style?: string): string {

		if (!message) return ''

		const msg = message.trim()

		if (style) switch (style.toLowerCase()) {
			case 'w':
			case 'warn':
			case 'warning': return chalk.yellowBright(msg)
			case 'e':
			case 'err':
			case 'error': return chalk.redBright(msg)
			default: return ' '
		}
		else return msg

	}


	private progressHeader() {

		const itemsLength = String(this.totalItems).length
		const maxImportsLength = String(MAX_IMPORT_SIZE).length

		const header: any = [
			{ title: 'Items', width: (itemsLength * 2) + 1, pad: true },
			{ title: 'Import progress', width: 40, pad: true },
			{ title: ' %', width: 4, pad: true },
			{ title: 'Prg./Tot.', width: (maxImportsLength * 2) + 1, pad: true },
			{ title: 'Prc.', width: maxImportsLength, pad: true, style: chalk.greenBright },
			{ title: 'Wrn.', width: maxImportsLength, pad: true, style: chalk.yellowBright },
			{ title: 'Err.', width: maxImportsLength, pad: true, style: chalk.redBright },
			{ title: 'Import ID', width: 10, pad: true },
		]

		const labels = header.map((h: HeaderColumn) => {

			const w = (h.width + (h.pad ? 2 : 0))
			const l = h.title.length
			const label = h.title.padStart(l + Math.floor((w - l) / 2), ' ').padEnd(w, ' ')

			let styled = chalk.bold(label)
			if (h.style) styled = h.style(styled)

			return styled

		})

		let tableWidth = header.length + 1
		header.forEach((h: any) => {
			tableWidth += h.width + (h.pad ? 2 : 0)
		})

		return `|${labels.join('|')}|\n` + ''.padStart(tableWidth, '-')

	}


	stop() {
		this.multibar.stop()
	}

}


const barFormatValue = (v: any, _options: any, type: string) => {

	const chunkLength = String(MAX_IMPORT_SIZE).length

	switch (type) {
		case 'value':
		case 'total': return String(v).padStart(chunkLength, ' ')
		case 'percentage': return String(v).padStart(3, ' ')
		default: return v
	}

}


export { Monitor }
