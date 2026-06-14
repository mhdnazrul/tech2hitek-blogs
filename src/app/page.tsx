import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/home/hero"
import { FeaturedPosts } from "@/components/home/featured-posts"
import { RecentPosts } from "@/components/home/recent-posts"
import { Newsletter } from "@/components/home/newsletter"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<div>Loading...</div>}>
          <FeaturedPosts />
          <RecentPosts />
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
