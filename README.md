# Civic Grievance Portal — Municipal Grievance Triage & Insight Tool

An AI-powered civic complaint platform that lets citizens report municipal issues in their own words — typed or spoken, in English or a regional language — and automatically classifies, prioritizes, and routes each complaint for municipal officials, turning an unstructured flood of complaints into an actionable, triaged dashboard.

Built for the **1M1B AI for Sustainability Virtual Internship** (in collaboration with IBM SkillsBuild & AICTE).

---

## 📌 Project Info

| | |
|---|---|
| **Author** | Atharv Verma |
| **SDG Alignment** | SDG 11 — Sustainable Cities and Communities |
| **AI Tool Used** | IBM Granite (`granite3.2:8b` / `granite3.2:2b`, run locally via Ollama) |
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

Municipal bodies receive a high volume of unstructured citizen complaints — potholes, garbage overflow, water leakage, broken streetlights — through forms, calls, and social media. These are typically triaged manually, which is slow, inconsistent, and makes it hard for officials to spot patterns until residents escalate.

**How might we use AI to classify and summarize unstructured citizen grievances so that municipal officials can prioritize and respond to civic issues faster and more consistently?**

## 👥 Who This Is For

- **Citizens** — a simple way to report a civic issue, in their own language, without needing to know the "right" department.
- **Municipal officials** — a triaged, categorized, prioritized view of incoming complaints instead of a raw unsorted list.
- **Municipal administrators** — aggregate insight into recurring problem areas to inform planning.

---

## ✨ Features

### Citizen-facing
- Submit a complaint by **typing or speaking** — voice input supported in Hindi, English, Tamil, Bengali, Marathi, and Kannada via the browser's speech recognition
- Submissions in any Indian language are automatically translated and classified by Granite — no English required
- Pin the exact location on an interactive map, alongside a free-text ward/landmark description
- Attach a photo of the issue
- Instant AI-analysis feedback on submission: category, urgency, assigned department, and detected language
- Track the status of submitted complaints, including officials' resolution notes once closed

### Official-facing (Admin Dashboard)
- AI-classified, prioritized complaint queue with urgency color-coding
- **Duplicate detection** — near-identical reports of the same issue are automatically merged into a single entry with a report count, instead of cluttering the queue
- **Overdue escalation** — complaints exceeding an urgency-based SLA are automatically flagged and surfaced to the top
- Photo thumbnails with click-to-expand, and a direct map link to the pinned location
- Filter by status, category, and location
- One-click status updates, with a resolution note captured on closure
- **Insights page** — category and trend charts, top-location breakdown, and an AI-generated plain-language weekly digest

### AI Pipeline (IBM Granite)
- **Classification** — sorts each complaint into pothole / garbage / water leakage / streetlight / drainage / other
- **Entity extraction** — pulls out location and urgency signals from free text
- **Multilingual understanding** — analyzes and summarizes complaints regardless of the language they were written in
- **Duplicate detection** — compares a new complaint's meaning against recent open complaints in the same category
- **Summarization** — generates a plain-language weekly digest of complaint trends for officials
- **Rule-based department routing** — a lightweight, explicit stand-in for full RAG: each category maps to a responsible department via a small reference document (see *Responsible AI* below for why this is described honestly rather than overstated)

---

## 🏗️ Architecture

```
grievance-triage-tool/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── pages/          # Login, Register, SubmitComplaint, AdminDashboard, Insights, MyComplaints
│       ├── components/     # AppShell, LocationPicker
│       └── hooks/          # useSpeechToText
├── server/                 # Express backend
│   ├── models/             # User, Complaint (Mongoose schemas)
│   ├── routes/             # auth, complaints, admin
│   ├── services/           # granite.service.js, rag.service.js
│   └── middleware/         # auth, upload
└── grievance-triage-prd.md # Full product requirements document
```

**Data flow:** Citizen submits complaint → Granite classifies + extracts entities + detects duplicates → rule-based router assigns department → stored in MongoDB with AI-derived fields → admin dashboard reads and aggregates this data for triage and insights.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Leaflet (maps), Recharts (charts), Web Speech API (voice input)
- **Backend:** Node.js, Express, JWT authentication, Multer (photo uploads)
- **Database:** MongoDB (Atlas)
- **AI:** IBM Granite, run locally via [Ollama](https://ollama.com) — no cloud account, API key, or credit card required

---

## ⚙️ Local Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account (free tier)
- [Ollama](https://ollama.com) installed locally

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
```
```bash
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`.

---

## 🖼️ Screenshots

> Add screenshots below — recommended: citizen submission form with AI-result card, admin dashboard showing an overdue flag and duplicate badge, and the Insights page digest.

`[ADD SCREENSHOT: Citizen submission + AI analysis card]`

`[ADD SCREENSHOT: Admin complaint queue]`

`[ADD SCREENSHOT: Insights dashboard]`

---

## 🛡️ Responsible AI Considerations

- **Fairness:** Classification output is spot-checked across categories to avoid systematic bias toward informally phrased or regional-language complaints.
- **Transparency:** AI-assigned category, urgency, and department are shown as suggestions officials can override — nothing is auto-closed or auto-deprioritized without human review. Department routing is implemented as **explicit rule-based retrieval over a small reference document**, described honestly as such rather than presented as a full vector-based RAG pipeline.
- **Ethics:** No complaint is auto-rejected; AI output is advisory only, and a human official makes every final decision on status and priority.
- **Privacy:** No government ID or Aadhaar linkage is required to submit a complaint. Citizen contact details are not exposed on the admin dashboard beyond what's needed to resolve the issue.

## 📈 Expected Impact

Officials move from manually reading a raw, unsorted complaint queue to a categorized, prioritized dashboard with duplicate merging and trend visibility — reducing per-complaint triage time and surfacing recurring problem areas that would otherwise only be noticed after repeated citizen escalation. Voice input and multilingual support extend access to citizens who are less comfortable typing in English, directly widening who can participate in civic reporting.

## 🔭 Future Work

- WhatsApp Business API integration, since that's the channel most Indian civic services already route through
- Offline-first submission queuing for low-connectivity areas
- Full vector-based RAG for department routing, replacing the current rule-based mapping
- Ward-scoped official accounts and an escalation chain mirroring CPGRAMS-style governance patterns

---

## 📄 License

`[ADD LICENSE HERE, e.g. MIT]`
