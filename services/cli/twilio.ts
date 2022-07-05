import { createInterface, clearScreenDown, cursorTo } from "readline";
import { Domain } from "../domain";
import { executeRouterMachine } from "../machines";

const { stdin: input, stdout: output } = process;

let domain: Domain | null = null;

const clear = () => {
  cursorTo(output, 0, 0);
  clearScreenDown(output);
};

try {
  clear();

  console.log("Type your message...");

  const cli = createInterface({
    input,
    output,
  });

  cli.on("line", async (line) => {
    const nextState = await executeRouterMachine(line, domain ?? undefined);

    nextState.context.responses.forEach((response) => {
      console.log(`↪️ ${response}`);
    });

    domain = !nextState.done ? nextState.context.domain : null;
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
