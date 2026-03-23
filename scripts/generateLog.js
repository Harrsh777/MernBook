const fs = require("fs");
const path = require("path");

const templates = [
  [
    "Optimized MongoDB aggregation pipelines for dashboard queries.",
    "Added response caching for high-traffic API routes.",
    "Reduced average API latency by tightening query projections.",
  ],
  [
    "Improved JWT refresh token handling in authentication middleware.",
    "Fixed edge-case login failures caused by token expiration drift.",
    "Added clearer auth error responses for frontend debugging.",
  ],
  [
    "Refactored Express service modules for better separation of concerns.",
    "Extracted shared validation utilities across API endpoints.",
    "Simplified controller flow to make onboarding easier.",
  ],
  [
    "Debugged a production issue involving intermittent 500 responses.",
    "Improved request logging with contextual trace identifiers.",
    "Added guard clauses to prevent null payload crashes.",
  ],
  [
    "Implemented pagination and sorting improvements in project listing APIs.",
    "Optimized Mongoose indexes for frequent filter combinations.",
    "Verified endpoint performance with realistic seed data.",
  ],
  [
    "Hardened role-based access checks for admin-only endpoints.",
    "Cleaned up middleware order to avoid duplicate auth checks.",
    "Added missing permission validation on client management APIs.",
  ],
  [
    "Improved frontend-backend contract consistency for form submissions.",
    "Normalized API response shapes to reduce UI conditional logic.",
    "Fixed validation mismatch between client and server schemas.",
  ],
  [
    "Refined error-handling strategy for async controller operations.",
    "Added centralized helpers for formatted API success/error payloads.",
    "Reduced repetitive try/catch code across backend routes.",
  ],
  [
    "Worked on deployment readiness checks for environment variables.",
    "Improved startup diagnostics to catch missing config quickly.",
    "Documented safer rollback steps for production releases.",
  ],
  [
    "Profiled slow endpoints and removed redundant database calls.",
    "Improved batching logic for related data lookups.",
    "Cut memory usage by limiting oversized payload fields.",
  ],
  [
    "Added stronger input sanitization for public API routes.",
    "Fixed an edge case in nested object validation.",
    "Improved API test coverage for malformed request scenarios.",
  ],
  [
    "Refined project creation workflow across API and dashboard UI.",
    "Improved backend defaults for newly created project metadata.",
    "Fixed race condition risk during concurrent project updates.",
  ],
];

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildLogContent(date, points) {
  const bullets = points.map((point) => `- ${point}`).join("\n");
  return `## Dev Log (${date})\n\n${bullets}\n\nGenerated automatically\n`;
}

function generateDailyLog() {
  const rootDir = path.resolve(__dirname, "..");
  const logsDir = path.join(rootDir, "logs");
  const today = getTodayDate();
  const logFilePath = path.join(logsDir, `${today}.md`);

  fs.mkdirSync(logsDir, { recursive: true });

  if (fs.existsSync(logFilePath)) {
    console.log(`Log for ${today} already exists. Skipping.`);
    return;
  }

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  const randomizedPoints = shuffleArray(randomTemplate);
  const content = buildLogContent(today, randomizedPoints);

  fs.writeFileSync(logFilePath, content, "utf8");
  console.log(`Created daily log: logs/${today}.md`);
}

generateDailyLog();
