const fs = require("fs");
const path = require("path");

const README_PATH = path.resolve(__dirname, "..", "README.md");
const SECTION_TITLE = "## Daily Reminder Log";

function getTodayIST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function updateReadme() {
  if (!fs.existsSync(README_PATH)) {
    throw new Error("README.md not found.");
  }

  const today = getTodayIST();
  const newLine = `- ${today}: Daily reminder update`;
  const content = fs.readFileSync(README_PATH, "utf8");

  if (content.includes(newLine)) {
    console.log("README already updated for today. Skipping.");
    return;
  }

  let updatedContent;

  if (content.includes(SECTION_TITLE)) {
    updatedContent = `${content.trimEnd()}\n${newLine}\n`;
  } else {
    updatedContent =
      `${content.trimEnd()}\n\n${SECTION_TITLE}\n\n` +
      `${newLine}\n`;
  }

  fs.writeFileSync(README_PATH, updatedContent, "utf8");
  console.log("README.md updated with daily reminder.");
}

updateReadme();
