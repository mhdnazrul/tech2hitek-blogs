"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Image as ImageIcon } from "lucide-react"

type Media = {
  id: string
  url: string
  filename: string
}

interface MediaSelectorProps {
  onSelect: (url: string) => void
  children?: React.ReactNode
}

export function MediaSelector({ onSelect, children }: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      fetchMedia()
    }
  }, [open])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/media")
      if (res.ok) {
        const data = await res.json()
        setMediaItems(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (url: string) => {
    onSelect(url)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button type="button" variant="outline">
            <ImageIcon className="h-4 w-4 mr-2" />
            Select from Media Library
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => handleSelect(item.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
              {mediaItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No media found.
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
