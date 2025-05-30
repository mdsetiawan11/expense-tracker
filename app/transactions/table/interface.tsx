export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  note?: string | null;
  type: "INCOME" | "EXPENSE";
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
  };
}
