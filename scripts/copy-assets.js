const fs = require('fs');
const path = require('path');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory not found: ${srcDir}`);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  // Copy meteor-standalone images to public/meteor-standalone/images
  const msSrc = path.join(repoRoot, 'meteor-standalone', 'images');
  const msDest = path.join(repoRoot, 'public', 'meteor-standalone', 'images');
  copyDir(msSrc, msDest);

  // Copy top-level images/ (root images) to public/images
  const rootImagesSrc = path.join(repoRoot, 'images');
  const rootImagesDest = path.join(repoRoot, 'public', 'images');
  copyDir(rootImagesSrc, rootImagesDest);

  // If chatbot has images inside public/chatbot/images, ensure robot.png is available at public/images/robot.png
  const chatbotRobotSrc = path.join(repoRoot, 'public', 'chatbot', 'images', 'robot.png');
  const robotDest = path.join(repoRoot, 'public', 'images', 'robot.png');
  try {
    if (fs.existsSync(chatbotRobotSrc)) {
      fs.mkdirSync(path.dirname(robotDest), { recursive: true });
      fs.copyFileSync(chatbotRobotSrc, robotDest);
    }
  } catch (err) {
    console.warn('Could not copy chatbot robot image:', err);
  }

  console.log('Asset copy script finished.');
}

main();
