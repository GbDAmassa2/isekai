"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

interface NotificationProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

export function AnimatedNotification({ 
  id, 
  type, 
  title, 
  description, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto-close
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoCloseTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400 animate-pulse" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400 animate-pulse" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400 animate-spin" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-900/80 border-green-500/30 text-green-100"
      case "error":
        return "bg-red-900/80 border-red-500/30 text-red-100"
      case "warning":
        return "bg-yellow-900/80 border-yellow-500/30 text-yellow-100"
      case "info":
        return "bg-blue-900/80 border-blue-500/30 text-blue-100"
    }
  }

  return (
    <div
      className={`w-full bg-slate-800/90 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl shadow-purple-500/20 p-3 md:p-4 transition-all duration-500 ease-out ${
        isClosing 
          ? 'translate-x-full opacity-0 scale-95 rotate-3' 
          : isVisible 
            ? 'translate-x-0 opacity-100 scale-100 rotate-0' 
            : 'translate-x-full opacity-0 scale-95 rotate-3'
      }`}
    >
      {/* Efeito de brilho pulsante */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent rounded-lg animate-pulse" />
      
      {/* Efeito de energia */}
      <div className="absolute inset-0 border border-amber-400/20 rounded-lg pointer-events-none" style={{
        background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)'
      }} />
      
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xs md:text-sm font-bold text-amber-200 font-serif">{title}</h4>
          {description && (
            <p className="text-xs text-amber-300/80 font-serif mt-1">{description}</p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-amber-400/60 hover:text-amber-300 hover:scale-110 transition-all duration-200 hover:bg-amber-500/10 rounded p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Barra de progresso animada */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-700 rounded-b-lg w-full">
        <div className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-b-lg animate-pulse" style={{
          animationDuration: `${duration}ms`,
          animationTimingFunction: 'linear'
        }} />
      </div>
    </div>
  )
}

interface NotificationManagerProps {
  notifications: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    description?: string
    duration?: number
  }>
  onRemove: (id: string) => void
}

export function NotificationManager({ notifications, onRemove }: NotificationManagerProps) {
  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 space-y-2 md:space-y-3 max-w-[calc(100vw-1rem)] md:max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="transition-all duration-300 ease-out"
          style={{ 
            transform: `translateY(${index * 12}px) scale(${1 - index * 0.05})`,
            zIndex: 50 - index,
            opacity: 1 - index * 0.1
          }}
        >
          <AnimatedNotification
            {...notification}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>
  )
}
