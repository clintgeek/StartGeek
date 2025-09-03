import React from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  Clipboard,
  Smartphone,
  Utensils,
  Activity,
  Cloud,
  Download,
  Tv,
  Film,
  ExternalLink
} from 'lucide-react'

const QuickLinks = () => {
  const links = [
    {
      icon: <Home className="w-5 h-5" />,
      url: "https://home.clintgeek.com",
      label: "Home",
      color: "hover:bg-blue-500/20"
    },
    {
      icon: <Clipboard className="w-5 h-5" />,
      url: "https://keep.google.com/u/0/#label/ToDo",
      label: "Tasks",
      color: "hover:bg-yellow-500/20"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      url: "https://messages.google.com/web/conversations",
      label: "Messages",
      color: "hover:bg-green-500/20"
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      url: "https://www.myfitnesspal.com/food/diary",
      label: "Nutrition",
      color: "hover:bg-orange-500/20"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      url: "https://connect.garmin.com/modern/",
      label: "Fitness",
      color: "hover:bg-red-500/20"
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      url: "https://www.meteoblue.com/en/weather/week/mansfield_united-states-of-america_4709013",
      label: "Weather",
      color: "hover:bg-cyan-500/20"
    },
    {
      icon: <Download className="w-5 h-5" />,
      url: "https://sab.clintgeek.com",
      label: "Downloads",
      color: "hover:bg-purple-500/20"
    },
    {
      icon: <Tv className="w-5 h-5" />,
      url: "https://sonarr.clintgeek.com",
      label: "TV Shows",
      color: "hover:bg-indigo-500/20"
    },
    {
      icon: <Film className="w-5 h-5" />,
      url: "https://radarr.clintgeek.com",
      label: "Movies",
      color: "hover:bg-pink-500/20"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
      className="flex flex-wrap justify-center gap-3 max-w-4xl"
    >
      {links.map((link, index) => (
        <motion.a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`glass rounded-xl p-3 flex items-center space-x-2 transition-all duration-200 ${link.color} group`}
        >
          <span className="text-white/80 group-hover:text-white transition-colors">
            {link.icon}
          </span>
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            {link.label}
          </span>
          <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white/60 transition-colors" />
        </motion.a>
      ))}
    </motion.div>
  )
}

export default QuickLinks