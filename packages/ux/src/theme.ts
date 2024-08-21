import chalk from 'chalk'
import * as Color from 'color'



// chalk doesn't export a list of standard colors, so we have to supply our own
export const STANDARD_CHALK = [
  'white',
  'black',
  'blue',
  'yellow',
  'green',
  'red',
  'magenta',
  'cyan',
  'gray',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgGray',
  'bgBlackBright',
  'bgRedBright',
  'bgGreenBright',
  'bgYellowBright',
  'bgBlueBright',
  'bgMagentaBright',
  'bgCyanBright',
  'bgWhiteBright',
  'bold',
  'underline',
  'dim',
  'italic',
  'strikethrough',
] as const

export type StandardChalk = (typeof STANDARD_CHALK)[number]

export const THEME_KEYS = [
  'alias',
  'bin',
  'command',
  'commandSummary',
  'dollarSign',
  'flag',
  'flagDefaultValue',
  'flagOptions',
  'flagRequired',
  'flagSeparator',
  'sectionDescription',
  'sectionHeader',
  'topic',
  'version',
] as const

export type ThemeKey = (typeof THEME_KEYS)[number]

export type Theme = {
  [key: string | ThemeKey]: string | StandardChalk | undefined
  alias?: string | StandardChalk
  bin?: string | StandardChalk
  command?: string | StandardChalk
  commandSummary?: string | StandardChalk
  dollarSign?: string | StandardChalk
  flag?: string | StandardChalk
  flagDefaultValue?: string | StandardChalk
  flagOptions?: string | StandardChalk
  flagRequired?: string | StandardChalk
  flagSeparator?: string | StandardChalk
  sectionDescription?: string | StandardChalk
  sectionHeader?: string | StandardChalk
  topic?: string | StandardChalk
  version?: string | StandardChalk
}






function isStandardChalk(color: any): color is StandardChalk {
  return STANDARD_CHALK.includes(color)
}

/**
 * Add color to text.
 * @param color color to use. Can be hex code (e.g. `#ff0000`), rgb (e.g. `rgb(255, 255, 255)`) or a chalk color (e.g. `red`)
 * @param text string to colorize
 * @returns colorized string
 */
export function colorize(color: string | StandardChalk | undefined, text: string): string {
  if (isStandardChalk(color)) return chalk[color](text)

  return color ? chalk.hex(color)(text) : text
}

export function parseTheme(theme: Record<string, string>): Theme {
  return Object.fromEntries(
    Object.entries(theme)
      .map(([key, value]) => [key, getColor(value)])
      .filter(([_, value]) => value),
  )
}

export function getColor(color: string): string
export function getColor(color: StandardChalk): StandardChalk
export function getColor(color: string | StandardChalk): string | StandardChalk | undefined {
  try {
    // eslint-disable-next-line new-cap
    return isStandardChalk(color) ? color : new Color.default(color).hex()
  } catch { }
}
