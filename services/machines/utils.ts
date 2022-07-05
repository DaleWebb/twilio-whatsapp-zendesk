import { assign, EventObject, sendParent, spawn, StateMachine } from "xstate";
import { BaseMachineContext, HaltEventType, RouterMachineEvent } from "./types";

export const sendHaltEvent = <
  MachineContext extends BaseMachineContext = BaseMachineContext
>(
  type: HaltEventType = "Wait"
) =>
  sendParent<MachineContext, any, RouterMachineEvent<MachineContext>>(
    (context) => ({ type, context })
  );

export const queueResponses = <
  MachineContext extends BaseMachineContext = BaseMachineContext,
  TEvent extends EventObject = EventObject
>(
  responses:
    | string
    | string[]
    | ((context: MachineContext, event: TEvent) => string | string[])
) =>
  assign<MachineContext, TEvent>({
    responses: (context, event) =>
      context.responses.concat(
        typeof responses === "function" ? responses(context, event) : responses
      ) as any,
  });

export const queueResponsesFromChildMachineEvent = <MachineContext extends BaseMachineContext>() =>
  queueResponses<MachineContext, RouterMachineEvent>(
    (_, event) => event.context.responses
  );

export const queueResponseFromChildMachineError = <MachineContext extends BaseMachineContext>() =>
  queueResponses<MachineContext, {type: any; data: Error}>(
    (_, event) => event.data.message
  );

export const spawnChildMachine = <
  Machines extends Record<string, any> = Record<string, any>,
  TEvent extends EventObject = EventObject
>(
  machineName: keyof Machines,
  machine: StateMachine<any, any, any, any, any, any, any>
) =>
  assign<BaseMachineContext & { machines: Machines }, TEvent>({
    machines: (context) => ({
      ...context.machines,
      [machineName]: spawn(
        machine.withContext({
          domain: context.domain,
          responses: [],
        }),
        {
          sync: true,
        }
      ),
    }),
  });
