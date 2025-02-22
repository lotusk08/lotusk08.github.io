const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Function to process front matter YAML and update LQIP
async function processFrontMatter(content, lqipMap) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);

  if (match) {
    try {
      const frontMatter = yaml.load(match[1]);

      if (frontMatter.image && frontMatter.image.path) {
        const imagePath = frontMatter.image.path;
        const lqipData = lqipMap[imagePath];

        if (lqipData) {
          frontMatter.image.lqip = lqipData;
          const newFrontMatter = yaml.dump(frontMatter, {
            lineWidth: -1,
            quotingType: '"',
            forceQuotes: false,
            noRefs: true,
            skipInvalid: true,
            styles: {
              "!!str": "LITERAL"
            }
          });
          return content.replace(frontMatterRegex, `---\n${newFrontMatter}---`);
        }
      }
    } catch (err) {
      console.error("Error processing front matter:", err);
    }
  }
  return content;
}

// Function to process Markdown content and update image LQIP
async function processMarkdown(mdPath, lqipMap) {
  let content = await fs.promises.readFile(mdPath, "utf8");

  // Process front matter first
  content = await processFrontMatter(content, lqipMap);

  // Updated regex to handle image with title
  const imageRegex =
    /!\[.*?\]\((\/assets\/img\/.*?\.webp)(?:\s+"[^"]*")?\)({:[^}]*})?/g;

  content = content.replace(imageRegex, (match, imagePath, existingAttrs) => {
    const lqipData = lqipMap[imagePath];
    if (lqipData) {
      // Preserve title if it exists
      const titleMatch = match.match(/\(([^)]+)\s+"([^"]+)"\)/);
      const title = titleMatch ? ` "${titleMatch[2]}"` : "";

      if (existingAttrs) {
        // Extract existing attributes, removing any duplicate lqip
        const attrs = existingAttrs
          .slice(2, -1)
          .replace(/\s*lqip="[^"]*"\s*/g, " ")
          .trim();
        return `![${match.split("![")[1].split("]")[0]}](${imagePath}${title}){: lqip="${lqipData}" ${attrs}}`;
      } else {
        return `![${match.split("![")[1].split("]")[0]}](${imagePath}${title}){: lqip="${lqipData}" }`;
      }
    }
    return match;
  });

  await fs.promises.writeFile(mdPath, content, "utf8");
}

// Function to scan images and generate LQIP data
async function generateLQIP(baseDir) {
  console.log("Starting LQIP generation...");
  const lqip = (await import("lqip-modern")).default;
  const lqipMap = {};

  async function scanDir(dirPath) {
    const dir = await fs.promises.opendir(dirPath);
    for await (const file of dir) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        await scanDir(fullPath);
      } else if (file.name.endsWith(".webp")) {
        try {
          const result = await lqip(fullPath);
          // Create Jekyll-style path (/assets/img/...)
          const jekyllPath =
            "/" + path.relative(baseDir, fullPath).split(path.sep).join("/");

          lqipMap[jekyllPath] = result.metadata.dataURIBase64;
          console.log(`Generated LQIP for: ${jekyllPath}`);
        } catch (err) {
          console.error(`Error processing file ${fullPath}:`, err);
        }
      }
    }
  }

  await scanDir(path.join(baseDir, "assets", "img"));
  return lqipMap;
}

// Function to scan markdown directories and update LQIP
async function updateMarkdownLQIP(markdownDir, lqipMap) {
  const dir = await fs.promises.opendir(markdownDir);
  for await (const file of dir) {
    if (file.name.endsWith(".md")) {
      const mdPath = path.join(markdownDir, file.name);
      try {
        await processMarkdown(mdPath, lqipMap);
        console.log(`Updated LQIP in: ${file.name}`);
      } catch (err) {
        console.error(`Error processing markdown ${mdPath}:`, err);
      }
    }
  }
}

// Main execution
async function main() {
  try {
    // Get the project root directory
    const projectRoot = process.cwd();

    // Generate LQIP data for all images
    const lqipMap = await generateLQIP(projectRoot);

    // Update markdown files in both _posts and _tabs directories
    await updateMarkdownLQIP(path.join(projectRoot, "_posts"), lqipMap);
    await updateMarkdownLQIP(path.join(projectRoot, "_tabs"), lqipMap);

    console.log("LQIP processing completed successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
