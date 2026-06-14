import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export async function BlogList() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            {post.thumbnail && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              {post.category && (
                <span className="text-sm text-primary font-medium">
                  {post.category.name}
                </span>
              )}
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {post.excerpt || post.content.slice(0, 150) + "..."}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.author?.name || "Anonymous"}</span>
                <time>{formatDate(post.publishedAt || post.createdAt)}</time>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
