import Twilio from "twilio";
import { Domain } from "../domain";

const { MessagingResponse } = Twilio.twiml;

const DOMAIN_CONTEXT_COOKIE_NAME = "app.domainContext";

export const getDomainContextCookieValue = (
  cookieKeyValueStrings: `${string}=${string}`[]
): string | null =>
  cookieKeyValueStrings
    .map((cookieKeyValueString) => cookieKeyValueString.split("="))
    .find(([key]) => key === DOMAIN_CONTEXT_COOKIE_NAME)?.[1] ?? null;

export const twilioMessageResponse = (
  messages: (string | undefined)[],
  domain?: Domain
) => {
  const messagingResponse = new MessagingResponse();

  (messages.filter(Boolean) as string[]).forEach((message) =>
    messagingResponse.message(message)
  );

  const serializedDomain = domain ? JSON.stringify(domain) : null;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/xml",
      "Set-Cookie": `${DOMAIN_CONTEXT_COOKIE_NAME}=${serializedDomain}`,
    },
    body: messagingResponse.toString(),
  };
};
