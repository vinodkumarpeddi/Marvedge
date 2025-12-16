"use client";

import { useRef, useState } from "react";

async function fetchFile(file: Blob) {
  return new Uint8Array(await file.arrayBuffer());
}

let ffmpegInstance: any = null;

async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;

  const { createFFmpeg } = await import("@ffmpeg/ffmpeg");

  ffmpegInstance = createFFmpeg({
    log: true,
    corePath:
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  });

  await ffmpegInstance.load();
  return ffmpegInstance;
}

export default function Home() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const [video, setVideo] = useState<Blob | null>(null);
  const [trimmedVideo, setTrimmedVideo] = useState<Blob | null>(null);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);

  const [isRecording, setIsRecording] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [shareLink, setShareLink] = useState<string | null>(null);

  // --- LOGIC SAME AS YOUR CODE ---

  const startRecording = async () => {
    if (isRecording) return;

    const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const mic = await navigator.mediaDevices.getUserMedia({ audio: true });

    const stream = new MediaStream([
      ...screen.getTracks(),
      ...mic.getTracks(),
    ]);

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = () => {
      setVideo(new Blob(chunks.current, { type: "video/webm" }));
      chunks.current = [];
      setIsRecording(false);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();

  const trimVideo = async () => {
    if (!video || startTime >= endTime) return;
    setIsTrimming(true);

    const ffmpeg = await getFFmpeg();
    ffmpeg.FS("writeFile", "input.webm", await fetchFile(video));

    await ffmpeg.run(
      "-i", "input.webm",
      "-ss", startTime.toString(),
      "-to", endTime.toString(),
      "-c", "copy",
      "output.webm"
    );

    const data = ffmpeg.FS("readFile", "output.webm");
    setTrimmedVideo(new Blob([data.buffer], { type: "video/webm" }));
    setIsTrimming(false);
  };

  const uploadVideo = async (blob: Blob) => {
    if (isUploading) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", blob, "video.webm");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setShareLink(data.shareUrl);

    setIsUploading(false);
  };

  const resetAll = () => {
    setVideo(null);
    setTrimmedVideo(null);
    setShareLink(null);
    setStartTime(0);
    setEndTime(5);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex items-center justify-center px-6">
      <section className="relative w-full max-w-4xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-8">

        {/* HEADER */}
        <header className="text-center space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">🎥 ClipCast</h1>
          <p className="text-slate-400">
            Record • Trim • Share screen videos instantly
          </p>
        </header>

        {/* RECORD STATUS */}
        {isRecording && (
          <span className="absolute top-5 right-6 px-3 py-1 text-sm bg-red-600/90 rounded-full animate-pulse">
            ● Recording
          </span>
        )}

        {/* RECORD CONTROLS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-40"
          >
            ▶ Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 transition disabled:opacity-40"
          >
            ⏹ Stop
          </button>
        </div>

        {/* ORIGINAL VIDEO */}
        {video && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">🎬 Original Recording</h2>

            <video
              controls
              src={URL.createObjectURL(video)}
              className="w-full rounded-2xl border border-slate-700 shadow-lg"
            />

            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="bg-slate-800 px-4 py-2 rounded-lg w-28"
              />
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="bg-slate-800 px-4 py-2 rounded-lg w-28"
              />

              <button
                onClick={trimVideo}
                disabled={isTrimming}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-40"
              >
                {isTrimming ? "⏳ Trimming…" : "✂ Trim Video"}
              </button>
            </div>

            {!trimmedVideo && !shareLink && (
              <button
                onClick={() => uploadVideo(video)}
                disabled={isUploading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition disabled:opacity-40"
              >
                {isUploading ? "⬆ Uploading…" : "⬆ Upload Full Video"}
              </button>
            )}
          </section>
        )}

        {/* TRIMMED VIDEO */}
        {trimmedVideo && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-green-400">
              ✅ Trimmed Output
            </h2>

            <video
              controls
              src={URL.createObjectURL(trimmedVideo)}
              className="w-full rounded-2xl border border-green-600 shadow-lg"
            />

            {!shareLink && (
              <button
                onClick={() => uploadVideo(trimmedVideo)}
                disabled={isUploading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition disabled:opacity-40"
              >
                {isUploading ? "⬆ Uploading…" : "⬆ Upload Trimmed Video"}
              </button>
            )}
          </section>
        )}

        {/* SHARE LINK */}
        {shareLink && (
          <section className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 space-y-4">
            <p className="text-green-400 font-semibold">
              🎉 Video uploaded successfully
            </p>

            <input
              value={shareLink}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700"
            />

            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Copy Link
              </button>

              <a
                href={shareLink}
                target="_blank"
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-center"
              >
                Open
              </a>
            </div>

            <button
              onClick={resetAll}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-xl"
            >
              🔄 New Recording
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
