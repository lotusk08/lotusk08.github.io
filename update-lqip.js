const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Function to process front matter YAML and update LQIP
async function processFrontMatter(content, lqipMap) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return content; // No front matter found
  }

  try {
    const frontMatter = yaml.load(match[1]);

    // Check if frontMatter exists and has required structure
    if (!frontMatter || typeof frontMatter !== "object") {
      console.warn("Invalid front matter format");
      return content;
    }

    // If no image property, return original content
    if (!frontMatter.image || !frontMatter.image.path) {
      return content;
    }

    let imagePath = frontMatter.image.path;

    // Only standardize path if it's not a URL
    if (!isUrl(imagePath)) {
      // Standardize image path in front matter for local files only
      imagePath = standardizePath(imagePath);
      // Update the path to absolute format only for local files
      frontMatter.image.path = imagePath;
    }

    const lqipData = lqipMap[imagePath];

    if (lqipData) {
      frontMatter.image.lqip = lqipData;
    } else {
      console.warn(`No LQIP data found for image: ${imagePath}`);
    }

    // Use try/catch to handle any serialization issues
    try {
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
    } catch (err) {
      console.error("Error serializing front matter:", err);
      return content; // Return original content on error
    }
  } catch (err) {
    console.error("Error processing front matter:", err);
    return content; // Return original content on error
  }
}

// Function to check if a path is a URL
function isUrl(path) {
  if (!path) return false;
  // Check if the path starts with http:// or https://
  return /^https?:\/\//i.test(path);
}

// Helper function to standardize paths
function standardizePath(imagePath) {
  if (!imagePath) return ""; // Handle null/undefined paths
  
  // Skip standardization for URLs
  if (isUrl(imagePath)) {
    return imagePath;
  }

  // Standardize path format for local files
  if (imagePath.startsWith("../")) {
    return imagePath.replace("../", "/");
  } else if (imagePath.startsWith("./")) {
    return imagePath.replace("./", "/");
  } else if (!imagePath.startsWith("/")) {
    return "/" + imagePath;
  }
  return imagePath;
}

// Function to process Markdown content and update image LQIP
async function processMarkdown(mdPath, lqipMap) {
  let content;

  try {
    content = await fs.promises.readFile(mdPath, "utf8");
  } catch (err) {
    console.error(`Failed to read markdown file ${mdPath}:`, err);
    return; // Skip this file
  }

  // Process front matter first
  content = await processFrontMatter(content, lqipMap);

  // Updated regex to handle various image formats including title attributes
  // This matches all path formats: ![text](/assets/img/path.webp), ![text](../assets/img/path.webp), ![text](./assets/img/path.webp)
  // Added word boundary markers and more specific path matching
  const imageRegex =
    /!\[([^\]]*)\]\(((?:\.\.\/|\.\/|\/)?assets\/img\/[^)\s]+\.webp)(?:\s+"([^"]*)")?\)({:[^}]*})?(?:\s*_[^_]*_)?/g;

  try {
    content = content.replace(
      imageRegex,
      (
        match,
        altText = "",
        imagePath = "",
        titleAttr = "",
        attributes = ""
      ) => {
        // Extract parts of the image markdown more safely
        altText = altText || "";
        imagePath = (imagePath || "").trim();
        titleAttr = titleAttr || "";
        attributes = attributes
          ? attributes.match(/{:([^}]*)}/)?.[1] || ""
          : "";

        // Extract caption if it exists in the original match
        const captionMatch = match.match(/_([^_]+)_$/);
        const caption = captionMatch ? captionMatch[1] : "";

        if (!imagePath) {
          console.warn(`Skipping image with empty path in ${mdPath}`);
          return match; // Return original markdown if path extraction failed
        }

        // Skip URL processing for external URLs
        if (isUrl(imagePath)) {
          const lqipData = lqipMap[imagePath];
          
          if (lqipData) {
            // Handle URL with LQIP data
            let newAttributes = attributes
              .replace(/\s*lqip="[^"]*"\s*/g, "") // Remove existing LQIP
              .trim();

            if (newAttributes) {
              newAttributes = `lqip="${lqipData}" ${newAttributes}`.trim();
              let newImage = `![${altText}](${imagePath}${titleAttr ? ` "${titleAttr}"` : ""}){: ${newAttributes}}`;
              if (caption) newImage += ` _${caption}_`;
              return newImage;
            } else {
              let newImage = `![${altText}](${imagePath}${titleAttr ? ` "${titleAttr}"` : ""}){: lqip="${lqipData}"}`;
              if (caption) newImage += ` _${caption}_`;
              return newImage;
            }
          }
          
          // If no LQIP data for URL, return original format
          return match;
        }

        // Convert to absolute path format for both lookup and output (only for local files)
        const absolutePath = standardizePath(imagePath);

        // Use the standardized absolute path for lookup
        const lqipData = lqipMap[absolutePath];

        if (lqipData) {
          // Build new attributes
          let newAttributes = attributes
            .replace(/\s*lqip="[^"]*"\s*/g, "") // Remove existing LQIP
            .trim();

          // Add LQIP and other attributes
          if (newAttributes) {
            newAttributes = `lqip="${lqipData}" ${newAttributes}`.trim();
            // Construct the new image markdown with attributes - using absolute path format
            let newImage = `![${altText}](${absolutePath}${titleAttr ? ` "${titleAttr}"` : ""}){: ${newAttributes}}`;

            // Add caption if it exists
            if (caption) {
              newImage += ` _${caption}_`;
            }

            return newImage;
          } else {
            // If no attributes exist, add LQIP as an attribute
            let newImage = `![${altText}](${absolutePath}${titleAttr ? ` "${titleAttr}"` : ""}){: lqip="${lqipData}"}`;

            // Add caption if it exists
            if (caption) {
              newImage += ` _${caption}_`;
            }

            return newImage;
          }
        }

        // If no LQIP data found, log warning and still convert the path to absolute format
        return `![${altText}](${absolutePath}${titleAttr ? ` "${titleAttr}"` : ""})${attributes ? `{: ${attributes}}` : ""}${caption ? ` _${caption}_` : ""}`;
      }
    );
  } catch (err) {
    console.error(`Error during regex replacement in ${mdPath}:`, err);
    // Continue with the original content
  }

  try {
    await fs.promises.writeFile(mdPath, content, "utf8");
  } catch (err) {
    console.error(`Failed to write to markdown file ${mdPath}:`, err);
  }
}

// Function to scan images and generate LQIP data
async function generateLQIP(baseDir) {
  console.log("Starting LQIP generation...");

  // Validate that the img directory exists
  const imgDir = path.join(baseDir, "assets", "img");
  try {
    await fs.promises.access(imgDir, fs.constants.R_OK);
  } catch (err) {
    console.error(
      `Image directory ${imgDir} does not exist or is not readable:`,
      err
    );
    return {}; // Return empty map if directory doesn't exist
  }

  let lqip;
  try {
    lqip = (await import("lqip-modern")).default;
  } catch (err) {
    console.error("Failed to import lqip-modern:", err);
    return {}; // Return empty map if module can't be loaded
  }

  const lqipMap = {};

  async function scanDir(dirPath) {
    let dir;
    try {
      dir = await fs.promises.opendir(dirPath);
    } catch (err) {
      console.error(`Failed to open directory ${dirPath}:`, err);
      return;
    }

    for await (const file of dir) {
      const fullPath = path.join(dirPath, file.name);

      try {
        if (file.isDirectory()) {
          await scanDir(fullPath);
        } else if (file.name.toLowerCase().endsWith(".webp")) {
          try {
            // Check if file is readable before processing
            await fs.promises.access(fullPath, fs.constants.R_OK);

            const result = await lqip(fullPath);
            // Standardize on absolute path format for the lqipMap
            const standardPath =
              "/" + path.relative(baseDir, fullPath).split(path.sep).join("/");

            if (result && result.metadata && result.metadata.dataURIBase64) {
              // Store only the standardized absolute path
              lqipMap[standardPath] = result.metadata.dataURIBase64;
              console.log(`Generated LQIP for: ${standardPath}`);
            } else {
              console.warn(`Invalid LQIP result for ${standardPath}`);
            }
          } catch (err) {
            console.error(`Error processing file ${fullPath}:`, err);
          }
        }
      } catch (err) {
        console.error(`Error accessing ${fullPath}:`, err);
      }
    }
  }

  await scanDir(imgDir);
  console.log(`Generated LQIP for ${Object.keys(lqipMap).length} images`);
  return lqipMap;
}

// Function to scan markdown directories and update LQIP
async function updateMarkdownLQIP(markdownDir, lqipMap) {
  if (Object.keys(lqipMap).length === 0) {
    console.warn(`No LQIP data available. Skipping updates to ${markdownDir}`);
    return;
  }

  try {
    await fs.promises.access(markdownDir, fs.constants.R_OK);
  } catch (err) {
    console.error(
      `Markdown directory ${markdownDir} does not exist or is not readable:`,
      err
    );
    return;
  }

  let dir;
  try {
    dir = await fs.promises.opendir(markdownDir);
  } catch (err) {
    console.error(`Failed to open directory ${markdownDir}:`, err);
    return;
  }

  let processedCount = 0;

  for await (const file of dir) {
    if (file.name.toLowerCase().endsWith(".md")) {
      const mdPath = path.join(markdownDir, file.name);
      try {
        await processMarkdown(mdPath, lqipMap);
        console.log(`Updated LQIP in: ${file.name}`);
        processedCount++;
      } catch (err) {
        console.error(`Error processing markdown ${mdPath}:`, err);
      }
    }
  }

  console.log(`Processed ${processedCount} markdown files in ${markdownDir}`);
}

// Main execution
async function main() {
  try {
    // Get the project root directory
    const projectRoot = process.cwd();
    console.log(`Starting LQIP processing in directory: ${projectRoot}`);

    // Generate LQIP data for all images
    const lqipMap = await generateLQIP(projectRoot);

    if (Object.keys(lqipMap).length === 0) {
      console.warn(
        "No LQIP data was generated. Check image directory and error messages."
      );
    }

    // Update markdown files in both _posts and _tabs directories
    const postsDir = path.join(projectRoot, "_posts");
    const tabsDir = path.join(projectRoot, "_tabs");

    await updateMarkdownLQIP(postsDir, lqipMap);
    await updateMarkdownLQIP(tabsDir, lqipMap);

    console.log("LQIP processing completed successfully!");
  } catch (err) {
    console.error("Fatal error in LQIP processing:", err);
    process.exit(1); // Exit with error code
  }
}

// Execute with proper error handling
main().catch((err) => {
  console.error("Unhandled error in main execution:", err);
  process.exit(1);
});