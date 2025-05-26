"use server";

import z from "zod";
import { auth } from "./auth/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

const SignUpFormSchema = z.object({
  email: z.string().email({
    message: "Email must be valid.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignInFormSchema = z.object({
  email: z.string().email({
    message: "Email must be valid.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 8 characters.",
  }),
});

export async function SignUp(data: z.infer<typeof SignUpFormSchema>) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "User already exist." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid request." };
        default:
          return { errorMessage: "An unexpected error occurred." };
      }
    }
  }
  return { errorMessage: null };
}

export async function signIn(data: z.infer<typeof SignInFormSchema>) {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { errorMessage: "User not found." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid request." };
        default:
          return { errorMessage: "An unexpected error occurred." };
      }
    }
  }
  return { errorMessage: null };
}
