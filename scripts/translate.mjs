// Replace your translation blocks with this:

// 4. Translate to Spanish
console.log('🔄 Translating to Spanish...');
const es = {};
for (const [key, value] of Object.entries(en)) {
  try {
    const response = await axios.post('https://libretranslate.com/translate', {  // Try .com instead of .de
      q: value,
      source: 'en',
      target: 'es'
    }, { timeout: 10000 });
    es[key] = response.data.translatedText || value;
    console.log(`  ✅ Translated: ${value} → ${response.data.translatedText}`);
  } catch (e) {
    console.error(`  ❌ Failed to translate "${value}":`, e.response?.data || e.message);
    es[key] = value; // Fallback
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}

// 5. Translate to Dutch
console.log('🔄 Translating to Dutch...');
const nl = {};
for (const [key, value] of Object.entries(en)) {
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
