const fs = require('fs');
const path = require('path');

console.log('🚀 Starting fix-translations script...');

const srcDir = path.join(__dirname, '../src');
const translationFiles = [
  'en-translation.json',
  'es-translation.json',
  'nl-translation.json'
];

function toReadableText(text) {
  let readable = text.replace(/__/g, ' ').replace(/_/g, ' ');
  readable = readable
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`❌ Failed to read ${filePath}:`, err);
    return;
  }

  let changesMade = false;
  for (const key in data) {
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
