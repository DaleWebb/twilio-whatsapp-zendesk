import { BaseMachineContext } from "../machines/types";

interface EmployeeData {
  balance: number;
}

const cnicData: Partial<Record<string, EmployeeData>> = {
  // Happy path
  "111-111": {
    balance: 1000,
  },
  // Nothing left to withdraw
  "222-222": {
    balance: 0,
  },
};

export const createZendeskTicket = async () => null;

export const validateCnic = async (context: BaseMachineContext) => new Promise<EmployeeData>((resolve, reject) => {
    const { cnic } = context.domain.entities;
  
    // DB check for user from the CNIC passed by the event load
    if (!cnic) return reject(new Error("No CNIC"));
  
    const result = cnicData[cnic];
  
    if (!result) return reject(new Error(`That CNIC number, ${cnic}, could not be found.`));

    resolve(result)
})

export const validateWithdrawalAmount = async (context: BaseMachineContext) =>
  new Promise((resolve, reject) => {
    const { amount, cnic } = context.domain.entities;

    // We need to find a way know that this value will be truthy
    if (!cnic) return reject(new Error("No CNIC"));

    const result = cnicData[cnic];


    if (!result)
      return reject(
        new Error(`That CNIC number, ${cnic}, could not be found.`)
      );

    if (!result.balance)
      return reject(new Error("You have no balance to withdraw"));

    if (!amount) return reject(new Error("No withdrawal amount provided"));

    if (amount < 1) return reject(new Error("You must withdraw at least 1"));

    if (amount > result.balance)
      return reject(
        new Error(`You have insufficient balance to withdraw ${amount}`)
      );

    resolve(true);
  });

export const recordDrawdown = async () => null;
