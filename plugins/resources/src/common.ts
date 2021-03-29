
const baseURL = (slug: string, domain: string | undefined): string => {
  return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}





export { baseURL }
