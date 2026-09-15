<div align="center">

<h1>🏙️ JanSahayak AI — Civic Grievance Portal</h1>

<h3>AI-Powered Municipal Grievance Triage & Insight Platform</h3>

<p>
  <strong>Turning citizen voices into actionable civic intelligence.</strong>
</p>

</div>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-Architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-responsible-ai">Responsible AI</a>
</p>

---

## 🌍 About the Project

**Civic Grievance Portal** is an AI-powered platform designed to make municipal complaint management **faster, smarter, more accessible, and more transparent**.

Citizens can report issues such as potholes, garbage overflow, water leakage, broken streetlights, and drainage problems using **text or voice**, including regional Indian languages.

Behind the scenes, **IBM Granite** transforms unstructured complaints into structured civic intelligence by identifying the complaint category, urgency, language, relevant entities, duplicates, and responsible municipal department.

For officials, this becomes a **prioritized, ward-aware command center** rather than a raw list of complaints.

> **From “I have a problem” → to “Here is what happened, where it happened, how urgent it is, and who should handle it.”**

Built for the **1M1B AI for Sustainability Virtual Internship**, in collaboration with **IBM SkillsBuild & AICTE**.

---

## 🎯 The Vision

Cities generate enormous amounts of civic feedback every day.

The challenge isn't simply collecting complaints.

The real challenge is **understanding them, prioritizing them, routing them, detecting patterns, and acting on them quickly.**

Civic Grievance Portal uses AI to bridge that gap.

### 💡 Our goal

> **Make every citizen complaint understandable, actionable, and visible — regardless of language or technical ability.**

The project aligns with **UN Sustainable Development Goal 11 — Sustainable Cities and Communities**.

---

# 🚨 The Problem

Municipal organizations receive complaints through forms, phone calls, social media, and other channels.

These complaints are often:

* Unstructured
* Written in different languages
* Missing the correct department
* Repeated by multiple citizens
* Difficult to prioritize
* Difficult to analyze geographically

Manual triage can therefore become slow and inconsistent.

At the same time, citizens may hesitate to report issues because they don't know:

**“Which department handles this?”**

or

**“How do I explain this in English?”**

### ❓ The Core Question

> **How might we use AI to classify and summarize unstructured citizen grievances so that municipal officials can prioritize and respond to civic issues faster and more consistently?**

---

# 👥 Who Is It For?

| User                          | What They Get                                   |
| ----------------------------- | ----------------------------------------------- |
| 👨‍👩‍👧 **Citizens**         | Simple multilingual complaint reporting         |
| 🧑‍💼 **Municipal Officials** | Prioritized and ward-scoped complaint queues    |
| 🏛️ **Administrators**        | City-wide insights and recurring issue patterns |
| 🌆 **Public**                 | Transparent aggregate civic statistics          |

---

# ✨ Features

## 👤 Citizen Experience

### 🗣️ Voice + Multilingual Reporting

Citizens can report issues by **typing or speaking**.

Supported voice languages include:

`Hindi` · `English` · `Tamil` · `Bengali` · `Marathi` · `Kannada`

Indian-language complaints can be translated and analyzed by Granite, removing the need for English-only reporting.

### 📍 Location-Aware Complaints

Citizens can:

* Pin the exact issue location
* Add a ward or landmark description
* Upload a photo
* Submit the complaint

### 🤖 Instant AI Analysis

After submission, the system provides:

* Complaint category
* Urgency
* Responsible department
* Detected language

### 🔁 Duplicate Warning

Before submitting, citizens can receive a warning when a similar nearby complaint already exists.

This helps reduce unnecessary duplicate reports.

### 📬 Complaint Tracking

Citizens can track complaint status and view resolution notes after closure.

Email notifications are triggered when the complaint status changes.

---

# 🧑‍💼 Municipal Command Center

The admin dashboard transforms incoming complaints into an actionable queue.

### ⚡ Smart Prioritization

Complaints are organized using AI-derived urgency and visual priority indicators.

### 🗺️ Ward-Scoped Operations

Officials see complaints from their assigned ward by default, with an option to view all wards.

### 🔄 Intelligent Duplicate Detection

Near-identical reports can be merged into a single complaint entry while preserving the report count.

### 🚨 Automatic Escalation

Complaints exceeding defined SLA thresholds are flagged as overdue.

Complaints crossing a longer threshold are moved into a dedicated **Escalated** view.

### 🗺️ Complaint Density Heatmap

The Insights dashboard visualizes geographic concentrations of civic complaints.

This makes recurring problem areas easier to identify.

### 📊 Data Export

Officials can export the currently filtered complaint queue as CSV.

### ✅ Resolution Workflow

Officials can update complaint status and capture resolution notes when closing an issue.

---

# 🌐 Public Transparency

The platform also includes a public-facing transparency dashboard.

No login is required.

Citizens can view:

* Total complaints
* Resolution rate
* Category breakdown
* Aggregate city-wide statistics

No complaint-level or personal information is exposed.

---

# 🧠 AI Engine — IBM Granite

At the heart of Civic Grievance Portal is **IBM Granite**, running locally through Ollama.

### AI Capabilities

| Capability                    | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| 🏷️ Classification            | Categorizes civic complaints                       |
| 🔎 Entity Extraction          | Identifies location and urgency signals            |
| 🌎 Multilingual Understanding | Handles complaints across languages                |
| 🔁 Duplicate Detection        | Finds semantically similar complaints              |
| 📝 Summarization              | Generates weekly complaint digests                 |
| 🧭 RAG Routing                | Semantically identifies the responsible department |

### Supported Categories

The classifier currently handles:

* 🕳️ Potholes
* 🗑️ Garbage
* 💧 Water leakage
* 💡 Streetlights
* 🚰 Drainage
* 📌 Other

---

# 🧬 Semantic Department Routing

Instead of relying only on a simple:

```text
Complaint Category → Department
```

the system uses **vector-based Retrieval-Augmented Generation (RAG)**.

The flow is:

```text
Complaint
    ↓
AI Summary
    ↓
Local Embedding Model
    ↓
Vector Representation
    ↓
Cosine Similarity Search
    ↓
Department Reference Documents
    ↓
Responsible Department
```

This allows department routing to consider the **meaning of the complaint**, rather than relying purely on predefined category mappings.

---

# 🔄 How It Works

```text
                    👤 CITIZEN
                        │
                        ▼
             ┌─────────────────────┐
             │ Complaint Submission│
             │ Text / Voice / Photo│
             │ Location            │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │    IBM GRANITE      │
             │                     │
             │ • Classification    │
             │ • Language          │
             │ • Entities          │
             │ • Urgency           │
             │ • Summarization     │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │ Duplicate Detection │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │    Vector RAG       │
             │ Department Routing  │
             └──────────┬──────────┘
                        │
                        ▼
                  🗄️ MongoDB
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      🧑‍💼 ADMIN DASHBOARD     🌐 PUBLIC DASHBOARD
             │
             ▼
      Priority • Ward
      Escalation • Insights
             │
             ▼
       📧 Citizen Notification
```

The complete data flow is based on the project's documented architecture.

---

# 🏗️ Architecture

```text
grievance-triage-tool/
│
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Landing
│       │   ├── Login
│       │   ├── Register
│       │   ├── SubmitComplaint
│       │   ├── AdminDashboard
│       │   ├── Insights
│       │   ├── MyComplaints
│       │   ├── PublicDashboard
│       │   ├── PendingOfficials
│       │   └── Escalated
│       │
│       ├── components/
│       │   ├── AppShell
│       │   ├── LocationPicker
│       │   └── ComplaintHeatmap
│       │
│       └── hooks/
│           └── useSpeechToText
│
├── server/
│   ├── models/
│   │   ├── User
│   │   └── Complaint
│   │
│   ├── routes/
│   │   ├── auth
│   │   ├── complaints
│   │   ├── admin
│   │   └── public
│   │
│   ├── services/
│   │   ├── granite.service.js
│   │   ├── rag.service.js
│   │   └── notification.service.js
│   │
│   ├── data/
│   │   └── departments.js
│   │
│   └── middleware/
│       ├── auth
│       └── upload
│
└── grievance-triage-prd.md
```

---

# 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge\&logo=leaflet\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B573?style=for-the-badge)

* React
* React Router
* Vite
* Leaflet
* leaflet.heat
* Recharts
* Web Speech API

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-black?style=for-the-badge\&logo=express\&logoColor=white)

* Node.js
* Express.js
* JWT Authentication
* Multer
* Nodemailer

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

* MongoDB Atlas
* Mongoose

### AI

![IBM](https://img.shields.io/badge/IBM-052FAD?style=for-the-badge\&logo=ibm\&logoColor=white)

* IBM Granite
* Ollama
* Local sentence embeddings
* Vector similarity search
* RAG

The project's documented stack includes React, Node.js, Express, MongoDB, IBM Granite, Ollama, and a local embedding model.

---

# 🔐 Security & Governance

Civic infrastructure involves sensitive citizen information, so the system is designed around controlled access and responsible AI.

### 👮 Official Approval

New municipal officials cannot immediately access the admin dashboard.

An existing official must approve their account.

### 🔒 Authentication

The backend uses JWT-based authentication for protected routes.

### 👁️ Data Visibility

Citizen contact information is not unnecessarily exposed to officials.

### 🌐 Public Dashboard

The public dashboard exposes only aggregate statistics.

No individual complaint or personal information is displayed.

---

# 🤖 Responsible AI

AI should **assist people — not silently replace them.**

Civic Grievance Portal therefore keeps humans in the decision loop.

### ⚖️ Fairness

Classification outputs are spot-checked across categories and languages.

### 🔍 Transparency

AI-generated category, urgency, and department are presented as **suggestions**.

Officials can override them.

### 👨‍⚖️ Human Oversight

No complaint is automatically rejected, dismissed, or closed by AI.

Final decisions remain with municipal officials.

### 🚨 Escalation, Not Automation

Automatic escalation only **surfaces overdue complaints**.

It never automatically resolves or dismisses them.

### 🔐 Privacy

The system does not require government ID or Aadhaar linkage.

The public dashboard provides aggregate, anonymized statistics rather than complaint-level information.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB Atlas account
* Ollama
* Gmail account + App Password *(optional, for email notifications)*

---

## 1️⃣ Install IBM Granite

Pull the Granite model locally:

```bash
ollama pull granite3.2:8b
```

---

## 2️⃣ Start the Backend

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT secret>

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=granite3.2:8b

EMAIL_USER=<your Gmail address>
EMAIL_PASS=<your Gmail App Password>
```

Then:

```bash
npm run dev
```

On startup, the application loads the local embedding model for RAG.

You should eventually see:

```text
RAG embeddings ready.
```

---

## 3️⃣ Start the Frontend

```bash
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 4️⃣ Bootstrap the First Official

Because official accounts require approval, the first official account needs to be bootstrapped manually:

```bash
cd server

node scripts/approveFirstOfficial.js <official-email>
```

---

# 🖥️ Screenshots


### 🏠 Landing Page


<img width="1920" height="1536" alt="screencapture-localhost-5173-2026-09-15-23_54_06" src="https://github.com/user-attachments/assets/a04869b5-413f-4be2-8667-96d1af173cc9" />


### 📝 Citizen Complaint Submission

<img width="1900" height="1078" alt="Screenshot 2026-09-15 235609" src="https://github.com/user-attachments/assets/167658d3-b7d4-44dd-9fc0-c19030e3a2d7" />


### 🧑‍💼 Admin Command Center

<img width="1917" height="1078" alt="Screenshot 2026-09-15 235706" src="https://github.com/user-attachments/assets/3547439b-9976-42ae-bf9b-8672c32e7c97" />


### 🗺️ Civic Insights

<img width="1920" height="2017" alt="screencapture-localhost-5173-insights-2026-09-15-23_58_51" src="https://github.com/user-attachments/assets/fd0d1cb1-2963-483e-a996-c4c2d5c6ee23" />


### 🌐 Public Transparency


<img width="1917" height="1078" alt="Screenshot 2026-09-16 000214" src="https://github.com/user-attachments/assets/4697f58a-745a-4129-bd7e-3e55fe40e5de" />


---

# 📊 Expected Impact

Civic Grievance Portal is designed to move municipal teams from:

```text
Raw Complaint Flood
        ↓
Manual Reading
        ↓
Manual Classification
        ↓
Manual Routing
        ↓
Delayed Response
```

to:

```text
Citizen Complaint
        ↓
      AI Triage
        ↓
Priority + Category
        ↓
Semantic Department Routing
        ↓
Ward-Aware Dashboard
        ↓
Escalation + Insights
        ↓
Faster Human Action
```

The platform also improves citizen participation through multilingual voice input and duplicate warnings while giving the public greater visibility through aggregate transparency metrics.

---

# 🔭 Future Roadmap

### 📱 Citizen Accessibility

* WhatsApp Business API integration
* SMS notifications
* Offline-first complaint queuing

### ☁️ AI Infrastructure

* Fully cloud-hosted AI inference
* Scalable inference architecture
* Production-grade model monitoring

### 🏛️ Smart City Intelligence

* Predictive complaint hotspots
* Historical trend analysis
* Department performance analytics
* SLA performance monitoring
* Recurring infrastructure issue detection

The first four roadmap items are part of the project's documented future-work plan.

---

# 🌱 SDG 11 — Sustainable Cities & Communities

Technology becomes meaningful when it improves the places where people live.

Civic Grievance Portal contributes toward **SDG 11** by exploring how AI can help cities become:

**More responsive.**
**More inclusive.**
**More transparent.**
**More data-driven.**

---

# 👨‍💻 Built By

### Atharv Verma

**Electrical & Electronics Engineering • Full-Stack Developer • AI & Emerging Technologies**

Built as part of the **1M1B AI for Sustainability Virtual Internship** in collaboration with **IBM SkillsBuild & AICTE**.

---


<p align="center">

### 🏙️ Better complaints → Better insights → Better cities.

**Built with ❤️, AI, and a vision for smarter communities.**

</p>
