"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

export type PostWithRelations = {
  id: string
  title: string
  published: boolean
  createdAt: Date
  author: { name: string | null } | null
  category: { name: string } | null
}

export function PostsClient({ initialPosts }: { initialPosts: PostWithRelations[] }) {
  const [posts, setPosts] = useState<PostWithRelations[]>(initialPosts)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const togglePublishStatus = async (post: PostWithRelations) => {
    setLoadingId(post.id)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: !post.published,
          wasPublished: post.published // send current state to API so it can adjust publishedAt if necessary
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        throw new Error(err?.error || "Failed to update post status")
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: !p.published } : p
        )
      )

      toast({
        title: "Status updated",
        description: `Post is now ${!post.published ? "published" : "draft"}`,
      })
      
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  if (posts.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No posts found.</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center justify-between border-b pb-4 last:border-0"
        >
          <div className="flex-1">
            <p className="font-medium">{post.title}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.author?.name || "Anonymous"}</span>
              <span>•</span>
              <time>{formatDate(post.createdAt)}</time>
              {post.category && (
                <>
                  <span>•</span>
                  <span>{post.category.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                post.published
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => togglePublishStatus(post)}
              disabled={loadingId === post.id}
            >
              {post.published ? "Unpublish" : "Publish"}
            </Button>
            <Link href={`/admin/posts/${post.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
