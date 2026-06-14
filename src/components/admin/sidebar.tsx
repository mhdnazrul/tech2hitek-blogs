"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Folder, Tag, Settings, Image as ImageIcon, ExternalLink, PenTool, FileArchive } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "All Posts", icon: FileText },
  { href: "/admin/posts/new", label: "Add New Post", icon: PenTool },
  { href: "/admin/posts/drafts", label: "Drafts", icon: FileArchive },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background p-4 flex flex-col min-h-[calc(100vh-4rem)]">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t mt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
        >
          <ExternalLink className="h-5 w-5" />
          View Public Site
        </Link>
      </div>
    </aside>
  )
}
