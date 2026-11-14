
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT sessions for authentication.
  session: {
    strategy: "jwt",
  },

  // Custom login page.
  pages: {
    signIn: "/login",
  },

  // Store the database user ID in the JWT and session.
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },

  // Email and password authentication.
  providers: [
    Credentials({
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Validate credentials.
        if (
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        // Find the user in Neon PostgreSQL.
        const users = await sql`
          SELECT id, name, email, password_hash
          FROM users
          WHERE email = ${email.trim().toLowerCase()}
          LIMIT 1
        `;

        if (users.length === 0) {
          return null;
        }

        const user = users[0];

        // Verify the password against the stored hash.
        const validPassword = await verifyPassword(
          password,
          String(user.password_hash)
        );

        if (!validPassword) {
          return null;
        }

        // Return authenticated user information.
        return {
          id: String(user.id),
          name: String(user.name),
          email: String(user.email),
        };
      },
    }),
  ],
});
