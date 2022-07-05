export type WhatsAppNumber = `whatsapp:+${number}`;

interface MessageResponse {
  from: WhatsAppNumber;
  body: string | null;
}

export const fromBase64 = (base64String: string): MessageResponse => {
  const buff = Buffer.from(base64String, "base64");
  const formEncodedParams = buff.toString("utf-8");
  const urlSearchParams = new URLSearchParams(formEncodedParams);

  return {
    from: urlSearchParams.get("From") as WhatsAppNumber,
    body: urlSearchParams.get("Body"),
  };
};
