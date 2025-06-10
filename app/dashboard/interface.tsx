export interface DashboardData {
  balance: number,
  totalIncome: number,
  totalExpense: number,
  transactionCount: number,
  categoriesCount: number,
  budgets: Array<{
    category: string,
    amount: number,
    spent: number,
    remaining: number,
    progress: number // %
  }>,
  recentTransactions: Array<{
    title: string,
    amount: number,
    date: string,
    category: string,
    type: "INCOME" | "EXPENSE"
  }>,
  incomeExpenseChart: Array<{ month: string, income: number, expense: number }>,
  expenseByCategory: Array<{ category: string, amount: number }>,

}