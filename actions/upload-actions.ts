"use server";

import { env } from "@/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3Client = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const ALLOWED_FILE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE_BYTES = 5242880;

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  fileSize: number,
  clientSecret: string,
) {
  try {
    // first security layer

    if (clientSecret !== env.ADMIN_SECRET) {
      console.warn("Unauthorized upload attempt detected!");
      return { success: false, message: "Unauthorized" };
    }

    // second security layer
    if (!ALLOWED_FILE_TYPE.includes(contentType)) {
      return {
        success: false,
        message: "Invalid file type. Only JPG, PNG, WebP, and PDF are allowed.",
      };
    }

    // third security layer
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        message: "File is too large. Maximum size is 5MB.",
      };
    }
    // create unique filename
    const uniqueFileName = `${crypto.randomUUID()}-${filename.replace(/\s+/g, "-")}`;

    // define upload command
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    // generate the ticket (expires in 60 seconds)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    // calculate final public url to save to postgres database
    const publicUrl = `${env.R2_PUBLIC_URL}/${uniqueFileName}`;
    return { success: true, presignedUrl, publicUrl };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { success: false, message: "Failed to initialize upload" };
  }
}
