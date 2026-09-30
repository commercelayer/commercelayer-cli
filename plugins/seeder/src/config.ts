import { clConfig } from "@commercelayer/cli-core"

export default {
  dataUrl: `https://data.${clConfig.api.default_app_domain}`,
  seederFolder: 'seeder',
  dataFolder: 'data',
  schemaFolder: 'schemas',
  referenceOrigin: 'CLI',
  validApplicationKind: 'integration',
}
