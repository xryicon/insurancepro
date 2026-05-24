import axios from 'axios';
import fs from 'fs/promises';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Extract all text from components
const files = glob.sync('src/**/*.{js,jsx}');
const extractedText = new Set();

for (const file of files) {
  try {
    const content = await fs.readFile(file, 'utf8');
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    traverse.default(ast, {
      // Extract from t() calls
      CallExpression(path) {
        if (
          path.node.callee.type === 'Identifier' &&
          path.node.callee.name === 't' &&
          path.node.arguments.length > 0 &&
          path.node.arguments[0].type === 'StringLiteral'
        ) {
          extractedText.add(path.node.arguments[0].value);
        }
      },
      // Extract from JSX text (fallback)
      JSXText(path) {
        const text = path.node.value.trim();
        if (text && !text.match(/^\s*$/)) {
          extractedText.add(text);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

// 2. Create English translation file
const en = {};
Array.from(extractedText).forEach((text) => {
  const key = text
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
  en[key] = text;
});

// 3. Save files
const srcDir = `${__dirname}/../src`;
await fs.mkdir(srcDir, { recursive: true });
await fs.writeFile(`${srcDir}/en-translation.json`, JSON.stringify(en, null, 2));
console.log('✅ English translations saved');

// 4. Translate to Spanish
console.log('🔄 Translating to Spanish...');
const es = {};
for (const [key, value] of Object.entries(en)) {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: value,
      source: 'en',
      target: 'es'
    });
    es[key] = response.data.translatedText || value;
  } catch (e) {
    es[key] = value;
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}
await fs.writeFile(`${srcDir}/es-translation.json`, JSON.stringify(es, null, 2));
console.log('✅ Spanish translations saved');

// 5. Translate to Dutch
console.log('🔄 Translating to Dutch...');
const nl = {};
for (const [key, value] of Object.entries(en)) {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: value,
      source: 'en',
      target: 'nl'
    });
    nl[key] = response.data.translatedText || value;
  } catch (e) {
    nl[key] = value;
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}
await fs.writeFile(`${srcDir}/nl-translation.json`, JSON.stringify(nl, null, 2));
console.log('✅ Dutch translations saved');

console.log('🎉 All translations completed successfully!');
