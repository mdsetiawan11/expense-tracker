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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  type: z.enum(["EXPENSE", "INCOME"], {
    required_error: "You need to select a category type.",
  }),
});

export function AddSheet({
  onSuccess,
  defaultValues,
  isEdit = false,
}: {
  onSuccess?: () => void;
  defaultValues?: { id?: string; name?: string; type?: "EXPENSE" | "INCOME" };
  isEdit?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "EXPENSE",
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "EXPENSE",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    setLoading(true);
    const res = await fetch("/api/session");
    const data = await res.json();

    const formattedData = {
      name: formData.name,
      type: formData.type,
      userId: data.user.id,
      ...(isEdit && defaultValues?.id ? { id: defaultValues.id } : {}),
    };

    try {
      const res = await fetch("/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            (isEdit ? "Failed to update category" : "Failed to create category")
        );
      }

      if (onSuccess) onSuccess();

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
      form.reset(defaultValues || {}); // Reset form saat sheet ditutup
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
            <Plus /> Category
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>{isEdit ? "Edit Category" : "Add Category"}</SheetTitle>
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
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="EXPENSE" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="INCOME" />
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
              {isEdit ? "Update" : "Save"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
