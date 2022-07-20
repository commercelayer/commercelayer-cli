import { format, inspect } from 'util'

/** Await ms milliseconds */
const sleep = async (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms))
}


// Reset terminal style after use of colors and text styles
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


const log = (message = '', ...args: unknown[]) => {
	// tslint:disable-next-line strict-type-predicates
	message = (typeof message === 'string') ? message : inspect(message)
	process.stdout.write(format(message, ...args) + '\n')
}


const capitalize = (str: string | undefined): string | undefined => {
	if (!str) return str
	let s = str.toLowerCase()
	s = s.substring(0, 1).toUpperCase() + s.substring(1)
	return s
  }



export { sleep, resetConsole, log, capitalize }
