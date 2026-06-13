const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const OPENROUTER_API_KEY = process.env.OPENAI_API_KEY;
const WALLET = process.env.TALENT_WALLET || "unknown";

const GITHUB_TRENDING_TOPICS = [
  "ethereum", "solana", "web3", "defi", "blockchain",
  "smart-contracts", "nft", "layer2", "zk-proofs", "dao"
];

async function fetchTrendingRepos(topic) {
  const url = `https://api.github.com/search/repositories?q=topic:${topic}+pushed:>2024-01-01&sort=stars&order=desc&per_page=3`;
  const res = await fetch(url, {
    headers: { "Accept": "application/vnd.github.v3+json" }
  });
  const data = await res.json();
  return (data.items || []).map(r => ({
    name: r.full_name,
    stars: r.stargazers_count,
    description: r.description || "No description",
    url: r.html_url,
    language: r.language || "Unknown",
    pushed: r.pushed_at
  }));
}

async function generateReport(repos) {
  const repoList = repos.slice(0, 15).map((r, i) =>
    `${i + 1}. ${r.name} (⭐${r.stars}) [${r.language}] - ${r.description}`
  ).join("\n");

  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are Web3 Builder Pulse — a daily AI analyst tracking what Web3 developers are actually building.

Today is ${today}. Analyze these trending Web3 GitHub repositories and write a sharp, insightful daily digest.

TRENDING REPOS:
${repoList}

Write a report with these exact sections:

## 🔭 Web3 Builder Pulse — ${today}

### 📊 Today's Snapshot
(2-3 sentences: what's the overall vibe in Web3 building today)

### 🔥 Top 3 Projects to Watch
(pick the 3 most interesting, explain WHY they matter right now)

### 📈 Tech Trends Rising
(what languages/frameworks/concepts are gaining momentum)

### 💀 What's Cooling Down
(any signs of declining interest in certain areas)

### 🧠 Builder Insight
(one sharp, actionable insight for someone building in Web3 today)

### 📊 Growth Chart
(create an ASCII bar chart of top 5 repos by stars, max bar = 20 chars)

Keep it sharp, data-driven, under 600 words. No fluff.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://github.com/volkkov/web3-builder",
      "X-Title": "Web3 Builder Pulse"
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  if (!data.choices || !data.choices[0]) {
    throw new Error("OpenRouter error: " + JSON.stringify(data));
  }
  return data.choices[0].message.content;
}

async function loadHistory() {
  const historyFile = "reports/history.json";
  if (fs.existsSync(historyFile)) {
    return JSON.parse(fs.readFileSync(historyFile, "utf8"));
  }
  return [];
}

async function saveHistory(history) {
  fs.writeFileSync("reports/history.json", JSON.stringify(history, null, 2));
}

async function main() {
  console.log("🔭 Web3 Builder Pulse starting...");

  // Fetch repos from multiple topics
  let allRepos = [];
  for (const topic of GITHUB_TRENDING_TOPICS.slice(0, 5)) {
    try {
      const repos = await fetchTrendingRepos(topic);
      allRepos = allRepos.concat(repos);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`Skip topic ${topic}: ${e.message}`);
    }
  }

  // Deduplicate by repo name
  const seen = new Set();
  allRepos = allRepos.filter(r => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  // Sort by stars
  allRepos.sort((a, b) => b.stars - a.stars);
  console.log(`✅ Fetched ${allRepos.length} unique repos`);

  // Generate AI report
  const report = await generateReport(allRepos);
  console.log("✅ AI report generated");

  const today = new Date().toISOString().split("T")[0];
  const timestamp = new Date().toISOString();

  // Save report as markdown
  if (!fs.existsSync("reports")) fs.mkdirSync("reports");
  const reportPath = `reports/report-${today}.md`;
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Report saved: ${reportPath}`);

  // Update history
  const history = await loadHistory();
  const topRepos = allRepos.slice(0, 5).map(r => ({
    name: r.name,
    stars: r.stars,
    language: r.language
  }));

  history.unshift({
    date: today,
    timestamp,
    reportFile: `report-${today}.md`,
    topRepos,
    wallet: WALLET
  });

  // Keep last 90 days
  const trimmed = history.slice(0, 90);
  await saveHistory(trimmed);
  console.log("✅ History updated");

  // Save stats for charts
  const stats = {
    lastUpdated: timestamp,
    totalReports: trimmed.length,
    wallet: WALLET,
    latestDate: today,
    topRepos: allRepos.slice(0, 10).map(r => ({
      name: r.name.split("/")[1],
      stars: r.stars,
      language: r.language
    }))
  };
  fs.writeFileSync("reports/stats.json", JSON.stringify(stats, null, 2));
  console.log("✅ Stats saved");
  console.log("🚀 Web3 Builder Pulse complete!");
}

main().catch(e => {
  console.error("❌ Error:", e);
  process.exit(1);
});
