
type Trigger = {
	action: string;
  trigger: string;
  description: string;
}


const triggers: Record<string, Trigger> = {
  ##__TRIGGERS__##
}


export { triggers, type Trigger }



export type ActionType =
  ##__ACTION__##
