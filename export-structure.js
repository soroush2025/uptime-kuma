const fs = require('fs');
const path = require('path');

// Folders and files to exclude
const excludePatterns = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.DS_Store',
  '.env',
  '.vscode',
  'coverage',
  '.next',
  '.cache',
  '.idea',
  'package-lock.json',
  'yarn.lock',
  'public',
  '.github',
  '.husky',
];

function shouldExclude(itemName) {
  // Check against exclude patterns
  if (excludePatterns.some(pattern => itemName === pattern || itemName.startsWith(pattern + '/'))) {
    return true;
  }

  // Check file extension
  if (
    itemName.endsWith('.svg') ||
    itemName.endsWith('.ico') ||
    itemName.endsWith('.png') ||
    itemName.endsWith('.jpg') ||
    itemName.endsWith('.jpeg') ||
    itemName.endsWith('.gif') ||
    itemName.endsWith('.json') ||
    itemName.endsWith('.css')
  ) {
    return true;
  }

  return false;
}

function getProjectStructure(startPath, output = [], indent = '') {
  // Read the directory contents
  const items = fs.readdirSync(startPath);

  // Process each item in the directory
  items
    .filter(item => !shouldExclude(item)) // Filter out excluded items
    .sort((a, b) => {
      // Sort directories first, then files
      const aPath = path.join(startPath, a);
      const bPath = path.join(startPath, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    })
    .forEach(item => {
      const itemPath = path.join(startPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // Add directory to output
        output.push(`${indent}📁 ${item}/`);

        // Recursively process subdirectory
        getProjectStructure(itemPath, output, indent + '  ');
      } else {
        // Add file to output
        output.push(`${indent}📄 ${item}`);
      }
    });

  return output;
}

// Get the current working directory (your project root)
const projectRoot = process.cwd();

// Get the structure
const structure = getProjectStructure(projectRoot);

// Add header with timestamp
const header = `Project Structure (Generated on ${new Date().toLocaleString()})\n${'='.repeat(
  50,
)}\n\n`;

// Write to a file
const outputPath = path.join(projectRoot, 'project-structure.txt');
fs.writeFileSync(outputPath, header + structure.join('\n'), 'utf8');

// Project structure has been exported to: ${outputPath}
