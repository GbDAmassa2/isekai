// Modal Management System
class ModalManager {
  private static instance: ModalManager
  private currentModal: HTMLElement | null = null
  private modalStack: HTMLElement[] = []

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager()
    }
    return ModalManager.instance
  }

  // Criar modal dinamicamente
  createModal(options: {
    title: string
    icon?: string
    contentHtml: string
    footerHtml?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    className?: string
  }): HTMLElement {
    const {
      title,
      icon = '',
      contentHtml,
      footerHtml = '',
      size = 'lg',
      className = ''
    } = options

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-7xl'
    }

    // Criar estrutura HTML do modal
    const modalHtml = `
      <div class="modal-overlay" data-modal-overlay>
        <div class="modal-container ${sizeClasses[size]} ${className}" data-modal-container>
          <div class="modal-header">
            <div class="flex items-center gap-3">
              ${icon ? `<span class="text-2xl">${icon}</span>` : ''}
              <h3 class="text-xl font-bold text-amber-200 font-serif">${title}</h3>
            </div>
            <button class="modal-close-btn" data-modal-close aria-label="Fechar modal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            ${contentHtml}
          </div>
          ${footerHtml ? `
            <div class="modal-footer">
              ${footerHtml}
            </div>
          ` : ''}
        </div>
      </div>
    `

    // Criar elemento DOM
    const modalElement = document.createElement('div')
    modalElement.innerHTML = modalHtml
    const modal = modalElement.firstElementChild as HTMLElement

    // Adicionar event listeners
    this.addEventListeners(modal)

    return modal
  }

  // Abrir modal
  openModal(options: {
    title: string
    icon?: string
    contentHtml: string
    footerHtml?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    className?: string
  }): void {
    // Fechar modal atual se existir
    if (this.currentModal) {
      this.closeModal()
    }

    // Criar novo modal
    const modal = this.createModal(options)
    
    // Adicionar ao DOM
    document.body.appendChild(modal)
    
    // Adicionar à stack
    this.modalStack.push(modal)
    this.currentModal = modal

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden'

    // Adicionar listener para tecla Escape
    document.addEventListener('keydown', this.handleEscapeKey.bind(this))

    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('modal-open')
    })
  }

  // Fechar modal
  closeModal(): void {
    if (!this.currentModal) return

    // Remover da stack
    const modalIndex = this.modalStack.indexOf(this.currentModal)
    if (modalIndex > -1) {
      this.modalStack.splice(modalIndex, 1)
    }

    // Remover do DOM
    this.currentModal.remove()
    
    // Atualizar modal atual
    this.currentModal = this.modalStack.length > 0 
      ? this.modalStack[this.modalStack.length - 1] 
      : null

    // Restaurar scroll do body se não há mais modais
    if (this.modalStack.length === 0) {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', this.handleEscapeKey.bind(this))
    }
  }

  // Fechar todos os modais
  closeAllModals(): void {
    while (this.modalStack.length > 0) {
      this.closeModal()
    }
  }

  // Adicionar event listeners
  private addEventListeners(modal: HTMLElement): void {
    // Fechar ao clicar no overlay
    const overlay = modal.querySelector('[data-modal-overlay]') as HTMLElement
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal()
      }
    })

    // Fechar ao clicar no botão de fechar
    const closeBtn = modal.querySelector('[data-modal-close]') as HTMLElement
    closeBtn?.addEventListener('click', () => {
      this.closeModal()
    })
  }

  // Handler para tecla Escape
  private handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.currentModal) {
      this.closeModal()
    }
  }

  // Verificar se há modal aberto
  isModalOpen(): boolean {
    return this.modalStack.length > 0
  }

  // Obter modal atual
  getCurrentModal(): HTMLElement | null {
    return this.currentModal
  }
}

// Instância global
export const modalManager = ModalManager.getInstance()

// Funções de conveniência
export const openModal = (options: Parameters<typeof modalManager.openModal>[0]) => {
  modalManager.openModal(options)
}

export const closeModal = () => {
  modalManager.closeModal()
}

export const closeAllModals = () => {
  modalManager.closeAllModals()
}

// Utilitários para criar conteúdo HTML
export const createAttributeSection = (attributes: Record<string, number>) => {
  return `
    <div class="modal-section">
      <h4 class="text-lg font-semibold text-amber-200 mb-3 font-serif flex items-center gap-2">
        <span class="text-xl">⭐</span>
        Atributos Primários
      </h4>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        ${Object.entries(attributes).map(([key, value]) => `
          <div class="modal-card">
            <div class="text-4xl mb-2">
              ${key === "strength" ? "⚔️" : 
                key === "agility" ? "⚡" : 
                key === "intelligence" ? "🔮" : 
                key === "vitality" ? "❤️" : 
                key === "luck" ? "🍀" : "✨"}
            </div>
            <div class="text-sm font-semibold mb-1 capitalize">${key}</div>
            <div class="text-xl font-bold text-white">${value}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

export const createMangaList = (mangas: Array<{id: string, title: string, episodes: number, currentEpisode: number}>) => {
  return `
    <div class="modal-section">
      <h4 class="text-lg font-semibold text-amber-200 mb-3 font-serif flex items-center gap-2">
        <span class="text-xl">📚</span>
        Biblioteca de Mangás
      </h4>
      <div class="space-y-3">
        ${mangas.map(manga => `
          <div class="flex items-center justify-between p-4 bg-slate-600/30 rounded-lg border border-amber-500/20">
            <div class="flex-1">
              <h5 class="text-amber-200 font-semibold">${manga.title}</h5>
              <p class="text-sm text-amber-300/80">Episódio ${manga.currentEpisode} de ${manga.episodes}</p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded">
                Editar
              </button>
              <button class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
                Excluir
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

export const createActionFooter = (buttons: Array<{text: string, onClick: string, variant?: 'primary' | 'secondary' | 'danger'}>) => {
  return buttons.map(button => {
    const variantClasses = {
      primary: 'bg-amber-600 hover:bg-amber-700 text-white',
      secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    }
    
    return `
      <button 
        class="px-4 py-2 rounded-lg font-medium transition-colors ${variantClasses[button.variant || 'primary']}"
        onclick="${button.onClick}"
      >
        ${button.text}
      </button>
    `
  }).join('')
}
