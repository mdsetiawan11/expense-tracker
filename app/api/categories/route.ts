import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export interface TransactionCategoryInput {
  name: string;
  type: "INCOME" | "EXPENSE";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const categories = await prisma.transactionCategory.findMany({
    where: { userId },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, userId } = body;

    if (!name || !type || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type !== "INCOME" && type !== "EXPENSE") {
      return NextResponse.json(
        { message: "Invalid type. Must be INCOME or EXPENSE" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.transactionCategory.create({
      data: {
        name,
        type,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      { message: "Transaction category created", data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction category:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, type, userId } = body;

    if (!id || !name || !type || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type !== "INCOME" && type !== "EXPENSE") {
      return NextResponse.json(
        { message: "Invalid type. Must be INCOME or EXPENSE" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.transactionCategory.update({
      where: { id },
      data: {
        name,
        type,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      { message: "Transaction category updated", data: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating transaction category:", error);
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
        { message: "Missing category id" },
        { status: 400 }
      );
    }

    await prisma.transactionCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Transaction category deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction category:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
