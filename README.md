# 🎓 TutorPro — The Operating System for Independent Tutors & Coaching Centres

> **"Run your tuition business, not your paperwork."**  
> A full-featured B2B SaaS Web Application built with the **MERN Stack** (MongoDB, Express, React, Node.js) for college mini-project presentations and real-world commercial viability.

---

## 📌 1. Problem Statement & Presentation Pitch

### The Problem: The "Tutor Chaos Stack"
A typical Indian tutor or small coaching centre owner currently relies on disconnected tools:
* **Student Attendance:** Paper notebooks or diary registers that get lost.
* **Monthly Fee Tracking:** Messy Excel sheets or notebook margins.
* **Fee Follow-ups:** Awkward manual WhatsApp reminders.
* **Test Marks & Ranks:** Hand calculators and separate spreadsheets.
* **Parent Inquiries:** Constant phone interruptions asking *"Sir, how is my child doing?"*

### The Solution: TutorPro
TutorPro brings all academic, business, and parent communication operations into **one unified, role-based SaaS dashboard**.

---

## 💰 2. B2B SaaS Business Model & Pricing

| Plan | Price | Student Capacity | Key Features |
| :--- | :--- | :--- | :--- |
| **Free Tier** | **₹0 / mo** | Up to 15 students | Student Directory, Attendance Roll-Call, Basic Dashboard |
| **Starter** *(Popular)* | **₹199 / mo** | Up to 75 students | Batches & Timetable, Fee Tracking, WhatsApp Reminders, Parent Portal |
| **Pro** | **₹599 / mo** | Up to 300 students | Unit Tests & Auto Ranks, WhatsApp Absent Alerts, Performance Analytics |
| **Institute** | **₹1,499 / mo** | Up to 1,000 students | Multi-branch Operations, Multi-faculty, Custom Academy Branding |

---

## 🚀 3. Future Scope: The Marketplace & AI Engine (Presentation Highlight)

* **Dual Revenue Streams:**
  1. **SaaS Subscriptions:** ₹199–₹1,499/month from tutors.
  2. **Marketplace Commissions:** **5% transaction commission** when parents discover tutors via public profiles and book paid demo classes.
* **AI Roadmap:**
  * AI automated question paper & test generation.
  * AI student weak-topic diagnostic reports.
  * Multi-city tutor discovery matching.

---

## 🛠️ 4. Tech Stack Architecture

* **Frontend:** React 19, Vite 8, Modern Vanilla CSS Design Tokens, Dual Themes (Light & Dark), Glassmorphism, Micro-animations, Lucide Icons.
* **Backend:** Node.js, Express, JWT Authentication, Role-Based Access Control (`ROLE_TUTOR`, `ROLE_PARENT`).
* **Database & Persistence:** MongoDB (Mongoose models for Users, Batches, Students, Attendance, Fees, Tests) with an automatic zero-config fallback to high-performance local JSON storage so college live demos never fail if local MongoDB is offline!

---

## 🌟 5. Core Modules Implemented

1. **Public SaaS Landing Page:**
   * Interactive live hero mockup (`"Good morning, Tanmoy 👋"`, revenue sparkline, upcoming classes).
   * Problem & Solution comparison cards.
   * 6 Core Feature deep-dives.
   * 6-Step *"How It Works"* timeline.
   * Interactive B2B Pricing table.
   * Future Scope Marketplace showcase card (*Rahul Sharma, ₹500/class, 4.8★*).
2. **Onboarding Wizard (3 Steps):**
   * Step 1: Tuition name, primary subject, student count.
   * Step 2: First batch setup (grade, schedule days, monthly fee).
   * Step 3: 1-click sample coaching roster loader or manual entry.
3. **Executive Tutor Dashboard:**
   * **Overview:** High-level KPIs, 6-month revenue trendline, today's schedule, real-time activity stream.
   * **Students Directory:** Full roster, batch filter, search bar, contact details, Add Student modal.
   * **Batches & Timetable:** Batch capacity meters, weekly class matrix timetable (Mon–Sat).
   * **1-Click Attendance:** 30-second roll-call (Present / Absent / Late) with automated WhatsApp absent notification generator.
   * **Fee Management Ledger:** Paid vs. Pending breakdown, payment recorder (UPI/Cash) with automated receipt generation, and 1-click WhatsApp payment reminders with direct `wa.me` links!
   * **Tests & Result Analytics:** Unit test scoring, automated rank computation, class averages, and student feedback.
   * **Parent Transparency Portal:** Dedicated portal view for parents (Rahul Das's report, 91% attendance progress gauge, test scores, fee receipts).
   * **Subscription Tier Manager:** Plan switching and capacity upgrade simulator.
4. **Zero-Friction College Demo Switcher:**
   * 1-click instant persona switch between **👨‍🏫 Tanmoy (Tutor)** and **👨‍👩‍👦 Amit Das (Parent)**.

---

## 🏃 6. How to Run Locally

### Start Backend API
```bash
cd tutorpro/server
npm install
npm run start
# Server boots up on http://127.0.0.1:5000
```

### Start Frontend Client
```bash
cd tutorpro/client
npm install
npm run dev
# Frontend boots up on http://127.0.0.1:3000
```
Open **`http://127.0.0.1:3000`** in your browser.
