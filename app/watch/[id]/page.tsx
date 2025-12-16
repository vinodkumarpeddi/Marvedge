"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const sentViewRef = useRef(false);

  const [views, setViews] = useState(0);
  const [avgPercent, setAvgPercent] = useState(0);
  const [userPercent, setUserPercent] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/analytics?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setViews(data.views);
        setAvgPercent(data.averageWatchPercent);
        setUserPercent(data.userWatchPercent);
      });

    if (!sentViewRef.current) {
      sentViewRef.current = true;
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, event: "view" }),
      });
    }
  }, [id]);

  const sendWatchPercent = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const percent = Math.round(
      (video.currentTime / video.duration) * 100
    );

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        event: "watch",
        percent: percent || 0,
      }),
    });
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white px-6">
      <div className="w-full max-w-4xl flex flex-col justify-center gap-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            🎥 ClipCast
          </h1>
          <p className="text-slate-400 text-sm">
            Watch • Measure • Improve engagement
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-5 flex flex-col items-center">


          {/* Video Wrapper */}
         <div className="w-full aspect-video max-h-[55vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/20 shadow-lg bg-black">

            <video
              ref={videoRef}
              controls
              src={`/uploads/${id}.webm`}
              onPause={sendWatchPercent}
              onEnded={sendWatchPercent}
              className="max-w-full max-h-full object-contain"
            />

          </div>

          {/* Analytics */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center ">

            <Stat label=" Views" value={views} color="text-white" />

            <Stat
              label=" Avg Watch"
              value={`${avgPercent}%`}
              color="text-indigo-400"
            />

            <Stat
              label=" You Watched"
              value={`${userPercent}%`}
              color="text-green-400"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          Built with ❤️ using Next.js & FFmpeg
        </p>
      </div>
    </div>
  );
}

/* Small reusable stat */
function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 py-3">
      <p className="text-slate-400 text-xs">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
