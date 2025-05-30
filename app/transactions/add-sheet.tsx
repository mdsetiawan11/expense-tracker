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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { TransactionCategory } from "../categories/table/interface";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Transaction form schema
const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, "Amount must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]),
});

type Category = { id: string; name: string; type: string };

async function fetchCategories(): Promise<TransactionCategory[]> {
  const sessionRes = await fetch("/api/session");
  const session = await sessionRes.json();

  const userId = session?.user?.id;
  if (!userId) return [];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?userId=${userId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return response.json();
}

export function AddSheet({
  onSuccess,
  categories = [],
  defaultValues,
  isEdit = false,
}: {
  onSuccess?: () => void;
  categories?: Category[];
  defaultValues?: {
    id?: string;
    title?: string;
    amount?: number;
    categoryId?: string;
    date?: string;
    note?: string;
    type?: "INCOME" | "EXPENSE";
  };
  isEdit?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      date: defaultValues?.date
        ? new Date(defaultValues.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      note: defaultValues?.note ?? "",
      type: defaultValues?.type ?? "EXPENSE",
    },
  });

  // Fetch categories jika belum ada
  useEffect(() => {
    if (!categories.length && open && categoryList.length === 0) {
      fetchCategories().then((data) => {
        setCategoryList(data);
      });
    }
  }, [categories, open, categoryList.length]);

  useEffect(() => {
    form.reset({
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      date: defaultValues?.date
        ? new Date(defaultValues.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      note: defaultValues?.note ?? "",
      type: defaultValues?.type ?? "EXPENSE",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const sessionRes = await fetch("/api/session");
      const session = await sessionRes.json();

      const payload = {
        ...formData,
        userId: session.user.id,
      };

      const res = await fetch("/api/transactions", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? { id: defaultValues?.id, ...formData } : payload
        ),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save transaction");
      }

      if (onSuccess) onSuccess();
      form.reset();
      setOpen(false);
      toast({
        title: "Success",
        description: isEdit ? "Transaction updated" : "Transaction added",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Can't save transaction",
        description: error?.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        title: defaultValues?.title ?? "",
        amount: defaultValues?.amount ?? 0,
        categoryId: defaultValues?.categoryId ?? "",
        date: defaultValues?.date
          ? new Date(defaultValues.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        note: defaultValues?.note ?? "",
        type: defaultValues?.type ?? "EXPENSE",
      });
      setCategoryList([]);
    }
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {isEdit ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src="/svg/edit.svg"
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setOpen(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button onClick={() => setOpen(true)}>
            <Plus /> Transaction
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? "Edit your transaction." : "Add a new transaction."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryList
                          .filter((cat) => cat.type === form.watch("type"))
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {isEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
