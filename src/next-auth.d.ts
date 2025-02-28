import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      nickname: string;
    };
  }

  interface JWT {
    role: string;
    nickname: string;
  }
}
