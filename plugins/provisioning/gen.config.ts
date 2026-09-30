import { clText } from '@commercelayer/cli-core'
import { defineConfig, resourceList } from '@commercelayer/cli-generator'
import { CommerceLayerProvisioningStatic, type ResourceTypeLock } from '@commercelayer/provisioning-sdk'

/**
 * The Provisioning API resources, from the installed
 * @commercelayer/provisioning-sdk. Update the SDK first to pick up new
 * resources; `generate` and `generate-local` are the same here.
 */
export default defineConfig({
  name: 'cli-plugin-provisioning',
  outputs: ['src/util/resources/available.ts'],
  generate: resourceList({
    output: 'src/util/resources/available.ts',
    name: 'RESOURCES',
    resources: () =>
      CommerceLayerProvisioningStatic.resources().map((r) => {
        const res = r as ResourceTypeLock
        const singular = clText.singularize(res)
        const singleton = CommerceLayerProvisioningStatic.isSingleton(res)
        return { name: singular, type: res, api: singleton ? singular : res, model: clText.camelize(singular), singleton }
      }),
  }),
})
