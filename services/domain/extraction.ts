import { Domain, Intent } from "./types";

const intentTokens: Record<Intent, string[]> = {
  withdraw: ["draw"],
  exit: ["no", "cancel", "stop", "end", "exit"],
};

export const inferDomainFromText = (
  input: string,
  currentDomain: Domain = {
    intent: undefined,
    entities: {},
  }
): Domain => {
  const domain: Domain = currentDomain;

  // Naive intent extraction
  const [
    { 0: firstMatch, index: firstMatchIndex } = {
      0: undefined,
      index: undefined,
    },
    { 0: conflictingMatch, index: conflictingMatchIndex } = {
      0: undefined,
      index: undefined,
    },
  ] = Array.from(
    input.matchAll(
      new RegExp(
        Object.entries(intentTokens)
          .map(([intent, tokens]) => `(?<${intent}>${tokens.join("|")})`)
          .join("|"),
        "gi"
      )
    )
  );

  const [withdrawingIntent] = input.match(/draw/gi) ?? [undefined];
  const [exitIntent] = input.match(/no|cancel|stop|end|exit/gi) ?? [undefined];

  if (withdrawingIntent) {
    domain.intent = "withdraw";
  } else if (exitIntent) {
    domain.intent = "exit";
  }

  // Naive identifier extraction
  const [cnic] = input.match(/(-{0,1}\d+-\d+)+/g) ?? [undefined];
  if (cnic) {
    domain.entities.cnic = cnic;
  }

  // Naive amount extraction
  const [amount] = (cnic ? input.replace(cnic, "") : input).match(/\d+/g) ?? [
    undefined,
  ];
  if (amount) {
    domain.entities.amount = parseInt(amount);
  }

  return domain;
};
