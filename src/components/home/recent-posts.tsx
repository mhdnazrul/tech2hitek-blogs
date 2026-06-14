import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export async function RecentPosts() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    take: 6,
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  })

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Posts</h2>
          <p className="text-muted-foreground text-lg">
            Latest stories from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
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

        <div className="text-center mt-12">
          <Link href="/blog">
            <Button size="lg" variant="outline">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
