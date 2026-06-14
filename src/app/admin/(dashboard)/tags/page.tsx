import { prisma } from "@/lib/prisma"
import { TagsClient } from "./tags-client"

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return <TagsClient initialTags={tags} />
}
