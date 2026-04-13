"use client";
import { createItem, updateItem } from "@/actions/items-actions";
import { getPresignedUploadUrl } from "@/actions/upload-actions";
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
import { FileText } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ItemFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
    pdfUrl?: string | null;
  };
  onSuccess?: () => void;
}
export function ItemForm({ initialData, onSuccess }: ItemFormProps) {
  // manage the file outside of react hook form
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // create ref to track the blob URL for memory cleanup
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    // memory cleanup
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (file) {
      // create the url, save to ref, and set to state
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      // if click cancel, revert to database image
      setPreviewUrl(initialData?.imageUrl || null);
    }
  };

  // use effect for unmounting
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const form = useForm<z.infer<typeof itemSchema>>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price / 100,
          stock: initialData.stock,
          imageUrl: initialData.imageUrl || "",
          pdfUrl: initialData.pdfUrl || "",
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          imageUrl: "",
          pdfUrl: "",
        },
    resolver: zodResolver(itemSchema),
  });

  async function onSubmit(data: z.infer<typeof itemSchema>) {
    let finalImageUrl = initialData?.imageUrl || null;
    let finalPdfUrl = initialData?.pdfUrl || null;

    if (imageFile) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        toast.info(
          "Cloud uploads are disabled in this public demo to prevent abuse. Check the GitHub repo to see the Cloudflare R2 implementation!",
        );
        finalImageUrl = "https://placehold.co/400x400/png?text=Demo+Mode";
      }
      const { success, presignedUrl, publicUrl, message } =
        await getPresignedUploadUrl(
          imageFile.name,
          imageFile.type,
          imageFile.size,
          "Y3k1YPUFyv+JKxruHCT+cOoq6AeqWRkyQB68xdyuKtI=",
        );
      if (success && presignedUrl) {
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: imageFile,
          headers: { "Content-Type": imageFile.type },
        });

        if (uploadResponse.ok) {
          // upload image successfully, overwrite the old url
          finalImageUrl = publicUrl;
        } else {
          toast.error("Failed to upload image to cloud storage");
          return;
        }
      } else {
        toast.error(message);
        return;
      }
    }

    if (pdfFile) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        toast.info(
          "Cloud uploads are disabled in this public demo to prevent abuse. Check the GitHub repo to see the Cloudflare R2 implementation!",
        );
        finalPdfUrl = "https://placehold.co/400x400/png?text=Demo+Mode";
      } else {
        const { success, presignedUrl, publicUrl, message } =
          await getPresignedUploadUrl(
            pdfFile.name,
            pdfFile.type,
            pdfFile.size,
            "Y3k1YPUFyv+JKxruHCT+cOoq6AeqWRkyQB68xdyuKtI=",
          );

        if (success && presignedUrl) {
          const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: pdfFile,
            headers: { "Content-Type": pdfFile.type },
          });

          if (uploadResponse.ok) {
            finalPdfUrl = publicUrl;
          } else {
            toast.error("Failed to upload PDF");
            return;
          }
        } else {
          toast.error(message);
          return;
        }
      }
    }

    // Insert database, merge the text data from react hook form with the new cloudfare url string
    const payload = {
      ...data,
      imageUrl: finalImageUrl,
      pdfUrl: finalPdfUrl,
    };

    let result;
    if (initialData) {
      result = await updateItem(initialData.id, payload);
    } else {
      result = await createItem(payload);
    }
    if (result?.success) {
      toast.success(result.message);
      if (!initialData) {
        form.reset();
        setImageFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setPdfFile(null);

        if (pdfInputRef.current) {
          pdfInputRef.current.value = "";
        }
      }
      if (onSuccess) onSuccess();
    } else {
      toast.error(result?.message);
    }
  }
  return (
    <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)}>
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
        <Field>
          <FieldLabel>Product Image (Optional)</FieldLabel>

          <Input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="cursor-pointer file:cursor-pointer file:text-foreground"
          />
          {previewUrl && (
            <div className="relative mt-4 h-48 w-48 overflow-hidden rounded-xl border border-border shadow-sm">
              <Image
                src={previewUrl}
                alt="Product Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw,33vw"
              />
            </div>
          )}
        </Field>
        <Field>
          <FieldLabel>Product Manual</FieldLabel>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            ref={pdfInputRef}
            className="cursor-pointer file:cursor-pointer file:text-foreground"
          />
          {(pdfFile || initialData?.pdfUrl) && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md border border-border w-fit">
              <FileText className="size-4 text-blue-500" />
              {pdfFile ? (
                <span>{pdfFile.name}</span>
              ) : (
                <a
                  href={initialData!.pdfUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                >
                  {initialData!.pdfUrl!.split("/").pop()}
                </a>
              )}
              <span></span>
            </div>
          )}
        </Field>
      </FieldGroup>
      <div className="flex justify-end w-full pt-4 gap-4">
        {!initialData && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
              setImageFile(null);
              setPreviewUrl(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              setPdfFile(null);
              if (pdfInputRef.current) {
                pdfInputRef.current.value = "";
              }
            }}
            disabled={form.formState.isSubmitting}
          >
            Clear
          </Button>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Submitting..."
            : initialData
              ? "Save Changes"
              : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
