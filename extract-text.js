const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const glob = require('glob');
const fs = require('fs');
const path = require('path');

// Files to scan (adjust as needed)
const files = glob.sync('src/**/*.{js,jsx}');

// Extract text from JSX and JavaScript strings
function extractTextFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const extractedText = new Set();

  traverse(ast, {
    JSXText(path) {
      const text = path.node.value.trim();
      if (text && !text.match(/^\s*$/)) {
        extractedText.add(text);
      }
    },
    StringLiteral(path) {
      if (
        path.node.value &&
        !path.node.value.startsWith('.') &&
        !path.node.value.startsWith('/') &&
        !path.node.value.includes('node_modules')
      ) {
        extractedText.add(path.node.value);
      }
    },
  });

  return Array.from(extractedText);
}

// Extract text from all files
const allText = [];
files.forEach((file) => {
  try {
    const text = extractTextFromFile(file);
    allText.push(...text);
  } catch (error) {
    console.error(`Error processing file ${file}:`, error.message);
  }
});

// Generate translation.json
const translationJSON = {};
allText.forEach((text) => {
  const key = text
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
  translationJSON[key] = text;
});

// Save to en/translation.json
const outputDir = path.join(__dirname, 'public/locales/en');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(
  path.join(outputDir, 'translation.json'),
  JSON.stringify(translationJSON, null, 2)
);

console.log('✅ Extracted text and saved to public/locales/en/translation.json');
