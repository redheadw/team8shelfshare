"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadFieldProps {
  userId: string;
  initialImageUrl?: string | null;
  required?: boolean;
}

export default function ImageUploadField({
  userId,
  initialImageUrl = null,
  required = false,
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? "");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      setPreviewUrl(null);
      input.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("The image must not exceed 5 MB.");
      setPreviewUrl(null);
      input.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

      const blob = await upload(`items/${userId}/${safeFileName}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: file.type,
      });

      setImageUrl(blob.url);
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      setError("Unable to upload the image. Please try again.");
      setPreviewUrl(null);
      input.value = "";
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setPreviewUrl(null);
    setImageUrl("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor="itemImage" className="block font-medium text-[#1C1917]">
        Product image {required && "(required)"}
      </label>

      <input
        id="itemImage"
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        ref={fileInputRef}
        required={required && !imageUrl}
        aria-required={required}
        aria-describedby="image-help image-error"
        aria-invalid={Boolean(error)}
        className="mt-2 w-full rounded-lg border border-[#E7E5E4] p-3"
      />

      <input type="hidden" name="imageUrl" value={imageUrl} />

      <p id="image-help" className="mt-1 text-sm text-[#57534E]">
        JPG, PNG, or WebP. Maximum file size: 5 MB.
      </p>

      {isUploading && (
        <p role="status" className="mt-2 text-sm text-[#047857]">
          Uploading image...
        </p>
      )}

      {imageUrl && !isUploading && (
        <p className="mt-2 text-sm text-[#047857]">
          Image uploaded successfully.
        </p>
      )}

      {error && (
        <p id="image-error" role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview of the selected product"
            className="h-48 w-full rounded-lg border border-[#E7E5E4] object-contain"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={handleRemoveImage}
            className="mt-2 text-sm font-semibold text-red-600 underline disabled:opacity-50"
          >
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
