"use client"

import { useState, useEffect, useCallback } from "react"
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
  duration = 4000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    if (isClosing) return // Prevenir múltiplos cliques
    setIsClosing(true)
    setTimeout(() => {
      onClose(id)
    }, 200) // Reduzido de 300ms para 200ms
  }, [id, onClose, isClosing])

  useEffect(() => {
    // Animação de entrada mais rápida
    const enterTimer = setTimeout(() => {
      setIsVisible(true)
    }, 50) // Reduzido de 100ms para 50ms

    // Auto-close
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(autoCloseTimer)
    }
  }, [duration, handleClose])

  const getIcon = () => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-400`} />
      case "error":
        return <XCircle className={`${iconClass} text-red-400`} />
      case "warning":
        return <AlertCircle className={`${iconClass} text-yellow-400`} />
      case "info":
        return <Info className={`${iconClass} text-blue-400`} />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-900/90 border-green-500/50 text-green-100"
      case "error":
        return "bg-red-900/90 border-red-500/50 text-red-100"
      case "warning":
        return "bg-yellow-900/90 border-yellow-500/50 text-yellow-100"
      case "info":
        return "bg-blue-900/90 border-blue-500/50 text-blue-100"
    }
  }

  return (
    <div
      className={`
        relative w-full backdrop-blur-sm border rounded-lg shadow-lg p-3 md:p-4
        ${getColors()}
        transition-all duration-300 ease-out transform
        ${isClosing 
          ? 'translate-x-full opacity-0 scale-95' 
          : isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          {description && (
            <p className="text-xs mt-1 opacity-90">{description}</p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200 rounded p-1 hover:bg-black/10"
        >
          <X className="w-4 h-4" />
        </button>
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
  // Limitar a exibição para máximo 3 notificações (pegar as mais recentes)
  const displayNotifications = notifications.slice(-3)
  
  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 space-y-2 max-w-[calc(100vw-1rem)] md:max-w-sm">
      {displayNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="transform transition-transform duration-200 ease-out"
          style={{ 
            transform: `translateY(${index * 8}px)`,
            zIndex: 50 - index
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
