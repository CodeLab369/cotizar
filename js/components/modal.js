/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Componente: Modal / Diálogos
 * @version 1.0.0
 */

import { generateId } from '../utils/helpers.js';

/**
 * Iconos SVG para los modales
 */
const ICONS = {
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    danger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

/**
 * Clase para gestionar modales de la aplicación
 */
class ModalManager {
    constructor() {
        this.modals = [];
        this.init();
    }

    /**
     * Inicializa event listeners globales
     */
    init() {
        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modals.length > 0) {
                const lastModal = this.modals[this.modals.length - 1];
                if (lastModal.closable) {
                    this.close(lastModal.id);
                }
            }
        });
    }

    /**
     * Abre un modal
     * @param {Object} options - Opciones del modal
     * @returns {string} ID del modal
     */
    open(options) {
        const {
            title = '',
            content = '',
            size = 'default', // sm, default, lg, xl, fullscreen
            closable = true,
            showHeader = true,
            showFooter = false,
            footerContent = '',
            onClose = null,
            className = ''
        } = options;

        const id = generateId();
        const overlay = this.createOverlay(id, closable);
        const modal = this.createModal(id, title, content, size, closable, showHeader, showFooter, footerContent, className);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Activar animación
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        this.modals.push({ id, overlay, closable, onClose });

        return id;
    }

    /**
     * Crea el overlay del modal
     */
    createOverlay(id, closable) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = `modal-overlay-${id}`;

        if (closable) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(id);
                }
            });
        }

        return overlay;
    }

    /**
     * Crea el modal
     */
    createModal(id, title, content, size, closable, showHeader, showFooter, footerContent, className) {
        const sizeClass = size !== 'default' ? `modal-${size}` : '';
        
        const modal = document.createElement('div');
        modal.className = `modal ${sizeClass} ${className}`.trim();
        modal.id = `modal-${id}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        let html = '';

        if (showHeader) {
            html += `
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${closable ? `
                        <button class="modal-close" aria-label="Cerrar modal">
                            ${ICONS.close}
                        </button>
                    ` : ''}
                </div>
            `;
        }

        html += `<div class="modal-body">${content}</div>`;

        if (showFooter) {
            html += `<div class="modal-footer">${footerContent}</div>`;
        }

        modal.innerHTML = html;

        // Event listener para cerrar
        if (closable && showHeader) {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn?.addEventListener('click', () => this.close(id));
        }

        return modal;
    }

    /**
     * Cierra un modal
     * @param {string} id - ID del modal
     */
    close(id) {
        const index = this.modals.findIndex(m => m.id === id);
        
        if (index === -1) return;

        const { overlay, onClose } = this.modals[index];
        
        // Animación de salida
        overlay.classList.remove('active');
        
        // Remover después de la animación
        setTimeout(() => {
            overlay.remove();
            this.modals.splice(index, 1);
            
            // Restaurar scroll si no hay más modales
            if (this.modals.length === 0) {
                document.body.style.overflow = '';
            }

            // Callback de cierre
            if (typeof onClose === 'function') {
                onClose();
            }
        }, 250);
    }

    /**
     * Cierra todos los modales
     */
    closeAll() {
        [...this.modals].forEach(m => this.close(m.id));
    }

    /**
     * Muestra un modal de confirmación
     * @param {Object} options - Opciones de confirmación
     * @returns {Promise<boolean>} Resuelve con true si confirma, false si cancela
     */
    confirm(options) {
        const {
            title = '¿Estás seguro?',
            message = '',
            type = 'warning', // warning, danger, success, info
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            confirmClass = 'btn-primary',
            dangerConfirm = false
        } = options;

        return new Promise((resolve) => {
            const id = generateId();
            const buttonClass = dangerConfirm ? 'btn-danger' : confirmClass;

            const content = `
                <div class="modal-confirm">
                    <div class="modal-icon icon-${type}">
                        ${ICONS[type] || ICONS.warning}
                    </div>
                    <h3 class="modal-title">${title}</h3>
                    <p class="modal-message">${message}</p>
                    <div class="modal-footer">
                        <button class="btn btn-ghost" id="modal-cancel-${id}">
                            ${cancelText}
                        </button>
                        <button class="btn ${buttonClass}" id="modal-confirm-${id}">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            const modalId = this.open({
                content,
                size: 'sm',
                showHeader: false,
                closable: true,
                onClose: () => resolve(false)
            });

            // Event listeners
            document.getElementById(`modal-cancel-${id}`)?.addEventListener('click', () => {
                this.close(modalId);
                resolve(false);
            });

            document.getElementById(`modal-confirm-${id}`)?.addEventListener('click', () => {
                this.close(modalId);
                resolve(true);
            });
        });
    }

    /**
     * Muestra un modal de alerta
     * @param {Object} options - Opciones de alerta
     * @returns {Promise<void>}
     */
    alert(options) {
        const {
            title = 'Información',
            message = '',
            type = 'info',
            buttonText = 'Aceptar'
        } = options;

        return new Promise((resolve) => {
            const id = generateId();

            const content = `
                <div class="modal-confirm">
                    <div class="modal-icon icon-${type}">
                        ${ICONS[type] || ICONS.info}
                    </div>
                    <h3 class="modal-title">${title}</h3>
                    <p class="modal-message">${message}</p>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="modal-ok-${id}">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            `;

            const modalId = this.open({
                content,
                size: 'sm',
                showHeader: false,
                closable: true,
                onClose: () => resolve()
            });

            document.getElementById(`modal-ok-${id}`)?.addEventListener('click', () => {
                this.close(modalId);
                resolve();
            });
        });
    }
}

// Crear instancia única (singleton)
const Modal = new ModalManager();

export default Modal;
