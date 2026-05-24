import axios from 'axios';
import fs from 'fs/promises';
import { glob } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
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

  // 3. Load existing translations
  const srcDir = `${__dirname}/../src`;
  await fs.mkdir(srcDir, { recursive: true });

  // Load existing files
  let existingEs = {};
  let existingNl = {};
  try { existingEs = JSON.parse(await fs.readFile(`${srcDir}/es-translation.json`, 'utf8')); } catch {}
  try { existingNl = JSON.parse(await fs.readFile(`${srcDir}/nl-translation.json`, 'utf8')); } catch {}

  // 4. Save English (always overwrite - this is source)
  await fs.writeFile(`${srcDir}/en-translation.json`, JSON.stringify(en, null, 2));
  console.log('✅ English translations saved');

  // 5. Translate to Spanish (only new keys)
  console.log('🔄 Translating to Spanish...');
  const es = { ...existingEs };
  for (const [key, value] of Object.entries(en)) {
    if (es[key]) {
      console.log(`  ✅ Already translated: ${value}`);
      continue;
    }
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: value,
        source: 'en',
        target: 'es'
      }, { timeout: 10000 });
      es[key] = response.data.translatedText || value;
      console.log(`  ✅ Translated: ${value} → ${response.data.translatedText}`);
    } catch (e) {
      console.error(`  ❌ Failed to translate "${value}":`, e.response?.data || e.message);
      es[key] = value;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  await fs.writeFile(`${srcDir}/es-translation.json`, JSON.stringify(es, null, 2));
  console.log('✅ Spanish translations saved');

  // 6. Translate to Dutch (only new keys)
  console.log('🔄 Translating to Dutch...');
  const nl = { ...existingNl };
  for (const [key, value] of Object.entries(en)) {
    if (nl[key]) {
      console.log(`  ✅ Already translated: ${value}`);
      continue;
    }
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: value,
        source: 'en',
        target: 'nl'
      }, { timeout: 10000 });
      nl[key] = response.data.translatedText || value;
      console.log(`  ✅ Translated: ${value} → ${response.data.translatedText}`);
    } catch (e) {
      console.error(`  ❌ Failed to translate "${value}":`, e.response?.data || e.message);
      nl[key] = value;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  await fs.writeFile(`${srcDir}/nl-translation.json`, JSON.stringify(nl, null, 2));
  console.log('✅ Dutch translations saved');

  console.log('🎉 All translations completed successfully!');
})();
