import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        siteUrl: body.siteUrl,
        socialTwitter: body.socialTwitter,
        socialFacebook: body.socialFacebook,
        socialLinkedIn: body.socialLinkedIn,
        socialGithub: body.socialGithub,
      },
      update: {
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        siteUrl: body.siteUrl,
        socialTwitter: body.socialTwitter,
        socialFacebook: body.socialFacebook,
        socialLinkedIn: body.socialLinkedIn,
        socialGithub: body.socialGithub,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
