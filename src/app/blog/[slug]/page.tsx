import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })

  if (!post) return {}

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <article className="container max-w-4xl">
          {post.thumbnail && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 relative">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            {post.category && (
              <span className="text-sm text-primary font-medium mb-2 block">
                {post.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{post.author?.name || "Anonymous"}</span>
              <span>•</span>
              <time>{formatDate(post.publishedAt || post.createdAt)}</time>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag) => (
                  <span
                    key={postTag.tag.id}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {postTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
