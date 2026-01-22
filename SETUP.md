# Setup Instructions

## API Key Configuration

This app requires an OpenAI API key to function. Follow these steps to set it up:

### 1. Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (it starts with `sk-`)

### 2. Configure the App

1. Navigate to `src/config/`
2. Copy `config.template.js` to `config.js`:
   ```bash
   cp src/config/config.template.js src/config/config.js
   ```
3. Open `src/config/config.js`
4. Replace `'your-openai-api-key-here'` with your actual API key
5. Save the file

### 3. Security Note

⚠️ **IMPORTANT**: 
- The `config.js` file is in `.gitignore` and will NOT be committed to git
- Never share your API key publicly
- Never commit `config.js` to version control
- Keep your API key secure

### 4. Run the App

```bash
npm install
npm start
```

## Troubleshooting

If you see "API Key not configured" errors:
1. Make sure you created `config.js` (not just the template)
2. Verify your API key is valid
3. Check that the key is properly formatted in the config file
