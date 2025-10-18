import React, { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  size = 'lg',
  className = ''
}: ModalProps) {
  const isMobile = useIsMobile()
  // Fechar modal com tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Não renderizar se não estiver aberto
  if (!isOpen) return null

  const sizeClasses = {
    sm: isMobile ? 'max-w-full' : 'max-w-md',
    md: isMobile ? 'max-w-full' : 'max-w-2xl',
    lg: isMobile ? 'max-w-full' : 'max-w-4xl',
    xl: isMobile ? 'max-w-full' : 'max-w-6xl',
    full: 'max-w-full'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-container ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {icon && <span className={`${isMobile ? 'text-xl' : 'text-2xl'} flex-shrink-0`}>{icon}</span>}
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-amber-200 font-serif truncate`}>{title}</h3>
          </div>
          <button 
            className={`modal-close-btn ${isMobile ? 'w-8 h-8 ml-2 flex-shrink-0' : ''}`}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para seções dentro do modal
interface ModalSectionProps {
  title: string
  icon?: string
  children: React.ReactNode
  className?: string
}

export function ModalSection({ 
  title, 
  icon, 
  children, 
  className = '' 
}: ModalSectionProps) {
  return (
    <div className={`modal-section ${className}`}>
      <h4 className="text-lg font-semibold text-amber-200 mb-3 font-serif flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h4>
      {children}
    </div>
  )
}

// Componente para grids responsivos
interface ModalGridProps {
  children: React.ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ModalGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  gap = 'md',
  className = ''
}: ModalGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  const gridClasses = `
    grid 
    grid-cols-${columns.mobile || 1}
    ${columns.tablet ? `sm:grid-cols-${columns.tablet}` : ''}
    ${columns.desktop ? `md:grid-cols-${columns.desktop}` : ''}
    ${columns.xl ? `lg:grid-cols-${columns.xl}` : ''}
    ${gapClasses[gap]}
    ${className}
  `

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Componente para cards de atributos
interface ModalCardProps {
  icon: string
  title: string
  value: string | number
  description?: string
  color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'gray'
  onClick?: () => void
  className?: string
}

export function ModalCard({
  icon,
  title,
  value,
  description,
  color = 'gray',
  onClick,
  className = ''
}: ModalCardProps) {
  const colorClasses = {
    red: 'bg-red-500/20 border-red-500/30 shadow-red-500/10 text-red-300',
    blue: 'bg-blue-500/20 border-blue-500/30 shadow-blue-500/10 text-blue-300',
    green: 'bg-green-500/20 border-green-500/30 shadow-green-500/10 text-green-300',
    purple: 'bg-purple-500/20 border-purple-500/30 shadow-purple-500/10 text-purple-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 shadow-yellow-500/10 text-yellow-300',
    gray: 'bg-slate-500/20 border-slate-500/30 shadow-slate-500/10 text-slate-300'
  }

  return (
    <div 
      className={`
        modal-card
        ${colorClasses[color]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      {description && (
        <div className="text-xs opacity-80">{description}</div>
      )}
    </div>
  )
}
