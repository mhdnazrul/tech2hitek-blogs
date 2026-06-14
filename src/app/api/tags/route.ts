import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { slugify } from "@/lib/utils"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany()
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}
