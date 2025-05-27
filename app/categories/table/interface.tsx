export interface TransactionCategory {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  userId: string;
  createdAt: string;
  updatedAt: string;
}
