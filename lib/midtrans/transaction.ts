import snap from "./init";

const createTransaction = async (params: any) => {
  try {
    const transaction = await snap.createTransaction(params);
    console.log("Transaction token:", transaction.token);
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export default createTransaction;
