# Meteor AI Chatbot

An AI-powered chatbot about meteors, meteoroids, and space phenomena, featuring a beautiful Three.js starfield background and multi-modal content integration.

## Features

- **AI-Powered Responses**: Uses Google Gemini API for intelligent, contextual answers
- **Multi-Modal Content**: Displays images, news articles, and research papers
- **Beautiful UI**: Three.js animated starfield background with floating robot character
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Fetches live content from various APIs

## Files Structure

```
chatbot/
├── aibot.html              # Main HTML file
├── aibot.js                # JavaScript logic and API integration
├── aibot.css               # Styling and animations
├── .env.example            # Environment variables template
├── INTEGRATION_GUIDE.md    # API integration guide
├── test-gemini-api.js      # Gemini API tests
├── test-ui-ux.html         # UI/UX test suite
├── validate-serpapi.html   # SerpAPI validation tests
├── images/
│   └── robot.png           # Robot character image
├── docs/
│   ├── design.md           # Architecture and design documentation
│   ├── requirements.md     # Feature requirements
│   └── tasks.md            # Implementation tasks
└── README.md               # This file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install three @google/generative-ai
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your-api-key-here
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open the Chatbot**
   - Navigate to `http://localhost:5173/aibot.html`

## API Requirements

The chatbot requires a backend API running on `http://localhost:8080` with these endpoints:

- `GET /api/images?search={query}` - Returns array of image URLs
- `GET /api/news?search={query}` - Returns array of news articles
- `GET /api/papers?search={query}` - Returns array of research papers

See `INTEGRATION_GUIDE.md` for detailed API specifications.

## Testing

- **UI/UX Tests**: Open `test-ui-ux.html` in a browser
- **Gemini API Tests**: Run `node test-gemini-api.js`
- **SerpAPI Validation**: Open `validate-serpapi.html` in a browser

## Documentation

- `docs/design.md` - Complete architecture and design documentation
- `docs/requirements.md` - Feature requirements and acceptance criteria
- `docs/tasks.md` - Implementation tasks and progress tracking
- `INTEGRATION_GUIDE.md` - API integration and customization guide

## Technologies Used

- **Three.js** - 3D graphics and animations
- **Google Gemini API** - AI-powered responses
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies

## License

Part of the Space/Meteor project.
