"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  type: z.enum(["expenses", "income"], {
    required_error: "You need to select a category type.",
  }),
});

const types = [
  { label: "Expense", value: "EXPENSES" },
  { label: "Expense", value: "EXPENSES" },
] as const;

export function AddSheet() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setLoading(true);

    // Ubah type menjadi format ENUM prisma
    const formattedData = {
      name: formData.name,
      type: formData.type.toUpperCase(), // "income" => "INCOME"
    };

    try {
      const res = await fetch("/api/transaction-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create category");
      }

      // Reset form dan tutup Sheet
      form.reset();
      setOpen(false);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(); // Reset form saat sheet ditutup
    }
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>Add Category</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Add Category</SheetTitle>
          <SheetDescription>
            Category are used to categorize your transactions. You can add,
            edit, or delete categories as needed.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Types</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expenses" />
                        </FormControl>
                        <FormLabel className="font-normal">Expenses</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Save
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
