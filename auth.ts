import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        let user = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              nickname: profile.name ?? "마실러",
            },
          });
        }

        token.userId = user.id;
        token.nickname = user.nickname;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = token.userId as string;

      if (token.userId) {
        const user = await prisma.user.findUnique({
          where: {
            id: token.userId as string,
          },
          select: {
            email: true,
            nickname: true,
          },
        });

        if (user) {
          session.user.email = user.email;
          session.user.nickname = user.nickname;
          session.user.name = user.nickname;
        }
      }

      return session;
    },
  },
});
