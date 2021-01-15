export type GeneralQuestions = {
  name: string
  type: string
  message: string
  validate?: (value: string) => true | string
}[]
