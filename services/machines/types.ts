import { Domain } from "../domain/types";

interface Memory {
  balance?: number;
  withdrawalEnabled?: boolean;
}

export interface BaseMachineContext {
  domain: Domain;
  responses: string[];
  memory: Memory;
}

export type HaltEventType = "Wait" | "Finish";

export type RouterMachineEvent<
  SpawnedMachineContext extends BaseMachineContext = BaseMachineContext
> = { type: HaltEventType; context: SpawnedMachineContext };
