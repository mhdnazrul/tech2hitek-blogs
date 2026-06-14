"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "The Blog",
    siteDescription: "A modern blog platform",
    siteUrl: "",
    socialTwitter: "",
    socialFacebook: "",
    socialLinkedIn: "",
    socialGithub: "",
  })

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ title: "Passwords do not match", variant: "destructive" })
    }
    setPasswordLoading(true)
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update password")
      }
      toast({ title: "Success", description: "Password updated successfully" })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your site settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                placeholder="https://yourdomain.com"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="socialTwitter">Twitter</Label>
              <Input
                id="socialTwitter"
                placeholder="@username"
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialFacebook">Facebook</Label>
              <Input
                id="socialFacebook"
                placeholder="facebook.com/yourpage"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialLinkedIn">LinkedIn</Label>
              <Input
                id="socialLinkedIn"
                placeholder="linkedin.com/in/yourprofile"
                value={settings.socialLinkedIn}
                onChange={(e) => setSettings({ ...settings, socialLinkedIn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialGithub">GitHub</Label>
              <Input
                id="socialGithub"
                placeholder="github.com/yourusername"
                value={settings.socialGithub}
                onChange={(e) => setSettings({ ...settings, socialGithub: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-6 pt-8 border-t">
        <Card>
          <CardHeader>
            <CardTitle>Admin Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={passwordLoading} size="lg" variant="secondary">
          {passwordLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  )
}

