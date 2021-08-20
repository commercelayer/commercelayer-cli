
const baseURL = (slug: string, domain: string | undefined): string => {
  return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const fixType = (val: string): string | number | boolean | null | undefined => {

  let v: any = val

  if (v === 'null') v = null
  else
  // eslint-disable-next-line eqeqeq
  if (Number(v) == v) v = Number(v)
  else v = (v === 'true') ? true : (v === 'false') ? false : v

  return v

}


export { baseURL, fixType }
