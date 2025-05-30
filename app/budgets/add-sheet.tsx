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

// Budget form schema
const FormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, "Amount must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
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
    amount?: number;
    categoryId?: string;
    month?: number;
    year?: number;
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
      amount: defaultValues?.amount ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      month: defaultValues?.month ?? new Date().getMonth() + 1,
      year: defaultValues?.year ?? new Date().getFullYear(),
    },
  });

  // Fetch categories if not provided
  useEffect(() => {
    if (!categories.length && open && categoryList.length === 0) {
      fetchCategories().then((data) => {
        setCategoryList(data.filter((cat) => cat.type === "EXPENSE"));
      });
    }
  }, [categories]);

  useEffect(() => {
    form.reset({
      amount: defaultValues?.amount ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
      month: defaultValues?.month ?? new Date().getMonth() + 1,
      year: defaultValues?.year ?? new Date().getFullYear(),
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

      const res = await fetch("/api/budgets", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? {
                id: defaultValues?.id,
                categoryId: formData.categoryId,
                amount: formData.amount,
                month: formData.month,
                year: formData.year,
              }
            : payload
        ),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to save budget");
      }

      if (onSuccess) onSuccess();
      form.reset();
      setOpen(false);
      toast({
        title: "Success",
        description: result.message,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Cant save budget",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        amount: defaultValues?.amount ?? 0,
        categoryId: defaultValues?.categoryId ?? "",
        month: defaultValues?.month ?? new Date().getMonth() + 1,
        year: defaultValues?.year ?? new Date().getFullYear(),
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
                  alt="Delete"
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
            <Plus /> Budget
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>{isEdit ? "Edit Budget" : "Add Budget"}</SheetTitle>
          <SheetDescription>
            Set your budget for a category and period.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {categoryList.map((cat) => (
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
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
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
                name="year"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2000}
                        max={2100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
