"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MediaSelector } from "@/components/admin/media-selector"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

const BlogEditor = dynamic(() => import("@/components/admin/blog-editor").then(mod => mod.BlogEditor), {
  ssr: false,
  loading: () => <div className="h-[400px] border rounded-lg animate-pulse bg-muted" />
})

type Category = { id: string; name: string }
type Tag = { id: string; name: string }

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    categoryId: "",
    tagIds: [] as string[],
    metaTitle: "",
    metaDescription: "",
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      fetch("/api/tags").then(res => res.json())
    ]).then(([cats, ts]) => {
      setCategories(Array.isArray(cats) ? cats : [])
      setTags(Array.isArray(ts) ? ts : [])
    }).catch(console.error)
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileData = new FormData()
    fileData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fileData })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFormData(prev => ({ ...prev, thumbnail: data.url }))
      toast({ title: "Image uploaded successfully" })
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setFormData(prev => {
      const isSelected = prev.tagIds.includes(tagId)
      return {
        ...prev,
        tagIds: isSelected ? prev.tagIds.filter(id => id !== tagId) : [...prev.tagIds, tagId]
      }
    })
  }

  const submitPost = async (isPublished: boolean) => {
    if (!formData.title) return toast({ title: "Title is required", variant: "destructive" })
    setLoading(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, published: isPublished }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to create post")
      }

      toast({
        title: "Success",
        description: `Post ${isPublished ? "published" : "saved as draft"} successfully!`,
      })
      router.push("/admin/posts")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    if (!formData.title) return toast({ title: "Please enter a title to preview", variant: "destructive" })
    setPreviewOpen(true)
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold">New Post</h1>
        <p className="text-muted-foreground">Create a new blog post</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                    setFormData({ ...formData, title, slug })
                  }}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  placeholder="A brief summary of the post"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO optimized title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={2}
                  placeholder="SEO optimized description"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" onClick={() => submitPost(false)} disabled={loading || uploading} variant="secondary" className="w-full">
                Save as Draft
              </Button>
              <Button type="button" onClick={handlePreview} disabled={loading || uploading} variant="outline" className="w-full">
                Live Preview
              </Button>
              <Button type="button" onClick={() => submitPost(true)} disabled={loading || uploading} className="w-full">
                Publish Post
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.thumbnail && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-auto aspect-video object-cover rounded border"
                />
              )}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                    {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Upload New Image
                  </Button>
                </div>
                <MediaSelector onSelect={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map(tag => {
                    const isSelected = formData.tagIds.includes(tag.id)
                    return (
                      <span
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer border ${isSelected ? "bg-primary text-primary-foreground border-transparent" : "text-foreground hover:bg-secondary/80"
                          }`}
                      >
                        {tag.name}
                      </span>
                    )
                  })}
                  {tags.length === 0 && <span className="text-sm text-muted-foreground">No tags available.</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Live Preview: {formData.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {formData.thumbnail && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={formData.thumbnail} alt={formData.title} className="w-full aspect-video object-cover rounded-lg mb-8" />
              )}
              <h1>{formData.title}</h1>
              {formData.excerpt && <p className="text-xl text-muted-foreground">{formData.excerpt}</p>}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
              >
                {formData.content}
              </ReactMarkdown>
            </article>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
