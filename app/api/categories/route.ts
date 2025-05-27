import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export interface TransactionCategoryInput {
  name: string;
  type: "INCOME" | "EXPENSE";
}

export async function GET(request: Request) {
  const { data: session, error: sessionError } = await authClient.getSession();

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const categories = await prisma.transactionCategory.findMany({
    where: { userId: userId },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized or missing session" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, type } = body;

    if (!name || !type) {
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
