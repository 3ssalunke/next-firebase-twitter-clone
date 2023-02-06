import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null | undefined;
      image?: string | null | undefined;
      name?: string | null | undefined;
      username?: string | null | undefined;
      uid?: string | null | undefined;
    };
  }
}
