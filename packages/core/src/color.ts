import chalk from 'chalk'
import type { ApiMode } from './api'


export const reset = chalk.reset
export const visible = chalk.visible
export const hidden = chalk.hidden

export const red = chalk.red
export const redBright = chalk.redBright

export const green = chalk.green
export const greenBright = chalk.greenBright

export const yellow = chalk.yellow
export const yellowBright = chalk.yellowBright

export const blue = chalk.blue
export const blueBright = chalk.blueBright

export const white = chalk.white
export const whiteBright = chalk.whiteBright

export const black = chalk.black
export const blackBright = chalk.blackBright
export const grey = chalk.grey

export const cyan = chalk.cyan
export const cyanBright = chalk.cyanBright

export const magenta = chalk.magenta
export const magentaBright = chalk.magentaBright

export const bold = chalk.bold
export const dim = chalk.dim
export const underline = chalk.underline
export const italic = chalk.italic


export const bg = {
	white: chalk.bgWhite,
	whiteBright: chalk.bgWhiteBright,
	black: chalk.bgBlack,
	blackBright: chalk.bgBlackBright,
	grey: chalk.bgGrey,
	red: chalk.bgRed,
	redBright: chalk.bgRedBright,
	green: chalk.bgGreen,
	greenBright: chalk.bgGreenBright,
	yellow: chalk.bgYellow,
	yellowBright: chalk.bgYellowBright,
	blue: chalk.bgBlue,
	blueBright: chalk.bgBlueBright,
	magenta: chalk.bgMagenta,
	magentaBright: chalk.bgMagentaBright,
	cyan: chalk.bgCyan,
	cyanBright: chalk.bgCyanBright
}


export const style = {

	organization: yellowBright.bold,
	application: yellowBright.bold,
	slug: yellowBright,
	id: bold,
	token: blueBright,
	resource: bold,
	attribute: italic,
	trigger: cyanBright,
	kind: cyanBright,
	live: greenBright,
	test: yellowBright,
	execMode: (mode: ApiMode) => { return (mode === 'live') ? style.live : style.test },

	success: greenBright,
	warning: yellowBright,
	error: redBright,

	arg: italic,
	flag: italic,
	command: italic,
	value: italic,
	alias: cyanBright,
	plugin: blueBright,

	title: blueBright,

	path: italic,
	datetime: cyanBright,
	number: yellowBright,

}


/* Aliases */
export const type = {
	datetime: style.datetime,
	number: style.number,
	path: style.path
}


/* Aliases */
export const api = {
	organization: style.organization,
	application: style.application,
	slug: style.slug,
	id: style.id,
	token: style.token,
	resource: style.resource,
	attribute: style.attribute,
	trigger: style.trigger,
	kind: style.kind,
	live: style.live,
	test: style.test,
}


/* Aliases */
export const msg = {
	success: style.success,
	warning: style.warning,
	error: style.error,
}


/* Aliases */
export const cli = {
	arg: style.arg,
	flag: style.flag,
	command: style.command,
	value: style.value,
	alias: style.alias,
	plugin: style.plugin
}


export const table = {
	header: yellowBright.bold,
	key: blueBright
}
