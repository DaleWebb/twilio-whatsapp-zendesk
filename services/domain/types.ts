export type Intent = "withdraw" | "exit";

export interface Domain {
  intent: Intent | undefined;
  entities: {
    cnic?: string;
    amount?: number;
  };
}