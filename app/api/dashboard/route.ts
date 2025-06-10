import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Total Income & Expense bulan ini
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          type: "INCOME",
          date: {
            gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            lt: new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`),
          },
        },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          type: "EXPENSE",
          date: {
            gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            lt: new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`),
          },
        },
      }),
    ]);

    // Saldo total (seluruh waktu)
    const [totalIncome, totalExpense] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "INCOME" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "EXPENSE" },
      }),
    ]);
    const balance = (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0);

    // Jumlah transaksi bulan ini
    const transactionCount = await prisma.transaction.count({
      where: {
        userId,
        date: {
          gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
          lt: new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`),
        },
      },
    });

    // Jumlah kategori
    const categoriesCount = await prisma.transactionCategory.count({
      where: { userId },
    });

    // 5 transaksi terakhir
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { category: true },
    });

    // Budget bulan ini
    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
    });

    // Progress budget per kategori
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: {
              gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
              lt: new Date(`${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-01`),
            },
          },
        });
        const spentAmount = spent._sum.amount || 0;
        return {
          ...budget,
          spent: spentAmount,
          remaining: budget.amount - spentAmount,
          progress: budget.amount > 0 ? Math.min(100, Math.round((spentAmount / budget.amount) * 100)) : 0,
        };
      })
    );

   

    return NextResponse.json({
      balance,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0,
      incomeMonth: income._sum.amount || 0,
      expenseMonth: expense._sum.amount || 0,
      transactionCount,
      categoriesCount,
      budgets: budgetsWithProgress,
      recentTransactions,
      
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}