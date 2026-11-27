import { auth } from "@/auth";
import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to upload an image." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname) => {
        const userId = session.user.id;

        const expectedPrefix = `items/${userId}/`;

        if (!pathname.startsWith(expectedPrefix)) {
          throw new Error("Invalid upload path.");
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Image upload authorization error:", error);

    return NextResponse.json(
      { error: "Unable to authorize image upload." },
      { status: 400 },
    );
  }
}
