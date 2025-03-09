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

  // Updated regex to handle various image formats and captions
  const imageRegex =
    /!\[([^\]]*)\]\(((?:\.\.\/|\/)?assets\/img\/[^)]+\.webp)\)({:[^}]*})?(?:\s*_[^_]*_)?/g;

  content = content.replace(imageRegex, (match) => {
    // Extract parts of the image markdown
    const altText = match.match(/!\[(.*?)\]/)?.[1] || "";
    const imagePath = match.match(/\(([^)]+)\)/)?.[1] || "";
    const attributes = match.match(/{:([^}]*)}/)?.[1] || "";
    const caption = match.match(/_([^_]+)_$/)?.[1] || "";

    // Try both relative and absolute paths
    const absolutePath = imagePath.replace("../", "/");
    let lqipData = lqipMap[absolutePath] || lqipMap[imagePath];

    if (lqipData) {
      // Build new attributes
      let newAttributes = attributes
        .replace(/\s*lqip="[^"]*"\s*/g, "") // Remove existing LQIP
        .trim();

      // Add LQIP and other attributes
      newAttributes = `lqip="${lqipData}" ${newAttributes}`.trim();

      // Construct the new image markdown
      let newImage = `![${altText}](${imagePath}){: ${newAttributes}}`;

      // Add caption if it exists
      if (caption) {
        newImage += ` _${caption}_`;
      }

      return newImage;
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
          // Handle both path formats
          const jekyllPath =
            "/" + path.relative(baseDir, fullPath).split(path.sep).join("/");
          const altPath =
            "../" + path.relative(baseDir, fullPath).split(path.sep).join("/");

          lqipMap[jekyllPath] = result.metadata.dataURIBase64;
          lqipMap[altPath] = result.metadata.dataURIBase64; // Store both path formats

          console.log(`Generated LQIP for: ${jekyllPath}`);
          console.log(`Also stored as: ${altPath}`);
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
