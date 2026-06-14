"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Edit2, Trash2 } from "lucide-react"

type Tag = {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

export function TagsClient({ initialTags }: { initialTags: Tag[] }) {
  const [tags, setTags] = useState(initialTags)
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setName("")
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const url = editingId ? `/api/tags/${editingId}` : "/api/tags"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error("Failed to save tag")
      
      const data = await res.json()
      
      if (editingId) {
        setTags(tags.map(t => t.id === editingId ? { ...t, ...data } : t))
        toast({ title: "Tag updated" })
      } else {
        setTags([{ ...data, _count: { posts: 0 } }, ...tags])
        toast({ title: "Tag created" })
      }
      resetForm()
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")

      setTags(tags.filter(t => t.id !== id))
      toast({ title: "Tag deleted" })
    } catch (error) {
      toast({ title: "Error deleting tag", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id)
    setName(tag.name)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage blog tags</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Tag" : "New Tag"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Tag Name" 
                    required 
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {editingId ? "Update" : "Create"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{tag.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tag._count?.posts || 0} posts • {tag.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(tag)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(tag.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {tags.length === 0 && (
                  <p className="text-muted-foreground">No tags found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
