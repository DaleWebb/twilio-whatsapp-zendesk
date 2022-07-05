import { Api, StackContext } from "@serverless-stack/resources";

export function ApiStack({ stack }: StackContext) {
  const api = new Api(stack, "Api", {
    routes: {
      "POST /twilio": "lambda/twilio.handler",
    },
  });

  stack.addOutputs({
    api: api.url,
  });
}
