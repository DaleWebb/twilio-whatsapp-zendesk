import { describe, expect, it } from "vitest";
import { inferDomainFromText } from "./extraction";
import { Domain } from "./types";

const fixtures: [string, Domain][] = [
  [
    "withdraw",
    {
      intent: "withdraw",
      entities: {},
    },
  ],
  [
    "drawdown",
    {
      intent: "withdraw",
      entities: {},
    },
  ],
  [
    "drawdown 500",
    {
      intent: "withdraw",
      entities: {
        amount: 500,
      },
    },
  ],
  [
    "drawdown 1111-1111",
    {
      intent: "withdraw",
      entities: {
        cnic: '1111-1111',
      },
    },
  ],
];

describe("inferDomainFromText", () => {
  it.each(fixtures)("input => \"%s\" \n output => %o", (text, expectedDomain) => {
    const actualDomain = inferDomainFromText(text);
    expect(actualDomain.intent).toEqual(expectedDomain.intent);
    expect(actualDomain.entities).toMatchObject(expectedDomain.entities);
  });
});
