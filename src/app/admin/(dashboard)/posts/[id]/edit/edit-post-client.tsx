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

export function EditPostClient({ post }: { post: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const [formData, setFormData] = useState({
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    thumbnail: post.thumbnail || "",
    categoryId: post.categoryId || "",
    tagIds: post.tags?.map((t: any) => t.tag.id) || [] as string[],
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    wasPublished: post.published || false
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
        tagIds: isSelected ? prev.tagIds.filter((id: string) => id !== tagId) : [...prev.tagIds, tagId]
      }
    })
  }

  const submitPost = async (isPublished: boolean) => {
    if (!formData.title) return toast({ title: "Title is required", variant: "destructive" })
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, published: isPublished }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update post")
      }

      toast({
        title: "Success",
        description: `Post updated successfully!`,
      })
      router.push("/admin/posts")
      router.refresh()
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
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground">Update your blog post</p>
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
                {formData.wasPublished ? "Unpublish & Save as Draft" : "Save Draft"}
              </Button>
              <Button type="button" onClick={handlePreview} disabled={loading || uploading} variant="outline" className="w-full">
                Live Preview
              </Button>
              <Button type="button" onClick={() => submitPost(true)} disabled={loading || uploading} className="w-full">
                Update Post
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.thumbnail ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.thumbnail} alt="Cover" className="object-cover w-full h-full" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Label
                      htmlFor="cover-upload"
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Image"}
                    </Label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <MediaSelector onSelect={(url) => setFormData({ ...formData, thumbnail: url })} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        formData.tagIds.includes(tag.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
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
