import chalk from 'chalk'
import cliProgress, { SingleBar, MultiBar } from 'cli-progress'
import type { Chunk } from './chunk'
import { clOutput, clConfig } from '@commercelayer/cli-core'


const MAX_IMPORT_SIZE = clConfig.imports.max_size

const TERMINAL_SIZE = process.stdout.columns || 80

export { TERMINAL_SIZE }


type MonitorStyle = {
	format: string;
	header: string;
	colors: boolean;
}

type HeaderColumn = {
	title: string;
	width: number;
	pad?: boolean;
	style?: Function;
	valueStyle?: Function;
	hiddenHeader?: boolean;
}

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

	private style: MonitorStyle


	constructor(totalItems: number, colors?: boolean) {
		this.totalItems = totalItems
		this.style = this.monitorStyle(colors || true)
		this.multibar = new cliProgress.MultiBar({
			format: this.style.format,
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true,
			clearOnComplete: false,
			autopadding: true,
			formatValue: barFormatValue,
			barsize: Monitor.BAR_SIZE,
		})
	}

	static readonly BAR_SIZE = 25

	static readonly FORMATS: Array<string> = [
		'| {import} | {range} | {bar} | {percentage}% | {status} | {tbp} | {processed} | {warnings} | {errors} | {message}',
		'| {import} | {range} | {bar} | {percentage}% | {status} | {tbp} | {processed} | {warnings} | {errors} |',
		'| {import} | {range} | {percentage}% | {status} | {tbp} | {processed} | {warnings} | {errors} | {message}',
		'| {import} | {range} | {percentage}% | {status} | {tbp} | {processed} | {warnings} | {errors} |',
		'| {import} | {range} | {percentage}% | {status} | {tbp} | {message}',
		'| {import} | {range} | {percentage}% | {status} | {tbp} |',
		'| {import} | {range} | {percentage}% | {status} |',
	]


	static create(totalItems: number, log?: Function) {
		const monitor = new Monitor(totalItems)
		if (log) {
			log()
			log(monitor.style.header)
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


	updateBar(bar: SingleBar, value?: number, payload?: Payload): number {

		const maxImportLength = String(MAX_IMPORT_SIZE).length
		const updCount = (value === undefined) ? ((payload?.processed || 0) + (payload?.warnings || 0) + (payload?.errors || 0)) : value

		const updPayload: any = { message: payload?.message || '' }

		if (payload?.processed) updPayload.processed = String(payload.processed).padStart(maxImportLength, ' ')
		if (payload?.warnings) updPayload.warnings = String(payload.warnings).padStart(maxImportLength, ' ')
		if (payload?.errors) updPayload.errors = String(payload.errors).padStart(maxImportLength, ' ')
		if (payload?.importId) updPayload.import = payload.importId

		if (payload?.status) updPayload.status = this.statusStyle(payload.status.replace(/_/, ' '), payload.processed)

		updPayload.tbp = String(bar.getTotal() - updCount).padStart(maxImportLength, ' ')

		if (bar) bar.update(updCount, updPayload)

		return updCount

	}


	message(message: string, style?: string): string {

		if (!message) return ''

		const msg = message.trim()
		if (!this.style.colors) return msg

		if (style) switch (style.toLowerCase()) {
			case 'w':
			case 'warn':
			case 'warning': return chalk.yellowBright(msg)
			case 'e':
			case 'err':
			case 'error': return chalk.redBright(msg)
			default: return ''
		}
		else return msg

	}


	private availableColumns(): { [key: string]: HeaderColumn } {

		const itemsLength = String(this.totalItems).length
		const maxImportsLength = String(MAX_IMPORT_SIZE).length

		const columns: { [key: string]: HeaderColumn } = {
			import: { title: 'ID', width: 10, pad: true, valueStyle: chalk.blueBright },
			range: { title: 'Items', width: (itemsLength * 2) + 1, pad: true },
			bar: { title: 'Import progress', width: Monitor.BAR_SIZE, pad: true, valueStyle: chalk.greenBright },
			percentage: { title: ' %', width: 4, pad: true, valueStyle: chalk.yellowBright },
			status: { title: ' Status', width: 11, pad: true },
			tbp: { title: 'TBP\u2193', width: maxImportsLength, pad: true, style: chalk.cyanBright },
			processed: { title: 'Prc.', width: maxImportsLength, pad: true, style: chalk.greenBright },
			warnings: { title: 'Wrn.', width: maxImportsLength, pad: true, style: chalk.yellowBright },
			errors: { title: 'Err.', width: maxImportsLength, pad: true, style: chalk.redBright },
			message: { title: '', hiddenHeader: true, width: 'Error'.length + 1, valueStyle: chalk.redBright },
		}

		return columns

	}


	private selectMonitorFormat(colors?: boolean): { columns: HeaderColumn[]; format: string } | undefined {

		const allColumns = this.availableColumns()

		for (const f of Monitor.FORMATS) {

			// Extract column name from format
			const cols: Array<string> = []
			f.split('|').forEach(p => {
				const col = p.trim().replace(/[^a-zA-Z_]/g, '').trim()
				if (col) cols.push(col)
			})

			// Calculate maximum row size
			let totalSize = cols.length
			cols.forEach(c => {
				const col = allColumns[c]
				let size = col.width || 0
				if (c === 'percentage') size++
				if ((colors && c === 'status')) size += 10
				if (col.pad) size += 2
				if (colors && col.valueStyle) size += 10
				totalSize += size
			})

			// If total size fits console width select the format
			if (totalSize <= (process.stderr.columns || 80)) {
				let format = f
				if (colors) {
					cols.forEach(c => {
						const style = allColumns[c].valueStyle
						const perc = (c === 'percentage') ? '%' : ''
						if (style) format = format.replace(new RegExp(`{${c}}${perc}`), style(`{${c}}${perc}`))
					})
				}
				return {
					format,
					columns: cols.map(c => allColumns[c]).filter(c => !c.hiddenHeader),
				}
			}

		}

	}


	private monitorStyle(colors: boolean): MonitorStyle {

		const style: MonitorStyle = {
			header: '',
			format: '',
			colors,
		}

		// Select a monitor format that fit the current terminal size
		let monitorFormat = this.selectMonitorFormat(style.colors)
		if (!monitorFormat && style.colors) monitorFormat = this.selectMonitorFormat(style.colors = false)
		if (!monitorFormat) throw new Error('No available monitor style for this terminal size')

		style.format = monitorFormat.format

		// Apply style to header columns
		const header = monitorFormat.columns
		const labels = header.map((h: HeaderColumn) => {

			const w = (h.width + (h.pad ? 2 : 0))
			const label = clOutput.center(h.title, w)

			let styled = chalk.bold(label)
			if (style.colors && h.style) styled = h.style(styled)

			return styled

		})

		// Write header lower border
		let tableWidth = header.length + 1
		header.forEach(h => {
			tableWidth += h.width + (h.pad ? 2 : 0)
		})

		style.header = `|${labels.join('|')}|\n` + ''.padStart(tableWidth, '-')


		return style

	}


	private statusStyle(status: string, processed?: number): string {

		let s = status
		if ((s.includes('in_progress')) && (processed === 0)) s = 'waiting...'
		s = s.padEnd(11, ' ')

		if (this.style.colors) {
			if (s.includes('completed')) s = chalk.greenBright(s)
			else
			if (s.includes('waiting')) s = chalk.italic(s)
			else
			if (s.includes('interrupted')) s = chalk.redBright(s)
		}

		return s

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
