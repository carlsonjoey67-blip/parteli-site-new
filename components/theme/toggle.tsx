"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure component is mounted on client to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
    >
      {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  )
}