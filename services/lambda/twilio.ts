import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { fromBase64 } from "../utils/message-parser";
import { executeRouterMachine } from "../machines";
import { Domain } from "../domain";
import { twilioMessageResponse, getDomainContextCookieValue } from "../utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) return { statusCode: 200 };

  const { body } = fromBase64(event.body);

  if (!body) return { statusCode: 200 };

  const domainContextCookieValue = event.cookies
    ? getDomainContextCookieValue(event.cookies as any)
    : undefined;

  const savedDomainContext = domainContextCookieValue
    ? (JSON.parse(
        domainContextCookieValue
          // The quotation marks in the JSON for strings are doubly escaped
          // so we need to unescape them
          .replace(/\\"/g, '"')
      ) as Domain | null)
    : undefined;

  const nextState = await executeRouterMachine(
    body,
    savedDomainContext ?? undefined
  );

  return twilioMessageResponse(
    nextState.context.responses,
    !nextState.done ? nextState.context.domain : undefined
  );
};