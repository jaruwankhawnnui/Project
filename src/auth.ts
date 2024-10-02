import NextAuth from "next-auth";
import Authentik from "next-auth/providers/authentik";
import { authConfig } from "./auth.config";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Authentik({
//       clientId: process.env.AUTHENTIK_CLIENT_ID,
//       clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
//       issuer: process.env.AUTHENTIK_ISSUER,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//       return "http://localhost:3000/homepage";
//     },
//     async session({ session, user, token }) {
//       return session;
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       return token;
//     },
//   },
//   debug: true,
//   secret: "dcefkpowelkrkmpeofkvmperfk",
//   ...authConfig,
// });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
