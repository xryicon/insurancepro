import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Starting fix-translations script...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');
const translationFiles = [
  'en-translation.json',
  'es-translation.json',
  'nl-translation.json'
];

function toReadableText(text) {
  console.log(`🔍 Converting text: "${text}"`);
  let readable = text.replace(/__/g, ' ').replace(/_/g, ' ');

  readable = readable
    .split(' ')
    .map(word => {
      // Keep acronyms uppercase (e.g., "NIE", "ID", "PDF")
      if (word === word.toUpperCase() && word.length <= 4) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  readable = readable.replace(/ \& /g, ' & ');
  console.log(`🔍 Converted to: "${readable}"`);
  return readable;
}

function fixNestedValues(obj) {
  let changesMade = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedChanges = fixNestedValues(obj[key]);
      changesMade += nestedChanges;
    } else if (typeof obj[key] === 'string') {
      // Fix if the value contains underscores or matches the key
      if (obj[key].includes('_') || obj[key] === key) {
        const fixedValue = toReadableText(obj[key]);
        if (obj[key] !== fixedValue) {
          obj[key] = fixedValue;
          changesMade++;
          console.log(`✅ Fixed: "${key}": "${obj[key]}" → "${fixedValue}"`);
        }
      }
    }
  }
  return changesMade;
}

translationFiles.forEach(file => {
  const filePath = path.join(srcDir, file);
  console.log(`📄 Processing file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  let data;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContent);
    console.log(`📋 File contains ${Object.keys(data).length} keys`);
  } catch (err) {
    console.error(`❌ Failed to read ${filePath}:`, err);
    return;
  }

  const changesMade = fixNestedValues(data);

  if (changesMade > 0) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Saved ${changesMade} changes to ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to save ${filePath}:`, err);
    }
  } else {
    console.log(`✅ No fixes needed for ${filePath}`);
  }
});

console.log('🎉 Fix-translations script completed!');
