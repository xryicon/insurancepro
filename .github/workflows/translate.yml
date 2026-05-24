name: Auto Translate

on:
  push:
    paths:
      - 'src/**'

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4.1.1

      - name: Set up Node.js 24
        uses: actions/setup-node@v4.0.2
        with:
          node-version: 24

      - name: Install dependencies
        run: npm install axios

      - name: Run translation script
        run: node scripts/translate.mjs

      - name: Commit changes
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add src/en-translation.json src/es-translation.json src/nl-translation.json
          git diff --cached --quiet || git commit -m "🤖 Update translations"
          git push
