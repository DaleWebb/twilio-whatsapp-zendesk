import { assign, createMachine } from "xstate";
import {
  createZendeskTicket,
  recordDrawdown,
  validateCnic,
  validateWithdrawalAmount,
} from "../../mocks";
import { BaseMachineContext } from "../types";
import {
  sendHaltEvent,
  queueResponses,
  queueResponseFromChildMachineError,
} from "../utils";
import {
  CONFIRM_CNIC,
  CONFIRM_WITHDRAWAL_AMOUNT,
  ZERO_BALANCE,
} from "./responses";

export interface WithdrawMachineContext extends BaseMachineContext {}

export type WithdrawMachineEvent =
  | { type: "Collected all information" }
  | { type: "Receive CNIC"; data: { cnic: string } }
  | { type: "No CNIC" }
  | { type: "Receive withdrawal amount"; data: { withdrawalAmount: number } }
  | { type: "No withdrawal amount" }
  | { type: "Confirmed" }
  | { type: "Change amount" }
  // Internal data.events
  | {
      type: "done.invoke.Validate CNIC";
      data: { balance: number };
    }
  | {
      type:
        | "error.platform.Validate withdrawal amount"
        | "error.platform.Validate CNIC";
      data: Error;
    };

export const withdrawMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHUCWAXAFhATgQwHdUA7KAOgGEA5ASQrNQgBswBiRUABwHtYNVuxDiAAeiAIwBOcWQAM82QCYArABZFsgOwA2WeOUAaEAE9Eq2QA45FgMwrxmyRc2ztq1QF8PRtFlyEScmo6MgA1PCZGPHRAgAJgilYIQTAGYgA3bgBrVPDIiGiweNoKYR4+GMFhMQRNRStZG3F65W0bdTcbI1MEG2UbMk1VSRGW7VsbSa8fDGx8IlJKErCIqJjSYrpWMBwcbhwyTiZogDN9gFsV-MLN0qQQcv4q+5q6hqax9sVO7rNtbTIimGkkmSlUbTU0xAvjmAUWCSSKTIsHQhTIMP8CyCJTKvCeQheEgcVlUFlUNnGfTJ9XEvwQ6lkcgUxOabS0nm80NmmMC6O58wisQAguduABXYjoBjMNi4ioCAmgGoORQyMk2CxtRSTGxKLomRDKWTKJnyUlqNQjZSaKEY+a8u2EQUi8WSq5rOJEPwCpixPCiiXoRHEVIkTI5d0FdBFL2wgiC-2u9By-HVCR1NXkzV2HV6umqBxkEYjCzKbVtNxaW38uHkR3x30uwOR6KemsNv0ByXbXb7Q7HdBnHCXPJrGPthNd5P3R6VRWidOqsjq7Pa0HaunibSSIsl6QWCz6DTW6ve2t8s8dpvd5Ih5Go6MXuMOieNqcpudphDaiyKMjaTRxE1PQRgZTQ6SpXcRk0CxQLsSQbU5esX0vQJg1DDJslSZDFhwqAEDDbgAGNW0EABtWQAF0PwVL8y03eRNFNSxnG0eo9S8TliG4CA4GEPClhCRgWBo54lUQOp8zaaxJgcIDrU0RxT2feFlmQPB+A2IdblE+cakkRQd21ckhnLJpWnzClAWBAtrVkaQXBsZSeVUkJRyjOIEl0r8NQGVoVBsOpyUkeQgUspjlFsb5tEilxFCBZz7Vc+hYDFIiiLgeAZzxT9CQQAyjPaQL1ApcztAggDrOLVpdX0SlEvPLzsvlMSF3pCw6XYwYjXkXVfM1NwGqxJ9MWdKdpRE5rUzyrclGXLNAsPFR1EUOldBNHrGgQuoQoAoaULjMak3RDT1igWJtNjUbfUTQNvLyjR1H-FRLG+ZRLVLTqNDIYFpAtVxWiA-bcNfYVxvc1sNiun1OyTe7xIQcQ7EzDVSw1bdbFUTrVCYrd-iUcQSvERoLGButQevKVUvSzL4bax6-zYo1fxij7DANelzB+4sEIrHRYMQmZUJBy8jruqbcoR5oEPm1H+k1Jx2jpSQAR5pRXF1TQbEkMmRqSqA6Zqb4C3-QHyRUd6mggg9ueLRbjZPJD215ABlNKMtgLKuBy2iHsPOQQUU5QQXgxx9R6Yn7LIHqkdVBDfxxsnDcQMKOe1KDnGD1xzEJ0tOI8IA */
  createMachine(
    {
  tsTypes: {} as import("./machine.typegen").Typegen0,
  schema: {
    events: {} as WithdrawMachineEvent,
    context: {} as WithdrawMachineContext,
  },
  id: "Withdrawing",
  initial: "CNIC",
  states: {
    CNIC: {
      initial: "idle",
      states: {
        idle: {
          always: [
            {
              cond: "Has CNIC",
              target: "Validating CNIC",
            },
            {
              target: "Waiting for CNIC",
            },
          ],
        },
        "Waiting for CNIC": {
          entry: ["Ask for CNIC", "Wait"],
        },
        "Validating CNIC": {
          invoke: {
            src: "Validate CNIC",
            id: "Validate CNIC",
            onDone: [
              {
                actions: "Set available balance",
                target: "success",
              },
            ],
            onError: [
              {
                actions: ["Forget CNIC", "Send error message"],
                target: "Waiting for CNIC",
              },
            ],
          },
        },
        success: {
          type: "final",
        },
      },
      onDone: {
        target: "Withdrawal Amount",
      },
    },
    "Withdrawal Amount": {
      initial: "idle",
      states: {
        idle: {
          always: [
            {
              actions: "Send insufficient balance message",
              cond: "Not enough balance",
              target: "success",
            },
            {
              cond: "Has withdrawal amount",
              target: "Validating withdrawal amount",
            },
            {
              actions: "Declare balance",
              target: "Waiting for withdrawal amount",
            },
          ],
        },
        "Waiting for withdrawal amount": {
          entry: ["Ask for withdrawal amount", "Wait"],
        },
        "Validating withdrawal amount": {
          invoke: {
            src: "Validate withdrawal amount",
            id: "Validate withdrawal amount",
            onDone: [
              {
                actions: "Enable withdrawal",
                target: "success",
              },
            ],
            onError: [
              {
                actions: "Send error message",
                target: "Waiting for withdrawal amount",
              },
              {
                actions: "Send error message",
                cond: "Not enough balance",
                target: "success",
              },
            ],
          },
        },
        success: {
          type: "final",
        },
      },
      onDone: [
        {
          cond: "Withdrawal enabled",
          target: "Withdrawing",
        },
        {
          target: "Success",
        },
      ],
    },
    Withdrawing: {
      invoke: {
        src: "Record drawdown",
        onDone: [
          {
            actions: ["Inform user", "Create Zendesk ticket"],
            target: "Success",
          },
        ],
      },
    },
    Success: {
      entry: "Finish",
      type: "final",
    },
  },
},

    {
      guards: {
        "Has CNIC": ({ domain }) => !!domain.entities.cnic,
        "Has withdrawal amount": ({ domain }) => !!domain.entities.amount,
        "Not enough balance": ({ memory }) => !memory.balance,
        "Withdrawal enabled": ({ memory }) => !!memory.withdrawalEnabled,
      },
      actions: {
        Wait: sendHaltEvent("Wait"),
        Finish: sendHaltEvent("Finish"),
        "Send error message": queueResponseFromChildMachineError(),
        "Ask for CNIC": queueResponses(CONFIRM_CNIC),
        "Set available balance": assign((context, event) => ({
          memory: {
            ...context.memory,
            balance: event.data.balance,
          },
        })),
        "Declare balance": queueResponses((context) => `Your available balance to withdraw is ${context.memory.balance} Rs`),
        "Send insufficient balance message": queueResponses(ZERO_BALANCE),
        "Forget CNIC": assign({
          domain: ({domain}) => ({
            ...domain,
            entities: {
              ...domain.entities,
              cnic: 'yooooo',
            }
          })
        }),
        "Ask for withdrawal amount": queueResponses(CONFIRM_WITHDRAWAL_AMOUNT),
        "Enable withdrawal": assign((context) => ({
          memory: {
            ...context.memory,
            withdrawalEnabled: true,
          },
        })),
        "Inform user": queueResponses(
          (context) =>
            `Thank you! Your request for ${context.domain.entities.amount} has been processed and your funds will be available in your bank account within 1 hour`
        ),
        "Create Zendesk ticket": createZendeskTicket,
      },
      services: {
        "Validate CNIC": validateCnic,
        "Validate withdrawal amount": validateWithdrawalAmount,
        "Record drawdown": recordDrawdown,
      },
    }
  );
