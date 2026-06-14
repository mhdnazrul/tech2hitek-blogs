"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-8">
        <Link href="/admin" className="text-xl font-bold">
          Admin Dashboard
        </Link>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </header>
  )
}
