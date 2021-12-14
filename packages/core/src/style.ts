import chalk from 'chalk'


export const red = (txt: unknown) => { return chalk.red(txt) }
export const green = (txt: unknown) => { return chalk.green(txt) }
export const yellow = (txt: unknown) => { return chalk.yellow(txt) }
export const blue = (txt: unknown) => { return chalk.blue(txt) }
export const cyan = (txt: unknown) => { return chalk.cyan(txt) }
export const magenta = (txt: unknown) => { return chalk.magenta(txt) }

export const slug = (txt: unknown) => { return chalk.yellow(txt) }
export const id = (txt: unknown) => { return chalk.magenta(txt) }

export const command = (txt: unknown) => { return chalk.cyan(txt) }
export const flag = (txt: unknown) => { return chalk.magenta(txt) }

export const error = (txt: unknown) => { return chalk.red(txt) }
export const success = (txt: unknown) => { return chalk.green(txt) }
export const warning = (txt: unknown) => { return chalk.yellow(txt) }

export const hilight = (txt: unknown) => { return chalk.yellowBright(txt) }
