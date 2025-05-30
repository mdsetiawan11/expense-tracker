import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Ambil semua transaksi user (bisa filter userId, kategori, tanggal, dsb)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const categoryId = searchParams.get("categoryId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const where: any = { userId };
  if (categoryId) where.categoryId = categoryId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

// POST: Tambah transaksi baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, date, note, type, userId, categoryId } = body;

    if (!title || !amount || !date || !type || !userId || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        date: new Date(date),
        note,
        type,
        userId,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// PUT: Update transaksi
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, amount, date, note, type, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(note !== undefined && { note }),
        ...(type !== undefined && { type }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: { category: true },
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus transaksi
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
