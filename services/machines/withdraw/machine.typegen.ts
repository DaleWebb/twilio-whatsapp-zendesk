// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "Set available balance": "done.invoke.Validate CNIC";
    "Forget CNIC": "error.platform.Validate CNIC";
    "Send error message":
      | "error.platform.Validate CNIC"
      | "error.platform.Validate withdrawal amount";
    "Send insufficient balance message": "";
    "Declare balance": "";
    "Enable withdrawal": "done.invoke.Validate withdrawal amount";
    "Inform user": "done.invoke.Withdrawing.Withdrawing:invocation[0]";
    "Create Zendesk ticket": "done.invoke.Withdrawing.Withdrawing:invocation[0]";
    "Ask for CNIC": "" | "error.platform.Validate CNIC";
    Wait:
      | ""
      | "error.platform.Validate CNIC"
      | "error.platform.Validate withdrawal amount";
    "Ask for withdrawal amount":
      | ""
      | "error.platform.Validate withdrawal amount";
    Finish:
      | "done.state.Withdrawing.Withdrawal Amount"
      | "done.invoke.Withdrawing.Withdrawing:invocation[0]";
  };
  internalEvents: {
    "done.invoke.Validate CNIC": {
      type: "done.invoke.Validate CNIC";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.Validate CNIC": {
      type: "error.platform.Validate CNIC";
      data: unknown;
    };
    "error.platform.Validate withdrawal amount": {
      type: "error.platform.Validate withdrawal amount";
      data: unknown;
    };
    "": { type: "" };
    "done.invoke.Validate withdrawal amount": {
      type: "done.invoke.Validate withdrawal amount";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.Withdrawing.Withdrawing:invocation[0]": {
      type: "done.invoke.Withdrawing.Withdrawing:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Validate CNIC": "done.invoke.Validate CNIC";
    "Validate withdrawal amount": "done.invoke.Validate withdrawal amount";
    "Record drawdown": "done.invoke.Withdrawing.Withdrawing:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    "Validate CNIC": "";
    "Record drawdown": "done.state.Withdrawing.Withdrawal Amount";
    "Validate withdrawal amount": "";
  };
  eventsCausingGuards: {
    "Has CNIC": "";
    "Withdrawal enabled": "done.state.Withdrawing.Withdrawal Amount";
    "Not enough balance": "" | "error.platform.Validate withdrawal amount";
    "Has withdrawal amount": "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "CNIC"
    | "CNIC.idle"
    | "CNIC.Waiting for CNIC"
    | "CNIC.Validating CNIC"
    | "CNIC.success"
    | "Withdrawal Amount"
    | "Withdrawal Amount.idle"
    | "Withdrawal Amount.Waiting for withdrawal amount"
    | "Withdrawal Amount.Validating withdrawal amount"
    | "Withdrawal Amount.success"
    | "Withdrawing"
    | "Success"
    | {
        CNIC?: "idle" | "Waiting for CNIC" | "Validating CNIC" | "success";
        "Withdrawal Amount"?:
          | "idle"
          | "Waiting for withdrawal amount"
          | "Validating withdrawal amount"
          | "success";
      };
  tags: never;
}
