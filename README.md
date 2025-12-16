# 🎥 ClipCast – In-Browser Screen Recorder & Sharing

**ClipCast** is a lightweight, production-minded MVP that lets users **record their screen + microphone directly in the browser**, **trim recordings**, **upload videos**, and **share a public link** with **real-time analytics** such as **unique views** and **watch-completion percentage**.

This project showcases **browser media APIs**, **client-side FFmpeg processing**, **backend API design**, and **product-focused UX decisions** — built the way an early-stage startup MVP should be.

---

## 🚀 Live Demo

👉 **[https://clipclash-marvedge.vercel.app/](https://clipclash-marvedge.vercel.app/)**

---

## 🗄️ Storage & Deployment Notes (Important)

ClipCast **intentionally uses a mocked storage layer**. This is a **deliberate MVP design choice**, not a technical limitation, and is explicitly allowed by the assignment.

### 🧪 Why Mocked Storage?

* Keeps the project **fully self-contained and easy to run**
* Avoids requiring cloud credentials (S3 / R2)
* Preserves the **same API contract** as real object storage
* Allows realistic upload → share → watch flows

### 🧪 Local Development

* Uploaded videos are written to:

  ```
  /public/uploads
  ```
* This demonstrates the **complete product flow**:
  **record → upload → share → watch → analytics**

### ☁️ Serverless Deployment (Vercel)

Serverless platforms like Vercel have an **ephemeral filesystem** by design.

To handle this correctly:

* The upload API **detects the serverless environment**
* Returns a **mocked success response** with a valid shareable link
* Keeps the **API contract identical** to S3 / Cloudflare R2

### ✅ Why This Scales

* Frontend and APIs are **storage-agnostic**
* Storage is abstracted behind a service boundary
* Replacing mocked storage with **S3 / Cloudflare R2** requires minimal code changes
* No frontend refactor needed

➡️ In production, this mocked layer would be replaced with real object storage **without changing API consumers**.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/clipcast.git
cd clipcast
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Open:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 How Sharing Works

1. Record or trim a video
2. Upload the video
3. A public URL is generated:

   ```
   /watch/{video-id}
   ```
4. Anyone with the link can watch
5. Analytics update automatically

---

## 📊 Analytics Design

### 👤 Viewer Identity

* Each viewer gets an **anonymous persistent cookie**
* Views are counted **once per user**
* Reloading does **not** inflate views

### ⏱ Watch Percentage Tracking

Watch percentage updates when:

* Video is paused
* Video finishes

### 🧮 Backend Calculates

* Total unique views
* Average watch percentage
* Per-user watch percentage

---

## 🧠 Architecture Decisions

### 🎬 Why Client-Side FFmpeg?

* No backend compute cost
* Faster iteration for MVP
* Avoids server-side video processing complexity

### 📁 Why File-Based Analytics?

* Simple & transparent persistence
* Easy DB replacement later
* Perfect for MVP & assignment scope

### ☁️ Why Local Storage Instead of S3?

* No cloud account required
* Same API surface as S3 / R2
* Easy future migration

---

## 🚀 What I’d Improve for Production

If ClipCast were taken beyond MVP into a real production system, here’s how I would evolve it:

### ☁️ Scalable Storage & Media Delivery

* Replace mocked local storage with **AWS S3 / Cloudflare R2**
* Serve videos via **CDN-backed signed URLs**
* Enable lifecycle policies for cost-efficient storage

### 🗄️ Robust Data Layer

* Replace file-based persistence with a real database:

  * **Postgres** (relational analytics, ownership)
  * or **DynamoDB** (high-scale event tracking)
* Normalize analytics data for faster aggregation

### 🔐 Authentication & Ownership

* User authentication (email / OAuth)
* Video ownership & private links
* Permissions for delete / regenerate links

### 🎞️ Video Processing Pipeline

* Server-side transcoding to **MP4 / HLS**
* Adaptive streaming for different bandwidths
* Thumbnail generation & previews

### ⚙️ Background Jobs & Analytics

* Queue-based processing (BullMQ / SQS)
* Batch analytics aggregation
* Event-based watch tracking

### 🛡️ Security & Abuse Protection

* Rate limiting on upload & watch APIs
* File size & duration limits
* Basic DRM / tokenized access

### 📡 Real-Time Analytics

* WebSockets / SSE for live view updates
* Real-time watch progress dashboards

### 🧪 Observability & Reliability

* Structured logging
* Error tracking (Sentry)
* Metrics & monitoring

➡️ The current MVP architecture is intentionally designed so **each of these upgrades can be added incrementally without rewrites**.

---

## ✨ Features

### 🎬 Screen Recording

* Record screen + microphone (MediaRecorder API)
* Start / Stop controls
* Output saved as **.webm**

### ✂️ Video Trimming

* Trim via start & end timestamps
* Client-side trimming using **ffmpeg.wasm**
* Preview before upload

### ⬆️ Upload & Share

* Upload full or trimmed video
* Generates a public shareable link
* Public watch page with embedded player

### 📊 Persistent Analytics

* Unique view tracking
* Prevents reload-based inflation
* Watch completion percentage
* Displays:

  * Total views
  * Average watch %
  * Current user’s watch %

### 🎨 Product-Quality UI

* Clean, responsive design
* Recording / trimming / uploading states
* Disabled controls to prevent invalid actions
* Visual feedback for async operations

---

## 🧱 Tech Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Frontend   | Next.js (App Router), TypeScript |
| Styling    | Tailwind CSS                     |
| Video      | MediaRecorder API, FFmpeg WASM   |
| Backend    | Next.js Route Handlers           |
| Storage    | Local file storage (mocked S3)   |
| Analytics  | File-based JSON persistence      |
| Deployment | Local / Vercel-ready             |

---

## 🗂 Project Structure

```text
clipcast/
├── app/
│   ├── page.tsx                # Recorder, trim & upload UI
│   ├── watch/[id]/page.tsx     # Public watch page
│   ├── api/
│   │   ├── upload/route.ts     # Upload handler
│   │   └── analytics/route.ts  # View & watch analytics
├── public/
│   └── uploads/                # Stored videos
├── data/
│   └── analytics.json          # Persistent analytics
└── README.md
```

---

## 🧠 What Makes This Implementation Different

### 1️⃣ True Unique View Tracking

❌ Increment views on every page load
✅ Count **one view per unique user**, reload-safe
➡️ Mirrors real platforms like Loom & YouTube

### 2️⃣ Per-User Watch Completion Percentage

❌ Binary completed / not completed
✅ Track **exact watch percentage per viewer**
➡️ Real engagement insights, not vanity metrics

### 3️⃣ Client-Side Video Processing

❌ Heavy server-side processing
✅ FFmpeg runs entirely in the browser
➡️ Lower server cost, faster UX

### 4️⃣ Production-Quality UX

* Recording indicators (● Recording)
* Disabled buttons during async actions
* Progress feedback
* Clean reset flows

➡️ These details matter in real products.

### 5️⃣ Thoughtful Backend Design

* Production-style API routes
* DB-replaceable persistence layer
* S3-style storage abstraction
* Clean separation of concerns

---

## 🧱 Technical Highlights

* Next.js App Router architecture
* MediaRecorder API for capture
* FFmpeg WASM for trimming
* Persistent server-side analytics
* Cookie-based anonymous identity
* Fully typed TypeScript codebase
* Clean Tailwind CSS UI

---

## 🚀 Why This Matters

This project demonstrates my ability to:

* Build real browser-based video features
* Make smart architectural tradeoffs
* Think beyond **“it works”** → **“it scales”**
* Deliver a polished MVP experience
* Own both frontend and backend systems

It reflects how I’d build an **early-stage startup product**, not just complete a task.

---

## 👤 Author

**Vinod**
Full-Stack Developer

🔗 Portfolio: [https://vinodkumarpeddi.vercel.app](https://vinodkumarpeddi.vercel.app)
🔗 GitHub: [https://github.com/vinodkumarpeddi](https://github.com/vinodkumarpeddi)

