
type Trigger = {
	action: string;
  trigger: string;
  description: string;
}


const triggers: { [key: string ]: Trigger } = {
  ##__TRIGGERS__##
}


export { triggers, Trigger }



export type ActionType =
  ##__ACTION__##
