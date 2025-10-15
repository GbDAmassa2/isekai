import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalPadraoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  icon?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const sizeClasses = {
  sm: 'w-[90vw] max-w-md max-h-[80vh]',
  md: 'w-[90vw] max-w-2xl max-h-[85vh]',
  lg: 'w-[90vw] max-w-4xl max-h-[85vh]',
  xl: 'w-[90vw] max-w-6xl max-h-[85vh]',
  full: 'w-[95vw] max-w-7xl max-h-[90vh]'
}

export function ModalPadrao({
  open,
  onOpenChange,
  title,
  subtitle,
  icon,
  children,
  size = 'lg',
  className = ''
}: ModalPadraoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`
          ${sizeClasses[size]} 
          overflow-y-auto 
          bg-gradient-to-br 
          from-slate-800 
          via-purple-800 
          to-indigo-800 
          border-2 
          border-amber-500/30 
          shadow-2xl 
          shadow-purple-500/20
          ${className}
        `}
      >
        <DialogHeader>
          <DialogTitle className="text-amber-200 font-serif text-2xl flex items-center gap-2">
            {icon && <span className="text-3xl">{icon}</span>}
            {title}
          </DialogTitle>
          {subtitle && (
            <p className="text-amber-300/80 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para seções dentro do modal
interface SecaoModalProps {
  titulo: string
  icone?: string
  children: React.ReactNode
  className?: string
}

export function SecaoModal({ 
  titulo, 
  icone, 
  children, 
  className = '' 
}: SecaoModalProps) {
  return (
    <div className={`bg-slate-700/50 rounded-lg p-6 border border-amber-500/30 shadow-lg shadow-purple-500/10 ${className}`}>
      <h3 className="text-xl font-bold text-amber-200 mb-4 font-serif flex items-center gap-2">
        {icone && <span className="text-2xl">{icone}</span>}
        {titulo}
      </h3>
      {children}
    </div>
  )
}

// Componente para grids responsivos
interface GridResponsivoProps {
  children: React.ReactNode
  colunas?: {
    mobile?: number
    tablet?: number
    desktop?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function GridResponsivo({ 
  children, 
  colunas = { mobile: 1, tablet: 2, desktop: 3, xl: 4 },
  gap = 'md',
  className = ''
}: GridResponsivoProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  const gridClasses = `
    grid 
    grid-cols-${colunas.mobile || 1}
    ${colunas.tablet ? `sm:grid-cols-${colunas.tablet}` : ''}
    ${colunas.desktop ? `md:grid-cols-${colunas.desktop}` : ''}
    ${colunas.xl ? `lg:grid-cols-${colunas.xl}` : ''}
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
interface CardAtributoProps {
  icone: string
  titulo: string
  valor: string | number
  descricao?: string
  cor?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'gray'
  onClick?: () => void
  className?: string
}

export function CardAtributo({
  icone,
  titulo,
  valor,
  descricao,
  cor = 'gray',
  onClick,
  className = ''
}: CardAtributoProps) {
  const corClasses = {
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
        flex items-center gap-3 p-4 rounded-lg border shadow-lg hover:scale-105 transition-all duration-300
        ${corClasses[cor]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="text-3xl">{icone}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{titulo}</div>
        <div className="text-xl font-bold text-white">{valor}</div>
        {descricao && (
          <div className="text-xs opacity-80 mt-1">{descricao}</div>
        )}
      </div>
    </div>
  )
}
