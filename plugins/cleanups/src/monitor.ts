import cliProgress, { type SingleBar, type MultiBar } from 'cli-progress'
import type { Chunk } from './chunk'
import { clOutput, clConfig, clColor, clUtil } from '@commercelayer/cli-core'



const MAX_CLEANUP_SIZE = clConfig.cleanups.max_size

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
	style?: (str: string) => string;
	valueStyle?: (str: string) => string;
	hiddenHeader?: boolean;
}

type Payload = {
	cleanupId?: string;
	processed?: number;
	errors?: number;
	message?: string;
	status?: string;
}

class Monitor {

	private readonly multibar: MultiBar

	private readonly totalItems: number

	private readonly style: MonitorStyle


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

	static readonly FORMATS: string[] = [
		'| {cleanup} | {bar} | {percentage}% | {status} | {tbp} | {processed} | {errors} | {message}',
		'| {cleanup} | {bar} | {percentage}% | {status} | {tbp} | {processed} | {errors} |',
		'| {cleanup} | {percentage}% | {status} | {tbp} | {processed} | {errors} | {message}',
		'| {cleanup} | {percentage}% | {status} | {tbp} | {processed} | {errors} |',
		'| {cleanup} | {percentage}% | {status} | {tbp} | {message}',
		'| {cleanup} | {percentage}% | {status} | {tbp} |',
		'| {cleanup} | {percentage}% | {status} |',
	]


	static create(totalItems: number, log?: (str?: string) => void): Monitor {
		const monitor = new Monitor(totalItems)
		if (log) {
			log()
			log(monitor.style.header)
		}

		return monitor
	}


	createBar(chunk: Chunk): SingleBar {

		// const ml = String(chunk.total_items).length
		// const range = `${chunk.start_item}-${chunk.end_item}`.padStart((ml * 2) + 1, ' ')
		const maxCleanupLength = String(MAX_CLEANUP_SIZE).length

		const bar: SingleBar = this.multibar.create(chunk.chunkItems, 0, {
			// range,
			cleanup: '   ----   ',
			processed: '0'.padStart(maxCleanupLength, ' '),
			errors: '0'.padStart(maxCleanupLength, ' '),
			message: '',
			tbp: chunk.chunkItems,
			status: '   -----   ',
		})

		return bar

	}


	updateBar(bar: SingleBar, value?: number, payload?: Payload): number {

		const maxCleanupLength = String(MAX_CLEANUP_SIZE).length
		const updCount = (value === undefined) ? ((payload?.processed || 0) + (payload?.errors || 0)) : value

		const updPayload: any = { message: payload?.message || '' }

		if (payload?.processed) updPayload.processed = String(payload.processed).padStart(maxCleanupLength, ' ')
		if (payload?.errors) updPayload.errors = String(payload.errors).padStart(maxCleanupLength, ' ')
		if (payload?.cleanupId) updPayload.cleanup = payload.cleanupId

		if (payload?.status) updPayload.status = this.statusStyle(payload.status.replace(/_/, ' '), payload.processed)

		updPayload.tbp = String(Math.max(0, bar.getTotal() - updCount)).padStart(maxCleanupLength, ' ')

		if (bar) bar.update(updCount, updPayload as object)

		return updCount

	}


	message(message: string, style?: string): string {

		if (!message) return ''

		const msg = message.trim()
		if (!this.style.colors) return msg

		if (style) switch (style.toLowerCase()) {
			case 'w':
			case 'warn':
			case 'warning': return clColor.msg.warning(msg)
			case 'e':
			case 'err':
			case 'error': return clColor.msg.error(msg)
			default: return ''
		}
		else return msg

	}


	private availableColumns(): Record<string, HeaderColumn> {

		// const itemsLength = String(this.totalItems).length
		const maxCleanupsLength = String(MAX_CLEANUP_SIZE).length

		const columns: Record<string, HeaderColumn> = {
			cleanup: { title: 'ID', width: 10, pad: true, valueStyle: clColor.table.key },
			// range: { title: 'Items', width: (itemsLength * 2) + 1, pad: true },
			bar: { title: 'Cleanup progress', width: Monitor.BAR_SIZE, pad: true, valueStyle: clColor.greenBright },
			percentage: { title: ' %', width: 4, pad: true, valueStyle: clColor.yellowBright },
			status: { title: ' Status', width: 11, pad: true },
			tbp: { title: 'TBP\u2193', width: maxCleanupsLength, pad: true, style: clColor.cyanBright },
			processed: { title: 'Prc.', width: maxCleanupsLength, pad: true, style: clColor.msg.success },
			errors: { title: 'Err.', width: maxCleanupsLength, pad: true, style: clColor.msg.error },
			message: { title: '', hiddenHeader: true, width: 'Error'.length + 1, valueStyle: clColor.msg.error },
		}

		return columns

	}


	private selectMonitorFormat(colors?: boolean): { columns: HeaderColumn[]; format: string } | undefined {

		const allColumns = this.availableColumns()

		for (const f of Monitor.FORMATS) {

			// Extract column name from format
			const cols: string[] = []
			f.split('|').forEach(p => {
				const col = p.trim().replace(/[^A-Z_a-z]/g, '').trim()
				if (col) cols.push(col)
			})

			// Calculate maximum row size
			let totalSize = cols.length
			for (const c of cols) {
				const col = allColumns[c]
				let size = col.width || 0
				if (c === 'percentage') size++
				if ((colors && c === 'status')) size += 10
				if (col.pad) size += 2
				if (colors && col.valueStyle) size += 10
				totalSize += size
			}

			// If total size fits console width select the format
			if (totalSize <= (process.stderr.columns || 80)) {
				let format = f
				if (colors) {
					for (const c of cols) {
						const style = allColumns[c].valueStyle
						const perc = (c === 'percentage') ? '%' : ''
						if (style) format = format.replace(new RegExp(`{${c}}${perc}`), style(`{${c}}${perc}`))
					}
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

			let styled = clColor.bold(label)
			if (style.colors && h.style) styled = h.style(styled)

			return styled

		})

		// Write header lower border
		let tableWidth = header.length + 1
		for (const h of header) {
			tableWidth += h.width + (h.pad ? 2 : 0)
		}

		style.header = `|${labels.join('|')}|\n` + ''.padStart(tableWidth, '-')


		return style

	}


	private statusStyle(status: string, processed?: number): string {

		let s = status
		if ((s.includes('in_progress')) && (processed === 0)) s = 'waiting...'
		s = s.padEnd(11, ' ')

		if (this.style.colors) {
			if (s.includes('completed')) s = clColor.msg.success.greenBright(s)
			else
				if (s.includes('waiting')) s = clColor.italic(s)
				else
					if (s.includes('interrupted')) s = clColor.msg.error(s)
		}

		return s

	}


	stop(): void {
		this.multibar.stop()
	}

}


const barFormatValue = (v: any, _options: any, type: string): any => {

	const chunkLength = String(MAX_CLEANUP_SIZE).length

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



// Enable terminal cursor and line wrap in case of process interrupted
process.on('SIGINT', () => {
	clUtil.resetConsole()
	process.exit()
})
