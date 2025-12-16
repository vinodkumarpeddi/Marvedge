🎥 ClipCast – In-Browser Screen Recorder & Sharing
ClipCast is a lightweight MVP that allows users to record their screen + microphone directly in the browser, trim recordings, upload videos, and share a public link with real-time analytics such as unique views and watch-completion percentage.

This project demonstrates browser media handling, FFmpeg processing, backend APIs, and product-focused UX decisions.
🎥 Demo
Live Demo:
https://clipclash-marvedge.vercel.app/

🗄️ Storage & Deployment Note (Important)
This project intentionally uses mocked local storage, which is explicitly allowed by the assignment.

During local development, uploaded videos are written to the local filesystem (/public/uploads) to demonstrate the full upload → share → watch flow.

When deployed to serverless platforms like Vercel, the filesystem is ephemeral by design.
To handle this correctly:

The upload API detects the serverless environment

Returns a mocked success response with a valid share link

Keeps the API contract identical to a real object storage service (S3 / R2)

This approach ensures:

The MVP remains deployment-safe

The architecture is cloud-ready

Migrating to real object storage requires minimal code changes

In a production environment, this mocked storage layer would be replaced with S3, Cloudflare R2, or similar, without changing frontend or API consumers.

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/clipcast.git
cd clipcast
2️⃣ Install dependencies
npm install
3️⃣ Run the development server
npm run dev
Open:
👉 http://localhost:3000

🔗 How Sharing Works
Record or trim a video

Upload the video

A public URL is generated:

/watch/{video-id}
Anyone with the link can view the video

Analytics update automatically

📊 Analytics Design
Each viewer gets an anonymous persistent cookie

Views are counted only once per user

Reloading the page does not increase views

Watch percentage is updated when:

Video is paused

Video finishes

Backend calculates:

Total views

Average watch percentage

Per-user watch percentage

🧠 Architecture Decisions
Why client-side FFmpeg?
No backend compute cost

Faster iteration for MVP

Avoids server video processing complexity

Why file-based analytics?
Simple, transparent persistence

Easy to replace with DB later

Ideal for MVP & assignment scope

Why local storage instead of S3?
No cloud account required

Same API surface as S3/R2

Easy future migration

🚀 What I Would Improve for Production
Replace local storage with S3 / R2

Use a real database (Postgres / DynamoDB)

Add authentication & ownership

Video transcoding (mp4, adaptive streaming)

Background jobs for analytics

Rate-limiting & abuse protection

WebSockets for real-time analytics updates


✨ Features
🎬 Screen Recording
Record screen + microphone using the MediaRecorder API

Start / Stop controls

Output saved as .webm

✂️ Video Trimming
Trim video using start & end timestamps

Client-side trimming via ffmpeg.wasm

Preview trimmed output before upload

⬆️ Upload & Share
Upload full or trimmed video

Generates a public shareable link

Public watch page with embedded video player

📊 Analytics (Persistent)
Unique view tracking (per user)

Prevents view inflation on reload

Tracks watch completion percentage

Shows:

Total views

Average watch percentage

Current user’s watch percentage

🎨 Product-Quality UI
Clean, responsive UI

Recording / trimming / uploading states

Disabled controls to prevent invalid actions

Visual feedback for all async operations

🧱 Tech Stack
Layer	Tech
Frontend	Next.js (App Router), TypeScript
Styling	Tailwind CSS
Video	MediaRecorder API, FFmpeg WASM
Backend	Next.js Route Handlers
Storage	Local file storage (mocked S3)
Analytics	File-based JSON persistence
Deployment	Local / Vercel-ready
🗂 Project Structure
clipcast/
├── app/
│   ├── page.tsx              # Recorder, trim & upload UI
│   ├── watch/[id]/page.tsx   # Public watch page
│   ├── api/
│   │   ├── upload/route.ts   # Upload handler
│   │   └── analytics/route.ts# View & watch analytics
├── public/
│   └── uploads/              # Stored videos
├── data/
│   └── analytics.json        # Persistent analytics
└── README.md

👨‍💻 What I Built
I built ClipCast, a fully functional MVP that enables users to:

Record their screen + microphone directly in the browser

Trim recorded videos before upload

Upload videos and generate public shareable links

View shared videos on a public watch page

Track real, persistent analytics:

Unique views

Average watch completion percentage

Individual viewer watch percentage

This project focuses on building a realistic slice of a startup MVP, not just a demo.

🧠 What Makes This Implementation Different
Most solutions stop at record → upload.
This project goes significantly deeper.

1️⃣ True Unique View Tracking (Not Fake Counters)
❌ Common approach:

Increment views on every page load

Refreshing increases views artificially

✅ My approach:

Each user gets a persistent anonymous ID

Views increase only once per user

Page reloads do not inflate analytics

➡️ This mirrors how real platforms like Loom or YouTube work.

2️⃣ Per-User Watch Completion Percentage
❌ Common approach:

Only track “completed” or “not completed”

✅ My approach:

Track how much of the video each user watched

Persist watch percentage per user

Calculate:

Individual watch %

Average watch % across all viewers

➡️ This provides real engagement insights, not vanity metrics.

3️⃣ Client-Side Video Processing (FFmpeg WASM)
❌ Common approach:

Upload raw video

Heavy server-side processing

✅ My approach:

FFmpeg runs entirely in the browser

User trims video before upload

Reduces server load

Faster feedback loop for users

➡️ This is a strong architectural decision for MVP scalability.

4️⃣ Production-Quality UX (Not Just Features)
I focused heavily on product polish, including:

Recording state indicators (● Recording)

Disabled buttons during async actions

Upload / trim progress feedback

Preventing double submissions

Clean reset flow for new recordings

➡️ These details matter in real products and are often ignored in assignments.

5️⃣ Thoughtful Backend Design (Even Without Cloud)
API routes structured like production services

File-based persistence designed to be DB-replaceable

Local storage mirrors S3-style object storage

Analytics logic separated cleanly from UI

➡️ The system can be migrated to cloud infra with minimal changes.

🧱 Technical Highlights
Next.js App Router with clean separation of concerns

MediaRecorder API for in-browser capture

FFmpeg WASM for trimming

Persistent analytics using server-side storage

Cookie-based anonymous identity

Fully typed TypeScript codebase

Clean, responsive Tailwind CSS UI

🚀 Why This Matters
This project demonstrates that I can:

Build real browser-based video features

Make architectural tradeoffs

Think beyond “it works” → “it scales”

Deliver a polished MVP experience

Handle both frontend and backend concerns

It reflects how I would build an early-stage startup product, not just complete a task.



👤 Author
Vinod
Full-Stack Developer
🔗 Portfolio: https://vinodkumarpeddi.vercel.app
🔗 GitHub: https://github.com/vinodkumarpeddi






