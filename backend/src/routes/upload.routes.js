import { Router } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = Router();

const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "frontend", "public", "chocolates");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/", async (req, res) => {
  try {
    if (!req.body || !req.body.image) {
      return res.status(400).json({ success: false, error: "No image data" });
    }

    const imageData = req.body.image;
    const buffer = Buffer.from(imageData.split(",")[1] || imageData, "base64");
    
    const ext = ".jpg";
    const filename = `product-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    const url = `/chocolates/${filename}`;
    
    res.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;