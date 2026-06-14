import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
