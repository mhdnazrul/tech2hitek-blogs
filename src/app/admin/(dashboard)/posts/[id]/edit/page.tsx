import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditPostClient } from "./edit-post-client"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  })

  if (!post) {
    notFound()
  }

  return <EditPostClient post={post} />
}
