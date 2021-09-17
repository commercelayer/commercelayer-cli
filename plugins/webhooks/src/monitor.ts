import chalk from 'chalk'
import cliProgress, { SingleBar, MultiBar } from 'cli-progress'
import apiConf from './api-conf'
import type { Chunk } from './chunk'
import { center } from './common'


const MAX_IMPORT_SIZE = apiConf.imports_max_size

const MONITOR_BAR_SIZE = 30


type HeaderColumn = { title: string; width: number; pad: boolean; style: Function }

type Payload = {
	importId?: string;
	processed?: number;
	warnings?: number;
	errors?: number;
	message?: string;
	status?: string;
}


class Monitor {

	private multibar: MultiBar

	private totalItems: number

	constructor(totalItems: number) {
		this.totalItems = totalItems
		this.multibar = new cliProgress.MultiBar({
			format: `| ${chalk.blueBright('{import}')} | {range} | ${chalk.greenBright('{bar}')} | ${chalk.yellowBright('{percentage}%')} | {status} | {tbp} | {processed} | {warnings} | {errors} | ${chalk.italic('{message}')}`,
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true,
			clearOnComplete: false,
			autopadding: true,
			formatValue: barFormatValue,
			barsize: MONITOR_BAR_SIZE,
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

		const bar: SingleBar = this.multibar.create(chunk.items_count, 0, {
			range,
			import: '   ----   ',
			processed: '0'.padStart(maxImportLength, ' '),
			warnings: '0'.padStart(maxImportLength, ' '),
			errors: '0'.padStart(maxImportLength, ' '),
			message: '',
			tbp: chunk.items_count,
			status: '   -----   ',
		})

		return bar

	}


	updateBar(bar: SingleBar, value?: number, payload?: Payload) {

		const maxImportLength = String(MAX_IMPORT_SIZE).length
		const updCount = (value === undefined) ? ((payload?.processed || 0) + (payload?.warnings || 0) + (payload?.errors || 0)) : value

		const updPayload: any = { message: payload?.message || '' }

		if (payload?.processed) updPayload.processed = String(payload.processed).padStart(maxImportLength, ' ')
		if (payload?.warnings) updPayload.warnings = String(payload.warnings).padStart(maxImportLength, ' ')
		if (payload?.errors) updPayload.errors = String(payload.errors).padStart(maxImportLength, ' ')
		if (payload?.importId) updPayload.import = payload.importId

		if (payload?.status) updPayload.status = statusStyle(payload.status, payload.processed)

		updPayload.tbp = String(bar.getTotal() - updCount).padStart(maxImportLength, ' ')

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
			{ title: 'ID', width: 10, pad: true },
			{ title: 'Items', width: (itemsLength * 2) + 1, pad: true },
			{ title: 'Import progress', width: MONITOR_BAR_SIZE, pad: true },
			{ title: ' %', width: 4, pad: true },
			{ title: ' Status', width: 11, pad: true },
			{ title: 'TBP\u2193', width: maxImportsLength, pad: true, style: chalk.cyanBright },
			{ title: 'Prc.', width: maxImportsLength, pad: true, style: chalk.greenBright },
			{ title: 'Wrn.', width: maxImportsLength, pad: true, style: chalk.yellowBright },
			{ title: 'Err.', width: maxImportsLength, pad: true, style: chalk.redBright },
		]

		const labels = header.map((h: HeaderColumn) => {

			const w = (h.width + (h.pad ? 2 : 0))
			const label = center(h.title, w)

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
		case 'percentage': {
			const vf = String(v).padStart(3, ' ')
			// if (v === '100') vf = chalk.greenBright(vf)
			return vf
		}
		default: return v
	}

}


const statusStyle = (s: string, processed?: number): string => {

	let status = s
	if ((status.includes('in_progress')) && (processed === 0)) status = 'waiting ...'
	status = status.padEnd(11, ' ')

	if (status.includes('completed')) status = chalk.greenBright(status)
	else
	if (status.includes('waiting')) status = chalk.italic(status)

	return status

}


export { Monitor }



const resetConsole = () => {

	// Cursor
	// const showCursor = '\u001B[?25l'  // \x1B[?25l
	const showCursor = '\u001B[?25h' // \x1B[?25h

	// Line wrap
	// const lineWrap = '\u001B[?7l'  // \x1B[?7l
	const lineWrap = '\u001B[?7h' // \x1B[?7h

	// eslint-disable-next-line no-console
	// console.log(`${showCursor}${lineWrap}`)
	process.stdout.write(`${showCursor}${lineWrap}`)

}


// Enable terminal cursor and line wrap in case of process interrupted
process.on('SIGINT', () => {
	resetConsole()
	// eslint-disable-next-line no-process-exit
	process.exit()
})
