import { prisma } from "@/lib/prisma"
import { CategoriesClient } from "./categories-client"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return <CategoriesClient initialCategories={categories} />
}
