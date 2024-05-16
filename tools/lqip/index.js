const lqip = require('lqip-modern');
const fs = require('fs');
const path = require('path');

async function ls(dirPath) {
  console.log('starting');
  const dir = await fs.promises.opendir(dirPath);
  for await (const file of dir) {
    if (file.name.includes('.webp')) {
      const filePath = path.join(dirPath, file.name);
      try {
        const result = await lqip(filePath);
        console.log(' ');
        console.log(file.name);
        console.log(' ');
        console.log(result.metadata.dataURIBase64); // "data:image/webp;base64,...."
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    }
  }
  console.log('done');
}

ls('assets/img/site').catch(console.error);
ls('assets/img/post').catch(console.error);
