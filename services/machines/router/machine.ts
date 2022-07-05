import { createMachine, interpret, spawn } from "xstate";
import { withdrawMachine } from "../withdraw";
import { BaseMachineContext, RouterMachineEvent } from "../types";
import { inferDomainFromText, Domain } from "../../domain";
import {
  queueResponses,
  spawnChildMachine,
  queueResponsesFromChildMachineEvent,
} from "../utils";
import { waitFor } from "xstate/lib/waitFor";
import { CLARIFY_INTENT_RESPONSE, EXIT_RESPONSE } from "./responses";

interface RouterMachineContext extends BaseMachineContext {
  machines: {
    withdrawMachine?: ReturnType<typeof spawn>;
  };
}

const routerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUD2BXALmATgOgEsIAbMAYkVAAdVYDMDUA7SkAD0QEYA2TvABkFDOAFm4BmAByd+IgDQgAnogDskyQKEiArCJX8ZncQF9jCtFlx4A7vQAWEHAENreAMKpipAMYMmUAAICJgAzVBwAWycGZncAOQBJN0ISclYaOhiWJHZESQBObTwVfO4C-IAmEXEJcRUFZQRtEs1BCv5JbQr9UtNzDGx8W0wHZ1cPLzBfYMDgsMjoxiZ4pLwAdSd6GYD5gLdEtzJkKbACADcwPYP02i3mVg4EfIK8bW4K5qqy8QMGxBFOEUhAYdNpOPkeB8+iALIMbPZHC53J4fH5ZqFwlEsitkgA1JzEIiLfxXJJkCDMMCEJhnVAAaypsKsw1GSImqO2c0xi1i+1W+MJEGJgT5bgQwVp3h5TAA2vwALo3TJLB55QrFUrlKo1cR1P4IcQVDTAzg8FQqbTaSQSaFMoYIsbIybTElchbY0V4AVEtGkw64HDhPBUYjReYRPB2+EjRHjFFTX1urFLHFegk+7ai8U01BSrJyxU5DJ3bKgR4FIolMr5SrVWr1JT-CStQTcQpVEoVW0DZkOtnxl3o8PS9Z96wEgIAQQiGCYmBSpAoRduWVVT2qAnydU6lV0H04+tNVpbOny-EK-AqXbMMJ79pjjvZCc5GPdKbWY4n09n842WxJuwsrGE5ODO6BzkcUwEGAFwBEBYwgWBc5KiWa6GPweDVBakgqDol7nuI+o1uIeA1mRFrgrIurdpY96snGzqJq+yaxB+D4uF+SHzt6Qq+vBHHEAEoE-uSlLUrSDKRne0b0U6HKusxI5sfRnE-mmgrCnBn6CcJ4GYNmkrSgWKGrjkjz5BuBFqNou4iPuRH8CoLYVPkKjgiI-BtjRcL8Qx8lDty2LKcBgnfnp6kZiSvmISJAZBiGYaYlJtEybGcnPgpw5BdpU5cRFvHbNFOlcQZuZGQqJkqmZiAWSRVk7h8dlgoesgVC2nAlCUUjUTeUa+elg5BIpWSiUwVKwJg0SMtJ-VPoNSbSpV9zVQgPCeXgkhGqIZTdOe3DcPq5oiKRZGVLq-Bgt5vbsa4wVjDMo1UhK9LTSl-V3S4MylXmSzGcuyrLWWiCWm1HnvLosglPwNSHhITmnYUuHPCo4jaFddGxo9eATVNyU+WOS2lrkCDtFepGSCIejtJw6iiERogtuINY8GeeimDeTCoBAcCsFGRCkITa52Q5xpaGaOGUyI6OpY+A5MVlKaevzYCCytKi8Bq1Znq5HzdPq3DaCR2hCFedSVNa179G9Y4DfLgWKwc6ybL6uyiqrQOraIGEiBTALiHZnDtO8+oiFurzAro-sVNwAJo71M023Ndtvryjs8Zpbv-ahK3cJemGeY1kNnjDjYGnZeAfIIge4aapQWdLs1yy+Cup6ssDoN43hwPAWemR7poeZhvtGAHQcVPq-t8MbVc8LwqOiA3idN5l9ut247vE80Ghg4XejFwdpcfECwhXmoHzWovN2283q-LB946hXlysb+W56btuzRQ5TB6l4Hhrh1XLc6sfgdUvrJJON8U53xymFOcTt-yBEAjlXSyFe5VX7vucmlNo5nhRuaSQLUVBtWntDWQEILplDAWlCBK8oGjhuqpcK6c+LIK4i-RAudQYFwhnvaGB9GiVD4JXEEZE7KeSobLRikCWLQIYY-NS7dO7d3YatTBzxsFtkcnUNQRF2gANkJeD4vBeASP7FI2hMj6EqXkXpFRW987gw8rwkujRJD+2cmUQOEgfamL8hlAKUC7G6AcbvKGLiuCbRbFZUQ1o2bx2tlfe+MwVEdT0TTXC1o2z6AqD-RouESKhzIoHCENNui+LwAAZQ7l3WAPdqArnQcTNQfBCk1l4IHaojlYb7UZhIHJhopbxPxjdOxRoQk8LCfwrgb9gSeTEHoUQPUrZwjAGwegKj+ncDwP7KQpp1A4SkCLE84tcKU3RikghpdUYnQRrcuOpggA */
  createMachine(
    {
      tsTypes: {} as import("./machine.typegen").Typegen0,
      schema: {
        events: {} as RouterMachineEvent,
        context: {} as RouterMachineContext,
      },
      id: "Router",
      initial: "idle",
      states: {
        idle: {
          always: [
            {
              cond: "Intent to withdraw wage",
              target: "withdraw",
            },
            {
              cond: "Intent to leave conversation",
              actions: "Say goodbye",
              target: "exit",
            },
            {
              actions: "Ask user to clarify intent",
              target: "exit",
            },
          ],
        },
        withdraw: {
          entry: "Start withdraw machine",
          on: {
            Wait: {
              actions: "Hoist responses",
              target: "waiting",
            },
            Finish: {
              actions: "Hoist responses",
              target: "exit",
            },
          },
        },
        waiting: {
          tags: ["waiting"],
        },
        exit: {
          type: "final",
        },
      },
    },
    {
      guards: {
        "Intent to withdraw wage": (context) =>
          context.domain.intent === "withdraw",
        "Intent to leave conversation": (context) =>
          context.domain.intent === "exit",
      },
      actions: {
        "Ask user to clarify intent": queueResponses(CLARIFY_INTENT_RESPONSE),
        "Say goodbye": queueResponses(EXIT_RESPONSE),
        "Hoist responses": queueResponsesFromChildMachineEvent(),
        "Start withdraw machine": spawnChildMachine(
          "withdrawMachine",
          withdrawMachine
        ),
      },
    }
  );

export const executeRouterMachine = (
  message: string = "",
  currentDomain?: Domain
) => {
  const domain = inferDomainFromText(message, currentDomain);

  const context: RouterMachineContext = {
    domain,
    machines: {},
    responses: [],
    memory: {},
  };

  const routerMachineWithContext = routerMachine.withContext(context);

  const actor = interpret(routerMachineWithContext).start();

  return waitFor(actor, (state) => !!state.done || state.hasTag("waiting"));
};
