import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using The Blog, you accept and agree to be bound by the terms and
              provisions of this agreement.
            </p>

            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on The Blog
              for personal, non-commercial transitory viewing only.
            </p>

            <h2>User Content</h2>
            <p>
              You retain ownership of any content you submit to The Blog. By submitting content,
              you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and
              display such content.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The materials on The Blog are provided on an &apos;as is&apos; basis. We make no warranties,
              expressed or implied, and hereby disclaim and negate all other warranties.
            </p>

            <h2>Limitations</h2>
            <p>
              In no event shall we be liable for any damages arising out of the use or inability to
              use the materials on The Blog.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws
              of the jurisdiction in which The Blog operates.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at
              legal@theblog.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
