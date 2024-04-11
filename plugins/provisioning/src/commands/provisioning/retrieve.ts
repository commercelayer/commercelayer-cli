import Command, { Flags, Args /*, FLAG_LOAD_PARAMS, FLAG_SAVE_PARAM */} from '../../base'
import { type CommerceLayerProvisioningClient, type QueryParamsRetrieve } from '@commercelayer/provisioning-sdk'
import { addRequestReader, isRequestInterrupted } from '../../lang'
// import { mergeCommandParams } from '../../commands'


const OPERATION = 'retrieve'


export default class ProvisioningRetrieve extends Command {

  static description = 'fetch a single resource'

  static aliases = ['prov:retrieve', 'pr', 'pretrieve']

  static examples = [
    '$ commercelayer provisioning:retrieve roles/<roleId>',
    '$ commercelayer prov:retrieve roles <roleId>',
    '$ cl prov:retrieve roles <roleId>',
    '$ clayer pr roles/<roleId>',
  ]

  static flags = {
    ...Command.flags,
    /*
    save: Flags.string({
      char: 'x',
      description: 'save command output to file',
      multiple: false,
      exclusive: ['save-path'],
    }),
    'save-path': Flags.string({
      char: 'X',
      description: 'save command output to file and create missing path directories',
      multiple: false,
      exclusive: ['save'],
    }),
    */
    extract: Flags.string({
      char: 'e',
      description: 'extract subfields from object attributes',
      multiple: true,
      exclusive: ['raw'],
    }),
  }

  static args = {
    ...Command.args,
    id: Args.string({ name: 'id', description: 'id of the resource to retrieve', required: false }),
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ProvisioningRetrieve)

    const { res, id } = this.checkResourceId(args.resource, args.id)
    const resource = this.checkResource(res, { singular: true })

    // const loadParams = flags[FLAG_LOAD_PARAMS]
    // const saveCmd = flags[FLAG_SAVE_PARAMS]
    // if (saveCmd) this.checkAlias(saveCmd, resource.api, OPERATION, this.config)
    const showHeaders = flags.headers || flags['headers-only']


    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Fields flags
    const fields = this.fieldsFlag(flags.fields, resource.api as string)


    const cl = this.initCommerceLayer(flags)

    const rawReader = flags.raw ? cl.addRawResponseReader({ headers: showHeaders }) : undefined
    const reqReader = flags.doc ? addRequestReader(cl) : undefined

    const params: QueryParamsRetrieve = {}

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerProvisioningClient]

      this.checkOperation(resSdk, OPERATION)

      if (include && (include.length > 0)) params.include = include
      if (fields && (Object.keys(fields).length > 0)) params.fields = fields


      // Load saved command arguments
      // if (loadParams) {
      //   const savedParams = this.loadParams(loadParams, resource.api, OPERATION)
      //   if (savedParams) mergeCommandParams(params, savedParams)
     //  }

      const res = await resSdk.retrieve(id, params)

      const out = (flags.raw && rawReader) ? rawReader.rawResponse : res

      if (flags.extract) {
        const ext = this.extractFlag(flags.extract)
        this.extractObjectFields(ext, out)
      }

      this.printHeaders(rawReader?.headers, flags)
      this.printOutput(out, flags)


      // Save command output
      // if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      // Save command arguments
      // if (saveCmd) this.saveParams(saveCmd, { type: resource.api, id }, OPERATION, params)


      return out

    } catch (error: any) {
      if (isRequestInterrupted(error) && reqReader) {
        await this.showLiveDocumentation(reqReader.request, params, flags)
        cl.removeInterceptor('request', reqReader.id)
      } else this.printError(error, flags, args)
    }

  }

}
