import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { PostsClient } from "../posts-client"

export default async function AdminDraftsPage() {
  const posts = await prisma.post.findMany({
    where: { published: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drafts</h1>
          <p className="text-muted-foreground">Manage your unpublished posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Draft
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsClient initialPosts={posts} />
        </CardContent>
      </Card>
    </div>
  )
}
