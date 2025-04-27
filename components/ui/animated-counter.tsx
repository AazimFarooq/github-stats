"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
}

export function AnimatedCounter({ value, duration = 1000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(percentage)

      setCount(Math.floor(easedProgress * value))

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(updateCount)
      }
    }

    animationFrameId = requestAnimationFrame(updateCount)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}
