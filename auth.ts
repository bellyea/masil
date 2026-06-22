import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, profile }) {
      if (!profile?.email) {
        return token;
      }

      let user = await prisma.user.findUnique({
        where: {
          email: profile.email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.email,
            nickname: profile.name ?? "Unknown",
          },
        });
      }

      token.userId = user.id;

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }

      return session;
    },
  },
});