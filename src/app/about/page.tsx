import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">About</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-6">
              Welcome to The Blog, a modern platform for sharing stories, ideas, and insights.
            </p>
            <p>
              Our mission is to create a space where writers and thinkers can share their perspectives
              with a global audience. We believe in the power of words to inspire, educate, and connect people.
            </p>
            <h2>Our Story</h2>
            <p>
              Founded with a passion for quality content, The Blog has grown into a community of diverse voices
              covering topics ranging from technology and lifestyle to culture and personal development.
            </p>
            <h2>What We Do</h2>
            <p>
              We provide a platform for writers to publish their work, connect with readers, and build their
              audience. Our commitment to quality ensures that every piece of content meets our high standards.
            </p>
            <h2>Get in Touch</h2>
            <p>
              We&apos;d love to hear from you. Whether you&apos;re interested in writing for us or just want to say hello,
              feel free to reach out through our contact page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
