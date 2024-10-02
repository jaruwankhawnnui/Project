import type { NextAuthConfig } from 'next-auth';
import Authentik from "next-auth/providers/authentik";

export const authConfig = {
  providers: [
    Authentik({
      clientId: process.env.AUTHENTIK_CLIENT_ID,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
      issuer: process.env.AUTHENTIK_ISSUER,
      authorization: process.env.AUTHENTIK_AUTHORIZATION,
      token: process.env.AUTHENTIK_TOKEN,
      userinfo: process.env.AUTHENTIK_USERINFO,
      profile (profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          nickname: profile.nickname,
          role: profile.role ?? "user"
        };
      },
    }),
  ],
  
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/homepage', nextUrl));
      }
      return true;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return "http://localhost:3000/homepage";
    },
    session({ session, user, token }) {
      session.user.role = token.role
      session.user.nickname = token.nickname
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      if(user) token.role = user.role
      if(user) token.nickname = user.nickname
      return token;
    },
  },
  debug: true,
  secret: "dcefkpowelkrkmpeofkvmperfk"

} satisfies NextAuthConfig;