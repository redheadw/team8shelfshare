
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password, neighborhood } = body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof neighborhood !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid registration information." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanNeighborhood = neighborhood.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanNeighborhood ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      password.length < 8 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Please provide valid registration information." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await sql`
      INSERT INTO users (name, email, password_hash, neighborhood)
      VALUES (
        ${cleanName},
        ${cleanEmail},
        ${passwordHash},
        ${cleanNeighborhood}
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, neighborhood
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error);

    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}
