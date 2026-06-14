import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isLoginPage = nextUrl.pathname === "/admin/login"
      
      if (isOnAdmin) {
        if (isLoginPage) {
          if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl))
          return true
        }
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
} satisfies NextAuthConfig
