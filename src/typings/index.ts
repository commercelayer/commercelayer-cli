export type GeneralQuestions = {
  choices?: string[] | Function
  default?: any
  message: string
  name: string
  type: string
  validate?: (value: string) => true | string
}[]
