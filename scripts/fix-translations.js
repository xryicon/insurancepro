import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Starting fix-translations script...');

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');
const translationFiles = [
  'en-translation.json',
  'es-translation.json',
  'nl-translation.json'
];

// Function to convert snake_case to Title Case
function toReadableText(text) {
  // Replace double underscores with a single space (e.g., "fast__easy" → "fast easy")
  let readable = text.replace(/__/g, ' ');

  // Replace single underscores with spaces (e.g., "start_new_quote" → "start new quote")
  readable = readable.replace(/_/g, ' ');

  // Capitalize the first letter of each word
  readable = readable
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Special cases (e.g., "Fast & Easy" instead of "Fast  Easy")
  readable = readable.replace(/ \& /g, ' & ');

  return readable;
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
  } catch (err) {
    console.error(`❌ Failed to read ${filePath}:`, err);
    return;
  }

  let changesMade = false;
  for (const key in data) {
    // Fix if the value matches the key OR if the value contains underscores
    if (data[key] === key || (typeof data[key] === 'string' && data[key].includes('_'))) {
      const textToFix = data[key] === key ? key : data[key];
      const fixedValue = toReadableText(textToFix);
      if (data[key] !== fixedValue) {
        data[key] = fixedValue;
        changesMade = true;
        console.log(`✅ Fixed: "${key}": "${data[key]}" → "${fixedValue}"`);
      }
    }
  }

  if (changesMade) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Saved changes to ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to save ${filePath}:`, err);
    }
  } else {
    console.log(`✅ No fixes needed for ${filePath}`);
  }
});

console.log('🎉 Fix-translations script completed!');
