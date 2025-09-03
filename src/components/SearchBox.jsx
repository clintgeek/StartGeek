import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

const SearchBox = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Search engines and shortcuts
  const searchEngines = {
    google: { name: 'Google', url: 'https://www.google.com/search?q=', icon: '🔍' },
    ai: { name: 'Google AI', url: 'https://www.google.com/search?udm=50&q=', icon: '🤖' },
    youtube: { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', icon: '📺' },
    github: { name: 'GitHub', url: 'https://github.com/search?q=', icon: '🐙' },
    stackoverflow: { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=', icon: '📚' },
    wikipedia: { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search=', icon: '📖' },
    reddit: { name: 'Reddit', url: 'https://www.reddit.com/search/?q=', icon: '🤖' },
    twitter: { name: 'Twitter', url: 'https://twitter.com/search?q=', icon: '🐦' },
    amazon: { name: 'Amazon', url: 'https://www.amazon.com/s?k=', icon: '📦' },
    maps: { name: 'Google Maps', url: 'https://www.google.com/maps/search/', icon: '🗺️' },
    images: { name: 'Google Images', url: 'https://www.google.com/search?tbm=isch&q=', icon: '🖼️' }
  }

  // Quick shortcuts
  const shortcuts = [
    { key: 'gmail', url: 'https://gmail.com', name: 'Gmail', icon: '📧' },
    { key: 'calendar', url: 'https://calendar.google.com', name: 'Calendar', icon: '📅' },
    { key: 'drive', url: 'https://drive.google.com', name: 'Google Drive', icon: '💾' },
    { key: 'netflix', url: 'https://netflix.com', name: 'Netflix', icon: '🎬' },
    { key: 'spotify', url: 'https://spotify.com', name: 'Spotify', icon: '🎵' },
    { key: 'news', url: 'https://news.google.com', name: 'Google News', icon: '📰' }
  ]

  useEffect(() => {
    // Focus search box on page load with delay to ensure animations complete
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 1200) // Wait for animations to complete (0.6s delay + 0.6s duration)

    // Global keyboard shortcut (Ctrl/Cmd + K)
    const handleGlobalKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown)

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleGlobalKeydown)
    }
  }, [])

  const generateSuggestions = (input) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }

    const suggestions = []

    // Check for search engine prefixes
    const lowerInput = input.toLowerCase()
    Object.entries(searchEngines).forEach(([key, engine]) => {
      if (key.startsWith(lowerInput) || engine.name.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          type: 'engine',
          key,
          text: `Search ${engine.name}`,
          icon: engine.icon,
          action: () => handleSearch(input.replace(new RegExp(`^${key}:?\\s*`, 'i'), ''), key)
        })
      }
    })

    // Check for shortcuts
    shortcuts.forEach(shortcut => {
      if (shortcut.key.includes(lowerInput) || shortcut.name.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          type: 'shortcut',
          key: shortcut.key,
          text: `Go to ${shortcut.name}`,
          icon: shortcut.icon,
          action: () => window.open(shortcut.url, '_blank')
        })
      }
    })

    // Default search suggestions
    if (input.trim() && suggestions.length < 5) {
      suggestions.unshift({
        type: 'search',
        key: 'ai-default',
        text: `Ask Google AI about "${input}"`,
        icon: '🤖',
        action: () => handleSearch(input, 'ai')
      }, {
        type: 'search',
        key: 'google-default',
        text: `Search Google for "${input}"`,
        icon: '🔍',
        action: () => handleSearch(input, 'google')
      })
    }

    setSuggestions(suggestions.slice(0, 8))
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    generateSuggestions(value)
    setShowSuggestions(true)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query, 'ai')
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          suggestions[selectedIndex].action()
        } else {
          handleSearch(query, 'ai')
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSearch = (searchQuery, engine = 'google') => {
    if (!searchQuery.trim()) return

    const searchEngine = searchEngines[engine] || searchEngines.google
    const searchUrl = searchEngine.url + encodeURIComponent(searchQuery.trim())

    window.open(searchUrl, '_blank')
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)

    toast.success(`Searching ${searchEngine.name}...`)
  }

  const handleSuggestionClick = (suggestion) => {
    suggestion.action()
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    if (query.trim()) {
      generateSuggestions(query)
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div className="relative w-full max-w-7xl">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Ask AI anything or search... (Ctrl+K)"
          className="w-full px-6 py-4 text-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
        />

        {/* Search Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.key}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center space-x-3 ${
                index === selectedIndex
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{suggestion.icon}</span>
              <span className="flex-1">{suggestion.text}</span>
              {suggestion.type === 'engine' && (
                <span className="text-xs text-white/50">Search</span>
              )}
              {suggestion.type === 'shortcut' && (
                <span className="text-xs text-white/50">Go to</span>
              )}
            </div>
          ))}
        </div>
      )}


    </div>
  )
}

export default SearchBox