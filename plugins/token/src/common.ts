import { inspect } from 'util'
import { ClientId, AuthScope, ClientSecret } from '@commercelayer/js-auth'


interface AppAuth {
	slug: string;
	domain?: string;
	clientId: ClientId;
	clientSecret?: ClientSecret;
	scope?: AuthScope;
	email?: string;
	password?: string;
}

export type { AppAuth }


const printObject = (object: any): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: true,
		sorted: false,
		maxArrayLength: Infinity,
		breakLength: 120,
	})
}


const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}


const sleep = async (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}


const commandFlags = <T extends object>(flags: T, exclude?: string[]): T => {
  const filteredFlags = { ...flags }
  if (exclude) for (const e of exclude) delete filteredFlags[e as keyof T]
  return filteredFlags
}


export { printObject, baseURL, sleep, commandFlags }
