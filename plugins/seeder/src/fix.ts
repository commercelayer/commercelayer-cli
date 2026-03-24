/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prefer-regex-literals */

import commercelayer from '@commercelayer/sdk'


const RESOURCE_TYPE = 'stock_items'



const InflectorConfig = {

  uncountableWords: [
    'equipment', 'information', 'rice', 'money', 'species', 'series',
    'fish', 'sheep', 'moose', 'deer', 'news',
  ],

  pluralRules: [
    [/(m)an$/gi, '$1en'],
    [/(pe)rson$/gi, '$1ople'],
    [/(child)$/gi, '$1ren'],
    [/^(ox)$/gi, '$1en'],
    [/(ax|test)is$/gi, '$1es'],
    [/(octop|vir)us$/gi, '$1i'],
    [/(alias|status)$/gi, '$1es'],
    [/(bu)s$/gi, '$1ses'],
    [/(buffal|tomat|potat)o$/gi, '$1oes'],
    [/([ti])um$/gi, '$1a'],
    [/sis$/gi, 'ses'],
    [/(?:([^f])fe|([lr])f)$/gi, '$1$2ves'],
    [/(hive)$/gi, '$1s'],
    [/([^aeiouy]|qu)y$/gi, '$1ies'],
    [/(x|ch|ss|sh)$/gi, '$1es'],
    [/(matr|vert|ind)ix|ex$/gi, '$1ices'],
    [/([m|l])ouse$/gi, '$1ice'],
    [/(quiz)$/gi, '$1zes'],
    [/s$/gi, 's'],
    [/$/gi, 's'],
  ],

  singularRules: [
    [/(m)en$/gi, '$1an'],
    [/(pe)ople$/gi, '$1rson'],
    [/(child)ren$/gi, '$1'],
    [/([ti])a$/gi, '$1um'],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis'],
    [/(hive)s$/gi, '$1'],
    [/(tive)s$/gi, '$1'],
    [/(curve)s$/gi, '$1'],
    [/([lr])ves$/gi, '$1f'],
    [/([^fo])ves$/gi, '$1fe'],
    [/([^aeiouy]|qu)ies$/gi, '$1y'],
    [/(s)eries$/gi, '$1eries'],
    [/(m)ovies$/gi, '$1ovie'],
    [/(x|ch|ss|sh)es$/gi, '$1'],
    [/([m|l])ice$/gi, '$1ouse'],
    [/(bus)es$/gi, '$1'],
    [/(o)es$/gi, '$1'],
    [/(shoe)s$/gi, '$1'],
    [/(cris|ax|test)es$/gi, '$1is'],
    [/(octop|vir)i$/gi, '$1us'],
    [/(alias|status)es$/gi, '$1'],
    [/^(ox)en/gi, '$1'],
    [/(vert|ind)ices$/gi, '$1ex'],
    [/(matr)ices$/gi, '$1ix'],
    [/(quiz)zes$/gi, '$1'],
    [/s$/gi, ''],
  ],

  nonTitlecasedWords: [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
    'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
    'with', 'for',
  ],

  idSuffix: /(_ids|_id)$/g,
  underbar: /_/g,
  spaceOrUnderbar: /[ _]/g,
  uppercase: /([A-Z])/g,
  underbarPrefix: /^_/,

}


const applyRules = (str: string, rules: string | any[], skip: string | any[], override?: any): string => {
  if (override) {
    str = override
  } else {
    const ignore = (skip.includes(str.toLowerCase()))
    if (!ignore) {
      for (let x = 0; x < rules.length; x++) {
        if (str.match(rules[x][0])) {
          str = str.replace(rules[x][0], rules[x][1])
          break
        }
      }
    }
  }
  return str
}


const _pluralize = (str: any, plural?: any): string => {
  return applyRules(
    str,
    InflectorConfig.pluralRules,
    InflectorConfig.uncountableWords,
    plural
  )
}


const singularize = (str: any, singular?: any): string => {
  return applyRules(
    str,
    InflectorConfig.singularRules,
    InflectorConfig.uncountableWords,
    singular
  )
}



async function fix(): Promise<void> {

  const page = Number(process.argv[2] || 1)
  console.log(`Fixing page ${page}`)


  const cl = commercelayer({
    organization: process.env.CL_CLI_ORGANIZATION || 'cli-test-org',
    accessToken: process.env.CL_CLI_ACCESS_TOKEN || '',
  })


  const resources = RESOURCE_TYPE

  const pageNumber = page
  const pageSize = 25

  const items = await cl[resources].list({ pageNumber, pageSize })

  let index = (pageSize * (pageNumber - 1)) + 1

  const fixed = items.map(s => {
    const n = { ...s }
    n.reference = singularize(resources) + '_' + String(index++)
    return n
  })


  fixed.forEach(async f => {
    const res = {
      id: f.id,
      reference: f.reference,
      reference_origin: 'CLI',
    }
    await cl[resources].update(res)
  })

}


void fix()
