import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function saveVideo(buffer: Buffer, filename: string) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
