"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { itemSchema } from "@/schema/item-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export function ItemForm() {
  const form = useForm<z.infer<typeof itemSchema>>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
    },
    resolver: zodResolver(itemSchema),
  });

  function onSubmit(data: z.infer<typeof itemSchema>) {
    console.log(data);
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <Input
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
                type="text"
                placeholder="Enter the name of the item"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <Input
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
                type="text"
                placeholder="Enter a description of the item"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => {
              const displayValue =
                field.value === 0
                  ? ""
                  : field.value.toLocaleString("en-MY", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price (MYR)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="tel"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={displayValue}
                      onChange={(e) => {
                        // get raw string
                        const rawString = e.target.value;
                        // strip everything except number
                        const justDigits = rawString.replace(/\D/g, "");
                        // parse to integer cents
                        const cents = parseInt(justDigits || "0", 10);
                        // convert back to float for zod
                        const floatValue = cents / 100;
                        field.onChange(floatValue);
                      }}
                    />
                    <InputGroupAddon>
                      <InputGroupText>RM</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
          <Controller
            name="stock"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Stock</FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  type="tel"
                  placeholder="Enter the stock quantity"
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    // native input return string, parse int for zod
                    const justDigit = e.target.value.replace(/\D/g, "");
                    const val = parseInt(justDigit || "0", 10);
                    field.onChange(val);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <div className="flex justify-end w-full pt-4 gap-4">
        <Button
          type="button"
          variant="destructive"
          onClick={() => form.reset()}
          disabled={form.formState.isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
