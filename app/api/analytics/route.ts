import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataFile = path.join(process.cwd(), "data", "analytics.json");

type UserAnalytics = {
  watchPercent: number;
};

type VideoAnalytics = {
  views: number;
  users: Record<string, UserAnalytics>;
};

function ensureFile() {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "{}");
}

function readData(): Record<string, VideoAnalytics> {
  ensureFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
}

function writeData(data: Record<string, VideoAnalytics>) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getUserId(req: Request, res: NextResponse) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/clipcast_uid=([^;]+)/);

  if (match) return match[1];

  const uid = crypto.randomUUID();
  res.headers.set(
    "Set-Cookie",
    `clipcast_uid=${uid}; Path=/; Max-Age=31536000; SameSite=Lax`
  );
  return uid;
}

// GET analytics
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = readData();
  const video = data[id];

  // If video not found
  if (!video) {
    return NextResponse.json({
      views: 0,
      averageWatchPercent: 0,
      userWatchPercent: 0,
    });
  }

  // 🔹 Calculate average watch percentage
  const usersArray = Object.values(video.users || {});
  const avg =
    usersArray.length === 0
      ? 0
      : Math.round(
          usersArray.reduce((sum, u: any) => sum + u.watchPercent, 0) /
            usersArray.length
        );

  // 🔹 Get current user ID from cookie
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/clipcast_uid=([^;]+)/);
  const userId = match ? match[1] : null;

  // 🔹 Get THIS user's watch percent safely
  const userWatchPercent =
    userId && video.users?.[userId]
      ? video.users[userId].watchPercent
      : 0;

  return NextResponse.json({
    views: video.views,
    averageWatchPercent: avg,
    userWatchPercent,
  });
}


// POST analytics events
// POST analytics events
export async function POST(req: Request) {
  const res = NextResponse.json({ success: true });
  const { id, event, percent } = await req.json();

  if (!id || !event) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  const userId = getUserId(req, res);
  const data = readData();

  // Ensure video object exists
  if (!data[id]) {
    data[id] = { views: 0, users: {} };
  }

  const video = data[id];

  // 🔒 DEFENSIVE: ensure users object always exists
  if (!video.users) {
    video.users = {};
  }

  // ✅ Unique view tracking
  if (event === "view") {
    if (!video.users[userId]) {
      video.views += 1;
      video.users[userId] = { watchPercent: 0 };
    }
  }

  // ✅ Watch percentage tracking
  if (event === "watch" && typeof percent === "number") {
    if (!video.users[userId]) {
      video.views += 1;
      video.users[userId] = { watchPercent: percent };
    } else {
      video.users[userId].watchPercent = Math.max(
        video.users[userId].watchPercent,
        percent
      );
    }
  }

  writeData(data);
  return res;
}

