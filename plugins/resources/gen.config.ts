import { clText } from '@commercelayer/cli-core'
import { defineConfig, resourceList } from '@commercelayer/cli-generator'
import { CommerceLayerStatic, type ResourceTypeLock } from '@commercelayer/sdk'

/**
 * The Core API resources, from the installed @commercelayer/sdk. Update the
 * SDK first to pick up new resources; `generate` and `generate-local` are the
 * same here, as nothing is downloaded.
 */
export default defineConfig({
  name: 'cli-plugin-resources',
  outputs: ['src/util/resources/available.ts'],
  generate: resourceList({
    output: 'src/util/resources/available.ts',
    name: 'RESOURCES',
    resources: () =>
      CommerceLayerStatic.resources().map((r) => {
        const res = r as ResourceTypeLock
        const singular = clText.singularize(res)
        const singleton = CommerceLayerStatic.isSingleton(res)
        return { name: singular, type: res, api: singleton ? singular : res, model: clText.camelize(singular), singleton }
      }),
  }),
})
