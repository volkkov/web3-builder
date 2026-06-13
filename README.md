<div align="center">

# 🔭 Web3 Builder Pulse

<img src="https://img.shields.io/badge/Status-LIVE-00f5ff?style=for-the-badge&labelColor=000010&color=00f5ff"/>
<img src="https://img.shields.io/badge/AI-OpenRouter-7b2fff?style=for-the-badge&labelColor=000010"/>
<img src="https://img.shields.io/badge/Updates-Daily-ff006e?style=for-the-badge&labelColor=000010"/>
<img src="https://img.shields.io/badge/License-MIT-ffffff?style=for-the-badge&labelColor=000010"/>

### Daily AI-powered digest tracking what Web3 builders are actually shipping

[🌐 Live Site](https://web3-builder-volkkov.vercel.app) · [📋 Reports](./reports/) · [⚙️ Workflow](./.github/workflows/daily-report.yml)

</div>

---

## ✨ What is this?

**Web3 Builder Pulse** is a fully autonomous AI bot that runs on GitHub Actions — no servers, no maintenance, no manual work.

Every day it:
1. 🔍 Scans **50+ trending Web3 GitHub repositories** across 10 topics
2. 🤖 Sends data to **OpenRouter AI** for deep analysis
3. 📝 Generates a sharp **builder digest report**
4. 📊 Updates **growth charts** with stars data
5. 💾 Commits everything automatically to this repo

---

## 📊 What's in each report?

| Section | Description |
|---------|-------------|
| 📊 Today's Snapshot | Overall vibe in Web3 building today |
| 🔥 Top 3 Projects | Most interesting repos and why they matter |
| 📈 Tech Trends Rising | Languages & frameworks gaining momentum |
| 💀 What's Cooling Down | Signs of declining interest |
| 🧠 Builder Insight | One sharp actionable insight |
| 📊 Growth Chart | ASCII bar chart of top repos by stars |

---

## 🏗️ How it works

```
GitHub Actions (cron: 8:00 + 9:00 UTC)
        │
        ▼
   bot.js runs
        │
        ├── Fetches trending repos from GitHub API
        │   (ethereum, solana, web3, defi, dao...)
        │
        ├── Sends to OpenRouter AI (openrouter/auto)
        │   for analysis and report generation
        │
        ├── Saves report-YYYY-MM-DD.md
        ├── Updates history.json
        └── Updates stats.json
             │
             ▼
      git commit & push
      (github-actions[bot] + volkkov)
```

---

## 🗂️ Repository Structure

```
web3-builder/
├── 📄 bot.js                    # Main AI bot
├── 📄 index.html                # Cosmic web dashboard
├── 📄 package.json              # Dependencies
├── 📁 reports/
│   ├── 📄 report-YYYY-MM-DD.md  # Daily reports
│   ├── 📄 history.json          # Reports archive
│   └── 📄 stats.json            # Stars data for charts
└── 📁 .github/workflows/
    └── 📄 daily-report.yml      # Automation config
```

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| 🤖 AI | OpenRouter (auto model selection) |
| ⚡ Runtime | Node.js 22 |
| 🔄 Automation | GitHub Actions |
| 🌐 Frontend | Vanilla HTML + Chart.js |
| 🚀 Hosting | Vercel |
| 📡 Data | GitHub REST API |

</div>

---

## 🚀 Self-Hosted Setup

1. Fork this repo
2. Add secrets in `Settings → Secrets → Actions`:
   - `OPENAI_API_KEY` — your OpenRouter key
   - `GH_PAT` — GitHub token with `repo` + `workflow`
   - `TALENT_WALLET` — your Base wallet address
3. Go to `Actions` → `Daily Web3 Builder Pulse` → `Run workflow`
4. Done — bot runs itself every day ✅

---

## 📈 Contribution Activity

> Both **volkkov** and **github-actions[bot]** contribute daily to this repo.
> The bot commits every report automatically — watch the contribution graph grow! 🟩

---

<div align="center">

**Built by [volkkov](https://github.com/volkkov) · Powered by OpenRouter AI · Runs on GitHub Actions**

⭐ Star this repo if you find it useful!

</div>
