"use client"

interface AdPlacementProps {
  type: "header" | "sidebar" | "content" | "footer"
  className?: string
}

export function AdPlacement({ type, className = "" }: AdPlacementProps) {
  const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"
  const adId = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!isEnabled || !adId) {
    return null
  }

  const adSlots = {
    header: "1234567890",
    sidebar: "0987654321",
    content: "1122334455",
    footer: "5544332211",
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adId}
        data-ad-slot={adSlots[type]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  )
}
