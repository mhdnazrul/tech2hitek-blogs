import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogList } from "@/components/blog/blog-list"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground text-lg">
              Explore our latest articles and stories
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <BlogList />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
