import { format, inspect } from 'util'
import { sep, dirname } from 'path'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'

/** Await ms milliseconds */
const sleep = async (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms))
}


// Reset terminal style after use of colors and text styles
const resetConsole = (): void => {

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


const log = (message = '', ...args: unknown[]): void => {
	message = (typeof message === 'string') ? message : inspect(message)
	process.stdout.write(format(message, ...args) + '\n')
}


const specialFolder = (filePath: string, createIfNotExists: boolean = false): string => {

	const specialFolders = ['desktop', 'home']

	 // Special directory (home / desktop)
	 // eslint-disable-next-line no-useless-escape
	 const root = filePath.toLowerCase().split(/[\\\/]/g)[0]
	 if (specialFolders.includes(root)) {
	   let filePrefix = homedir()
	   if (root === 'desktop') filePrefix += `${sep}Desktop`
	   filePath = filePath.replace(root, filePrefix)
	 }
	 const fileDir = dirname(filePath)
	 if (createIfNotExists && !existsSync(fileDir)) mkdirSync(fileDir, { recursive: true })

	 return filePath

}


export { sleep, resetConsole, log, specialFolder }
