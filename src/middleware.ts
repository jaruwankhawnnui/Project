// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

// export { default } from 'next-auth/middleware';


// export const config = {
//   matcher: ['/homepage'],
// };

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export { auth as middleware } from "@/auth"

export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  //matcher: ['/((?!api|card|_next/static|_next/image|.*\\.png$).*)'],
  matcher: ['/(card|homepage|card)'],
};