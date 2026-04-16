import { Facebook, Twitter, Linkedin, Link2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--muted-foreground)" }}>Share:</span>
      
      <button
        onClick={() => handleShare("facebook")}
        style={{
          padding: "0.5rem",
          background: "#1877f2",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>

      <button
        onClick={() => handleShare("twitter")}
        style={{
          padding: "0.5rem",
          background: "#1da1f2",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </button>

      <button
        onClick={() => handleShare("linkedin")}
        style={{
          padding: "0.5rem",
          background: "#0077b5",
          color: "white",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </button>

      <button
        onClick={handleCopy}
        style={{
          padding: "0.5rem",
          background: "var(--secondary)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Copy link"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
};
