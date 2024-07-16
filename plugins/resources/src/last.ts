import type { ResourceTypeLock } from "@commercelayer/sdk"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"


export type LastResources = Partial<Record<ResourceTypeLock, string>>


export const lastResources = (lastDir: string, organization: string, lastRes?: LastResources): LastResources => {

  if (!existsSync(lastDir)) mkdirSync(lastDir, { recursive: true })

  const lastPath = join(lastDir, `${organization}.last.json`)
  const last: LastResources = existsSync(lastPath) ? JSON.parse(readFileSync(lastPath, { encoding: 'utf-8' })) : {}

  if (lastRes) {
    Object.assign(last, lastRes)
    writeFileSync(lastPath, JSON.stringify(last), { encoding: 'utf-8' })
  }

  return last

}
