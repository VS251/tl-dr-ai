
# tl;dr.ai

**TL;DR AI** is a lightweight, browser-based tool that leverages OpenAI's language models to generate concise summaries of longer text. Whether you're skimming articles, reviewing documents, or just looking for the key points, TL;DR AI delivers quick, accurate overviews in seconds.

This project is designed to be minimal, fast, and easy to use — no installations, no backend, and no extra dependencies.


## Features

- 📌 Summarize any block of text in one click
- ⚡ Fast, browser-based interface
- 🔐 API key-based access to OpenAI (you control the key)
- 💡 Clean and distraction-free UI
- 🛠️ No build tools, no frameworks — just HTML, CSS, and JavaScript


## Installation

Install my-project with npm

```bash
  git clone https://github.com/VS251/tl-dr-ai.git
  cd tl-dr-ai
```

```bash
  Open index.html in your browser
  No installation required — everything runs client-side.
```
    
## Configuration

To use the app, you’ll need an OpenAI API key.

Open the app.
Enter your API key into the input field.
Paste the text you'd like to summarize.
Click Summarize.

⚠️ Note: For security, your API key is stored only in the browser's memory and never sent to any third-party server.
## 💡 Future Improvements

- PDF/Text file uploads
- Export summaries to markdown
- Support for multiple summarization styles (e.g., formal, ELI5, bullet points)
- Offline/local summarization using models like T5 via Hugging Face (optional)