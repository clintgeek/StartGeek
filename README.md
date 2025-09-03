# StartGeek

A modern, React-based browser start page with intelligent search and beautiful backgrounds.

## ✨ Features

- 🕒 **Beautiful Clock Display** - Large, modern time display with timezone info
- 🌤️ **Weather Integration** - Real-time weather with location-based backgrounds (no API key required)
- 🔍 **Smart Search** - Google AI search integration with multiple search engines
- 🎨 **Dynamic Backgrounds** - Time-based background images from Unsplash
- 📱 **Responsive Design** - Works great on desktop and mobile
- ⚡ **Modern Tech Stack** - React, Tailwind CSS, Framer Motion
- 🚀 **Zero Configuration** - Works out of the box, no API keys needed!

## 🚀 Quick Start

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd StartGeek
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: `http://localhost:3000`

### Production (Docker)

1. **Build and run with Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: `http://localhost:3000`

## 🔧 Configuration

**No configuration needed!** StartGeek works completely out of the box with:

- **Weather**: Uses free Open-Meteo API (no API key required)
- **Search**: Uses Google AI search (no API key required)
- **Backgrounds**: Uses Unsplash (no API key required)
- **Location**: Auto-detects your location via IP

## 🔍 Smart Search Features

StartGeek includes an intelligent search system with:

- **Google AI Search** - Primary search uses Google's AI mode (`udm=50`)
- **Multiple Search Engines** - Google, YouTube, GitHub, Stack Overflow, Wikipedia, etc.
- **Keyboard Navigation** - Use `Ctrl+K` (or `Cmd+K`) to focus search
- **Smart Suggestions** - Type-ahead suggestions for engines and shortcuts

### Search Examples

- Type any question → Opens Google AI search
- `youtube: cats` → Search YouTube for cats
- `github: react` → Search GitHub for React
- `gmail` → Open Gmail
- `weather` → Search weather information

## 🎨 Customization

### Background Images
- Automatic time-based backgrounds from Unsplash
- Categories: sunrise, day, sunset, night
- Smooth transitions between time periods

### Weather Integration
- Location-based weather display
- 7-day forecast
- Weather-appropriate background themes
- Uses Open-Meteo API (completely free)

## 🏗️ Architecture

```
StartGeek/
├── src/
│   ├── components/         # React components
│   │   ├── BackgroundManager.jsx
│   │   ├── Clock.jsx
│   │   ├── CombinedWeather.jsx
│   │   └── SearchBox.jsx
│   ├── services/          # API services
│   │   └── weatherService.js
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── Dockerfile             # Docker configuration
└── docker-compose.yml     # Docker Compose setup
```

### Tech Stack

**Frontend:**
- React 18 with Hooks
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

**APIs (All Free):**
- Open-Meteo for weather data
- ipapi.co for location detection
- Google AI Search for intelligent search
- Unsplash for background images

## 🐳 Docker Deployment

Ultra-simple single-container deployment (no Dockerfile needed!):

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Service:**
- `startgeek` - React app served with Node.js (port 3000)

The Docker setup automatically:
1. Installs dependencies
2. Builds the React app
3. Serves it on port 3000

## 🔒 Security & Privacy

- **No API Keys Required** - Uses only free, public APIs
- **Client-Side Only** - No backend server or database
- **Privacy Focused** - Location detection via IP only
- **No Data Storage** - Everything runs in your browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Weather Not Loading**
   - Check browser console for errors
   - Ensure internet connection is working
   - Open-Meteo API is free and doesn't require keys

2. **Search Not Working**
   - Search functionality works entirely client-side
   - Check browser console for JavaScript errors
   - Ensure pop-up blockers aren't interfering

3. **Backgrounds Not Loading**
   - Check internet connection
   - Unsplash images load directly from their CDN

### Development Tips

- Use `npm run dev` for hot reloading
- Check browser console for errors
- All functionality is client-side, no backend needed

## 🔄 Updates

To update StartGeek:

```bash
git pull origin main
npm install

# Restart if using Docker
docker-compose down && docker-compose up -d
```

---

**StartGeek v2.0.0** - Simplified, fast, and zero-configuration start page.