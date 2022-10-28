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
    [new RegExp('(m)an$', 'gi'), '$1en'],
    [new RegExp('(pe)rson$', 'gi'), '$1ople'],
    [new RegExp('(child)$', 'gi'), '$1ren'],
    [new RegExp('^(ox)$', 'gi'), '$1en'],
    [new RegExp('(ax|test)is$', 'gi'), '$1es'],
    [new RegExp('(octop|vir)us$', 'gi'), '$1i'],
    [new RegExp('(alias|status)$', 'gi'), '$1es'],
    [new RegExp('(bu)s$', 'gi'), '$1ses'],
    [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
    [new RegExp('([ti])um$', 'gi'), '$1a'],
    [new RegExp('sis$', 'gi'), 'ses'],
    [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'), '$1$2ves'],
    [new RegExp('(hive)$', 'gi'), '$1s'],
    [new RegExp('([^aeiouy]|qu)y$', 'gi'), '$1ies'],
    [new RegExp('(x|ch|ss|sh)$', 'gi'), '$1es'],
    [new RegExp('(matr|vert|ind)ix|ex$', 'gi'), '$1ices'],
    [new RegExp('([m|l])ouse$', 'gi'), '$1ice'],
    [new RegExp('(quiz)$', 'gi'), '$1zes'],
    [new RegExp('s$', 'gi'), 's'],
    [new RegExp('$', 'gi'), 's'],
  ],

  singularRules: [
    [new RegExp('(m)en$', 'gi'), '$1an'],
    [new RegExp('(pe)ople$', 'gi'), '$1rson'],
    [new RegExp('(child)ren$', 'gi'), '$1'],
    [new RegExp('([ti])a$', 'gi'), '$1um'],
    [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$', 'gi'), '$1$2sis'],
    [new RegExp('(hive)s$', 'gi'), '$1'],
    [new RegExp('(tive)s$', 'gi'), '$1'],
    [new RegExp('(curve)s$', 'gi'), '$1'],
    [new RegExp('([lr])ves$', 'gi'), '$1f'],
    [new RegExp('([^fo])ves$', 'gi'), '$1fe'],
    [new RegExp('([^aeiouy]|qu)ies$', 'gi'), '$1y'],
    [new RegExp('(s)eries$', 'gi'), '$1eries'],
    [new RegExp('(m)ovies$', 'gi'), '$1ovie'],
    [new RegExp('(x|ch|ss|sh)es$', 'gi'), '$1'],
    [new RegExp('([m|l])ice$', 'gi'), '$1ouse'],
    [new RegExp('(bus)es$', 'gi'), '$1'],
    [new RegExp('(o)es$', 'gi'), '$1'],
    [new RegExp('(shoe)s$', 'gi'), '$1'],
    [new RegExp('(cris|ax|test)es$', 'gi'), '$1is'],
    [new RegExp('(octop|vir)i$', 'gi'), '$1us'],
    [new RegExp('(alias|status)es$', 'gi'), '$1'],
    [new RegExp('^(ox)en', 'gi'), '$1'],
    [new RegExp('(vert|ind)ices$', 'gi'), '$1ex'],
    [new RegExp('(matr)ices$', 'gi'), '$1ix'],
    [new RegExp('(quiz)zes$', 'gi'), '$1'],
    [new RegExp('s$', 'gi'), ''],
  ],

  nonTitlecasedWords: [
    'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
    'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
    'with', 'for',
  ],

  idSuffix: new RegExp('(_ids|_id)$', 'g'),
  underbar: new RegExp('_', 'g'),
  spaceOrUnderbar: new RegExp('[ _]', 'g'),
  uppercase: new RegExp('([A-Z])', 'g'),
  underbarPrefix: new RegExp('^_'),

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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pluralize = (str: any, plural?: any): string => {
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
