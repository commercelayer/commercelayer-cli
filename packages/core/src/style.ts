import chalk from 'chalk'


// Colors
export const red = (txt: unknown): string => { return chalk.red(txt) }
export const green = (txt: unknown): string => { return chalk.green(txt) }
export const yellow = (txt: unknown): string => { return chalk.yellow(txt) }
export const blue = (txt: unknown): string => { return chalk.blue(txt) }
export const cyan = (txt: unknown): string => { return chalk.cyan(txt) }
export const magenta = (txt: unknown): string => { return chalk.magenta(txt) }

// API
export const slug = (txt: unknown): string => { return chalk.yellowBright(txt) }
export const id = (txt: unknown): string => { return chalk.magenta.bold(txt) }

// CLI
export const command = (txt: unknown): string => { return chalk.cyan.italic(txt) }
export const flag = (txt: unknown): string => { return chalk.magenta.italic(txt) }

// Messages
export const error = (txt: unknown): string => { return chalk.red(txt) }
export const success = (txt: unknown): string => { return chalk.green(txt) }
export const warning = (txt: unknown): string => { return chalk.yellow(txt) }

export const highlight = (txt: unknown): string => { return chalk.yellowBright(txt) }
