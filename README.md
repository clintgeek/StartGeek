# StartGeek

A modern, React-based browser start page with server monitoring, intelligent search, and beautiful backgrounds.

## Features

- 🕒 **Beautiful Clock Display** - Large, modern time display with timezone info
- 🌤️ **Weather Integration** - Real-time weather with location-based backgrounds
- 🔍 **Smart Search** - Google AI search integration with multiple search engines
- 📊 **Server Monitoring** - Monitor local services and Docker containers
- 🎨 **Dynamic Backgrounds** - Time-based background images from Unsplash
- 📱 **Responsive Design** - Works great on desktop and mobile
- ⚡ **Modern Tech Stack** - React, TypeScript, Tailwind CSS, Framer Motion

## Quick Start

### Development

1. **Clone and install dependencies:**
   ```bash
   cd /Users/ccrocker/projects/StartGeek
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Production (Docker)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   Navigate to `http://localhost:8828` (same port as original StartGeekTemp)

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend Services
- **MongoDB** for data storage
- **Redis** for caching and sessions
- **BaseGeek aiGeek** for AI assistance

### Pages
- **Home** - Minimal start page with clock, weather, and quick links
- **Dashboard** - System stats and performance monitoring
- **Monitoring** - Server health checks and service status
- **Settings** - Customization options

## Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `WEATHER_API_KEY` - OpenWeatherMap API key for weather data
- `BASEGEEK_API_URL` - BaseGeek API endpoint for AI features
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string

### Customization

#### Quick Links
Edit `src/components/QuickLinks.tsx` to customize your shortcuts.

#### Monitored Services
Add services to monitor in `src/pages/MonitoringPage.tsx` or via the settings page.

#### Weather Location
Change default location in settings or via environment variables.

## Integration with BaseGeek

StartGeek integrates with your existing BaseGeek aiGeek system:

1. **AI Chat Widget** - Provides intelligent assistance
2. **System Monitoring** - Leverages BaseGeek's monitoring capabilities
3. **User Management** - Can integrate with BaseGeek's auth system

## Docker Deployment

The application includes a complete Docker setup:

- **Multi-stage build** for optimized production images
- **Nginx** for serving static files
- **MongoDB & Redis** for data persistence
- **Same port (8828)** as original StartGeekTemp for easy replacement

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Original StartGeekTemp for inspiration
- Unsplash for beautiful background images
- BaseGeek ecosystem for AI and backend services