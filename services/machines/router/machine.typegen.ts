// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "Say goodbye": "";
    "Ask user to clarify intent": "";
    "Hoist responses": "Wait" | "Finish";
    "Start withdraw machine": "";
  };
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    "Intent to withdraw wage": "";
    "Intent to leave conversation": "";
  };
  eventsCausingDelays: {};
  matchesStates: "idle" | "withdraw" | "waiting" | "exit";
  tags: "waiting";
}
