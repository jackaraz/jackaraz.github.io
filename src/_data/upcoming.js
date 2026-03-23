const fs = require("fs");
const path = require("path");

module.exports = function () {
  const filePath = path.join(__dirname, "../upcoming.md");

  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return [];
  }

  // Extract YAML frontmatter between --- delimiters
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return [];

  const yamlText = fmMatch[1];
  const items = [];

  // Split into blocks — each list item starts with "- "
  const blocks = yamlText.split(/^(?=- )/m).filter((b) => b.trim().startsWith("-"));

  for (const block of blocks) {
    const item = {};
    for (const line of block.split("\n")) {
      // Skip comment lines
      if (line.trim().startsWith("#")) continue;
      // Match "- key: value" or "  key: value"
      const m = line.match(/^[-\s]+(\w+):\s*(.*)/);
      if (m) {
        const key = m[1];
        const value = m[2].replace(/^["']|["']$/g, "").trim();
        if (key === "date") {
          // Use noon UTC to avoid timezone-related off-by-one issues
          item.date = new Date(value + "T12:00:00Z");
        } else {
          item[key] = value;
        }
      }
    }
    if (item.date && item.title) items.push(item);
  }

  return items;
};
