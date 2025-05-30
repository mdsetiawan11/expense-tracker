export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
  };
  remaining?: number;
}
