import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const where: any = { userId };
  if (month) where.month = Number(month);
  if (year) where.year = Number(year);

  const budgets = await prisma.budget.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(budgets);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, categoryId, amount, month, year } = body;

    if (!userId || !categoryId || !amount || !month || !year) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada budget untuk kombinasi user, kategori, bulan, tahun
    const existing = await prisma.budget.findUnique({
      where: {
        userId_categoryId_month_year: {
          userId,
          categoryId,
          month,
          year,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Budget already exists for this category and period" },
        { status: 409 }
      );
    }

    const newBudget = await prisma.budget.create({
      data: {
        userId,
        categoryId,
        amount,
        month,
        year,
      },
    });

    return NextResponse.json(
      { message: "Budget created", data: newBudget },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, amount, categoryId, month, year } = body;

    if (!id || typeof amount !== "number" || !categoryId || !month || !year) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Cek apakah budget dengan id tersebut ada
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (existingBudget != null) {
      const existing = await prisma.budget.findUnique({
        where: {
          userId_categoryId_month_year: {
            userId: existingBudget.userId,
            categoryId,
            month,
            year,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { message: "Budget already exists for this category and period" },
          { status: 409 }
        );
      }

      const updatedBudget = await prisma.budget.update({
        where: { id },
        data: { amount, categoryId, month, year },
      });

      return NextResponse.json(
        { message: "Budget updated", data: updatedBudget },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Missing budget id" },
        { status: 400 }
      );
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Budget deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
