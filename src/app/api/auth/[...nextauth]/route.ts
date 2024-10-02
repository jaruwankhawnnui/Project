import { handlers } from "@/auth"

export const { GET, POST } = handlers

//export { GET, POST } from "@/auth";
// import NextAuth from "next-auth";
// import AuthentikProvider from "next-auth/providers/authentik";
// import { stringify } from "postcss";

// const handler = NextAuth({
//     providers: [
//         AuthentikProvider({
//           clientId: process.env.AUTHENTIK_CLIENT_ID,
//           clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
//           issuer: process.env.AUTHENTIK_ISSUER,
//         })
//     ],
//     callbacks: {
//         async signIn({ user, account, profile, email, credentials }) {
//           return true
//         },
//         async redirect({ url, baseUrl }) {
//           return "http://localhost:3000/homepage"
//         },
//         async session({ session, user, token }) {
//           return session
//         },
//         async jwt({ token, user, account, profile, isNewUser }) {
//           return token
//         },
//     },
//     secret: "fcerdfdvfrvfvfedgvbagbebvdrfvb",
//     debug: true,

// })

// export { handler as GET, handler as POST }