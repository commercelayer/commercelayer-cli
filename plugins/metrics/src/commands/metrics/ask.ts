
import readline from "node:readline/promises"
import { randomUUID } from 'node:crypto'
import { BaseCommand, Args, Flags } from '../../base'
import { clColor, clConfig } from "@commercelayer/cli-core"
import { createParser } from "eventsource-parser"
import ora, { type Ora } from 'ora'
import { inspect } from "node:util"


// Debug
const DEBUG = ['1', 'on', 'true', 'metrics:ask'].includes((process.env.CL_CLI_DEBUG || '').toLowerCase())


// --------- --------- - CONFIG - --------- ---------

// Metrics chat endpoint path
const metricsChatPath = '/chat/metrics'

// Spinner
const spinnerEnabled = true
const spinnerLabel = 'Thinking...'

// Exit chat commands
const exitCommands = ["exit", "quit"]

// Prompt
const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale
const userPrompt = (systemLocale === 'it-IT') ? 'Tu' : 'You'
const assistantPrompt = '' // 'Assistant'

// Agent/LLM system message
const systemMessage = `You are running inside a terminal CLI. The user reads your output directly in a shell.

FORMATTING RULES:
- Never use Markdown (no **, no ##, no backticks, no > quotes)
- Never use JSON
- Never use tables of any kind (no ASCII tables, no markdown tables)
- Present structured data as labeled lines: "Label: value"
- Use plain text lists with dashes or numbers when needed
- Keep lines under 80 characters
- Prefer short paragraphs over long prose

ICONS AND COLORS:
Use ANSI color codes with Unicode icons creatively to make output visually engaging and surprising.
Choose icons that are thematically fitting and unexpected — avoid generic checkmarks and arrows.
Use colors purposefully to reinforce meaning, not just decoration.`

// Unique ID used for agent memory
const threadId = randomUUID()

// --------- --------- --------- --------- ---------


type AskOptions = {
  fullResponse: boolean
  showDetails: boolean
}


function metricsChatUrl(domain?: string): string {

  let host: string

  if (domain) {
    if (domain === 'localhost') host = 'http://localhost:4111'
    else host = `https://ai-agents.${domain}`
  } else host = `https://ai-agents.${clConfig.api.default_domain}`

  return `${host}${metricsChatPath}`

}



export default class MetricsAsk extends BaseCommand {

  static hidden: boolean = true
  static hiddenAliases: ["metrics:chat"]

  static strict: boolean = false

  static aliases = ["metrics:chat"]

  static override description = 'start chat to talk with Metrics AI agent'

  static override examples = [
    'cl metrics:ask show orders of last year grouped by market',
    "cl metrics:chat \"mostrami gli ordini dell'ultimo anno raggruppati per divisa\"",
    'commercelayer metrics:chat'
  ]

  static override flags = {
    fullResponse: Flags.boolean({
      char: 'F',
      description: 'await full response from agent and don\'t show real-time text',
      hidden: true
    }),
    showDetails: Flags.boolean({
      char: 'D',
      description: 'show details about interactions with external tools',
      exclusive: ['fullResponse'],
      hidden: true
    }),
  }


  static override args = {
    prompt: Args.string({ description: 'text prompt to send to the AI agent' }),
  }


  #chatEndpoint!: string
  #accessToken!: string

  readonly #options: AskOptions = {
    fullResponse: false,
    showDetails: false,
  }

  readonly #spinner = ora()

  private get accessToken(): string { return this.#accessToken }
  private get spinner(): Ora { return this.#spinner }
  private get options(): AskOptions { return this.#options }
  private get chatEndpoint(): string { return this.#chatEndpoint }


  public async run(): Promise<void> {

    const { argv, flags } = await this.parse(MetricsAsk)

    this.checkAcessTokenData(flags.accessToken, flags)
    this.#accessToken = flags.accessToken
    this.#chatEndpoint = metricsChatUrl(flags.domain)

    this.options.fullResponse = flags.fullResponse
    this.options.showDetails = flags.showDetails

    let userInput: string | undefined = argv.join(' ').trim()
    if (exitCommands.includes(userInput)) userInput = undefined

    this.log(`\n${clColor.bold('Metrics AI Chat')} — write '${clColor.italic('exit')}' to close the conversation`)
    await this.startChat(userInput)

  }


  private async handleAskError(response: Response): Promise<never> {

    let errorMessage = ""
    try {
      const json = await response.clone().json()
      errorMessage = json.error
    } catch (err) {
      errorMessage = await response.text()
    }

    if (response.status)
      switch (response.status) {
        case 404: {
          errorMessage = 'Metrics Chat endpoint not found. Please check your configuration and try again.'
          break
        }
      }
    else
      switch (errorMessage.toLocaleLowerCase()) {
        case 'invalid or expired token': {
          errorMessage = 'Invalid or expired access token. Please log in again to your organization.'
          break
        }
        case 'fetch failed': {
          errorMessage = 'Failed to connect to the Metrics Chat endpoint.'
          break
        }
        case '404 not found': {
          errorMessage = 'Metrics Chat endpoint not found. Please check your configuration and try again.'
          break
        }
      }

    if (this.spinner.isSpinning) this.spinner.stop()

    throw new Error(errorMessage)

  }


  private handleResponseTool(data: any): string | undefined {

    switch (data.type) {
      case 'tool-input-start': return `\n${clColor.magenta.italic(`Calling tool ... ${data.toolName}`)}\n`
      case 'tool-input-delta': return undefined // return data.inputTextDelta as string
      case 'tool-input-available': {
        let text = `\n${clColor.cyan('Tool Input')}\n`
        text += inspect(data.input, false, null, true)
        return `${text}\n`
      }
      case 'tool-output-available': {
        let text = `\n${clColor.cyan('Tool Output')}\n`
        text += inspect(data.output, false, null, true)
        return `${text}\n\n`
      }
      default: return undefined
    }

  }


  private handleResponseText(data: any): string | undefined {

    switch (data.type) {
      case 'start': return assistantPrompt ? `${clColor.cyan(assistantPrompt)}:\n\n` : undefined
      case 'start-step': break
      case 'text-start': {
        if (!this.#options.fullResponse && this.spinner.isSpinning) this.spinner.stop()
        break
      }
      case 'text-end': return '\n'
      case 'text-delta': {
        const delta = String(data.delta)
        return delta.endsWith(':') ? delta.slice(0, -1) : delta
      }
      case 'finish-step': break
      case 'finish': break
    }

    return undefined

  }


  private async handleAskResponse(response: Response): Promise<string> {

    let fullText = ''

    const parser = createParser({
      onEvent: (event) => {
        const raw = event.data
        if (raw === '[DONE]') return

        const data = JSON.parse(raw)

        // process.stdout.write(dataType)

        if (data.type.startsWith('tool-') && this.options.showDetails) {
          const details = this.handleResponseTool(data)
          if (details) process.stdout.write(details)
        }
        else {
          const text = this.handleResponseText(data)
          if (text)
            if (this.options.fullResponse) fullText += text
            else process.stdout.write(text)
        }

      }
    })

    if (response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        parser.feed(decoder.decode(value, { stream: true }))
      }
    }

    return fullText

  }


  private async callMetricsChat(messageBody: any): Promise<Response> {
    return await fetch(this.chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(messageBody)
    })
  }


  private async sendPrompt(prompt: string): Promise<boolean> {

    const messageBody = {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      memory: {
        thread: {
          id: threadId
        }
      }
    }

    try {

      const response = await this.callMetricsChat(messageBody)

      let fullText = ''
      if (response.ok) fullText = await this.handleAskResponse(response)
      else await this.handleAskError(response)

      if (this.options.fullResponse && fullText) this.log(fullText)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      this.log(`❌ ${clColor.msg.error('Error:')} ${errorMessage}`)
      if (DEBUG) this.log(inspect(err, false, null, true))
      return false
    } finally {
      if (this.spinner.isSpinning) this.spinner.stop()
    }

    return true

  }


  private goodbyeMessage(): void {
    this.log()
    this.log('👋 Goodbye! See you next time.')
    this.log()
  }


  private async startChat(userInput?: string): Promise<void> {

    // Handle Ctrl+C (SIGINT) gracefully
    process.on('SIGINT', () => {
      this.log()
      this.goodbyeMessage()
      process.exit(0)
    })

    // Create readline interface for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })


    while (true) {

      this.log()
      let input: string

      // If userInput is provided (from command args), use it and skip prompt
      if (userInput) {
        this.log(`${clColor.cyan(userPrompt)}: ${userInput}`)
        input = userInput
        userInput = undefined
      }
      // Otherwise, prompt the user for input
      else {
        try {
          input = await rl.question(`${clColor.cyan(userPrompt)}: `)
          // If the input is an exit command, close the readline interface and exit the loop
          if (exitCommands.includes(input.trim().toLowerCase())) {
            rl.close()
            this.goodbyeMessage()
            return
          }
        } catch (error) {
          // Handle Ctrl+C (SIGINT) gracefully
          if ((error instanceof Error) && (error.name === 'AbortError')) {
            rl.close()
            this.log()
            this.goodbyeMessage()
            this.exit()
          } else throw error
        }
      }

      this.log()
      if (spinnerEnabled) this.spinner.start(this.options.fullResponse ? spinnerLabel : '')

      const ok = await this.sendPrompt(input)
      if (!ok) {
        rl.close()
        this.log()
        return
      }

    }
  }

}
