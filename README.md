# Civic Grievance Portal — Municipal Grievance Triage & Insight Tool

An AI-powered civic complaint platform that lets citizens report municipal issues in their own words — typed or spoken, in English or a regional language — and automatically classifies, prioritizes, and routes each complaint for municipal officials, turning an unstructured flood of complaints into an actionable, triaged dashboard.

Built for the **1M1B AI for Sustainability Virtual Internship** (in collaboration with IBM SkillsBuild & AICTE).

---

## 📌 Project Info

| | |
|---|---|
| **Author** | Atharv Verma |
| **SDG Alignment** | SDG 11 — Sustainable Cities and Communities |
| **AI Tool Used** | IBM Granite (`granite3.2:8b` / `granite3.2:2b`, run locally via Ollama) + local embedding model for RAG |
| **Stack** | MongoDB, Express.js, React, Node.js (MERN) |

---

## 🔗 Links

| Resource | Link |
|---|---|
| 🌐 Live deployment | `[ADD DEPLOYED URL HERE]` |
| 🎥 Video demo | `[ADD DEMO VIDEO LINK HERE]` |
| 📄 Project write-up (PPT/PDF) | `[ADD SUBMISSION DOCUMENT LINK HERE]` |
| 📝 Full PRD | [`grievance-triage-prd.md`](./grievance-triage-prd.md) |

---

## 🧩 The Problem

Municipal bodies receive a high volume of unstructured citizen complaints — potholes, garbage overflow, water leakage, broken streetlights — through forms, calls, and social media. These are typically triaged manually, which is slow, inconsistent, and makes it hard for officials to spot patterns until residents escalate. Citizens, meanwhile, often abandon reporting altogether if they don't know which department handles their issue or can't submit comfortably in their own language.

**How might we use AI to classify and summarize unstructured citizen grievances so that municipal officials can prioritize and respond to civic issues faster and more consistently?**

## 👥 Who This Is For

- **Citizens** — a simple way to report a civic issue, in their own language, without needing to know the "right" department.
- **Municipal officials** — a triaged, prioritized, ward-scoped view of incoming complaints instead of a raw unsorted list.
- **Municipal administrators** — aggregate insight into recurring problem areas, and city-wide transparency for the public.

---

## ✨ Features

### Citizen-facing
- Submit a complaint by **typing or speaking** — voice input in Hindi, English, Tamil, Bengali, Marathi, and Kannada via the browser's speech recognition
- Submissions in any Indian language are automatically translated and classified by Granite — no English required
- **Pre-submission duplicate warning** — a live check while typing flags if a similar complaint already exists nearby, before you even submit
- Pin the exact location on an interactive map, alongside a free-text ward/landmark description
- Attach a photo of the issue
- Instant AI-analysis feedback on submission: category, urgency, assigned department, and detected language
- Track complaint status, including officials' resolution notes once closed
- **Email notification** when a complaint's status changes

### Official-facing (Admin Dashboard)
- AI-classified, prioritized complaint queue with urgency color-coding, photo thumbnails, and map links
- **Account approval flow** — new official registrations require approval from an existing official before dashboard access is granted
- **Ward-scoped views** — officials see their own ward's complaints by default, with an "all wards" toggle
- **Duplicate detection** — near-identical reports are merged into a single entry with a report count
- **Urgency-based escalation** — complaints exceeding an SLA are flagged as overdue; complaints exceeding a longer threshold auto-escalate to a dedicated Escalated view
- **Complaint density heatmap** — a geographic heatmap of pinned complaint locations on the Insights page
- CSV export of the current filtered queue
- One-click status updates with a resolution note captured on closure

### Public
- **Transparency dashboard** (no login required) — city-wide totals, resolution rate, and category breakdown, open to any citizen
- Landing page introducing the platform and its features before sign-in

### AI Pipeline (IBM Granite)
- **Classification** — sorts each complaint into pothole / garbage / water leakage / streetlight / drainage / other
- **Entity extraction** — pulls location and urgency signals from free text
- **Multilingual understanding** — analyzes and summarizes complaints regardless of the language they were written in
- **Duplicate detection** — both pre-submission (live) and post-submission (authoritative), comparing complaint meaning against recent open complaints
- **Summarization** — generates a plain-language weekly digest of complaint trends for officials
- **Vector-based RAG department routing** — complaint summaries are embedded locally and matched via cosine similarity against department reference documents, replacing a simple category-lookup with genuine semantic retrieval

---

## 🏗️ Architecture

```
grievance-triage-tool/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── pages/              # Landing, Login, Register, SubmitComplaint,
│       │                       # AdminDashboard, Insights, MyComplaints,
│       │                       # PublicDashboard, PendingOfficials, Escalated
│       ├── components/         # AppShell, LocationPicker, ComplaintHeatmap
│       └── hooks/              # useSpeechToText
├── server/                    # Express backend
│   ├── models/                 # User, Complaint (Mongoose schemas)
│   ├── routes/                 # auth, complaints, admin, public
│   ├── services/                # granite.service.js, rag.service.js,
│   │                            # notification.service.js
│   ├── data/                   # departments.js (RAG reference documents)
│   └── middleware/             # auth, upload
└── grievance-triage-prd.md    # Full product requirements document
```

**Data flow:** Citizen submits complaint (text/voice, any language, optional pin + photo) → Granite classifies, extracts entities, detects language, checks for duplicates → vector RAG retrieves the responsible department by semantic similarity → stored in MongoDB with all AI-derived fields → admin dashboard reads, ward-filters, and aggregates this data for triage, escalation, and insights → status changes trigger citizen email notifications.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Leaflet + `leaflet.heat` (maps and heatmap), Recharts (charts), Web Speech API (voice input)
- **Backend:** Node.js, Express, JWT authentication, Multer (photo uploads), Nodemailer (email)
- **Database:** MongoDB (Atlas)
- **AI:** IBM Granite for generation, a local sentence-embedding model (`@xenova/transformers`) for RAG — both run locally via [Ollama](https://ollama.com) and in-process, with no cloud AI account, API key, or credit card required

---

## ⚙️ Local Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account (free tier)
- [Ollama](https://ollama.com) installed locally
- A Gmail account with an App Password (for email notifications — optional)

### 1. Install Granite locally
```bash
ollama pull granite3.2:8b
```

### 2. Backend
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=granite3.2:8b
EMAIL_USER=<your gmail address>
EMAIL_PASS=<your 16-character Gmail app password>
```
```bash
npm run dev
```
On first startup, the server preloads the local embedding model for RAG — you'll see `RAG embeddings ready.` in the console before it's ready to classify complaints.

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`.

### 4. Bootstrap your first official account
New officials require approval from an existing official — but the very first one has no one to approve them. After registering your first official account through the app, approve it directly:
```bash
cd server
node scripts/approveFirstOfficial.js <official-email>
```

---

## 🖼️ Screenshots

> Add screenshots below — recommended: landing page, citizen submission form with AI-result card and duplicate warning, admin dashboard showing escalation/duplicate/photo columns, the Insights heatmap, and the public transparency dashboard.

`[ADD SCREENSHOT: Landing page]`

`[ADD SCREENSHOT: Citizen submission + AI analysis card]`

`[ADD SCREENSHOT: Admin complaint queue]`

`[ADD SCREENSHOT: Insights dashboard with heatmap]`

`[ADD SCREENSHOT: Public transparency dashboard]`

---

## 🛡️ Responsible AI Considerations

- **Fairness:** Classification output is spot-checked across categories to avoid systematic bias toward informally phrased or regional-language complaints.
- **Transparency:** AI-assigned category, urgency, and department are shown as suggestions officials can override — nothing is auto-closed or auto-deprioritized without human review. Department routing uses genuine vector-based semantic retrieval over a documented, inspectable set of department descriptions rather than an opaque black box.
- **Ethics:** No complaint is auto-rejected; AI output is advisory only, and a human official makes every final decision on status and priority. Auto-escalation surfaces overdue complaints for attention — it never auto-resolves or auto-dismisses anything.
- **Privacy:** No government ID or Aadhaar linkage is required to submit a complaint. The public transparency dashboard shows only aggregate, anonymized statistics — no complaint-level or personal data. Citizen contact details are not exposed on the admin dashboard beyond what's needed to resolve the issue.

## 📈 Expected Impact

Officials move from manually reading a raw, unsorted complaint queue to a ward-scoped, prioritized dashboard with duplicate merging, automatic escalation, and geographic density visualization — reducing per-complaint triage time and surfacing recurring problem areas that would otherwise only become visible after repeated citizen escalation. Voice input, multilingual support, and pre-submission duplicate warnings directly widen and improve civic participation for citizens less comfortable typing in English. The public transparency dashboard extends the project's benefit beyond individual complainants to the wider community.

## 🔭 Future Work

- WhatsApp Business API integration, since that's the channel most Indian civic services already route through
- Offline-first submission queuing for low-connectivity areas
- SMS notifications alongside email, for citizens without reliable email access
- Fully live cloud-hosted AI inference (currently local-only by design, to remain free and credit-card-free)

---

## 📄 License

`[ADD LICENSE HERE, e.g. MIT]`