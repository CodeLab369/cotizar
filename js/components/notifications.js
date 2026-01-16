/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Componente: Sistema de Notificaciones
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';
import { generateId } from '../utils/helpers.js';

/**
 * Iconos SVG para las notificaciones
 */
const ICONS = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

/**
 * Clase para gestionar las notificaciones de la aplicación
 */
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.config = APP_CONFIG.notifications;
        this.init();
    }

    /**
     * Inicializa el contenedor de notificaciones
     */
    init() {
        // Crear contenedor si no existe
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            this.container.id = 'notifications-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Muestra una notificación
     * @param {Object} options - Opciones de la notificación
     * @returns {string} ID de la notificación
     */
    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = this.config.defaultDuration,
            closable = true,
            showProgress = true
        } = options;

        // Limitar número de notificaciones visibles
        while (this.notifications.length >= this.config.maxVisible) {
            this.close(this.notifications[0].id);
        }

        // Crear notificación
        const id = generateId();
        const notification = this.createNotification(id, type, title, message, closable, showProgress, duration);
        
        // Agregar al contenedor
        this.container.appendChild(notification);
        this.notifications.push({ id, element: notification, timeout: null });

        // Auto-cerrar después del tiempo
        if (duration > 0) {
            const notificationData = this.notifications.find(n => n.id === id);
            notificationData.timeout = setTimeout(() => {
                this.close(id);
            }, duration);
        }

        return id;
    }

    /**
     * Crea el elemento HTML de la notificación
     */
    createNotification(id, type, title, message, closable, showProgress, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.id = `notification-${id}`;
        notification.setAttribute('role', 'alert');

        let html = `
            <div class="notification-icon">
                ${ICONS[type] || ICONS.info}
            </div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                ${message ? `<p class="notification-message">${message}</p>` : ''}
            </div>
        `;

        if (closable) {
            html += `
                <button class="notification-close" aria-label="Cerrar notificación">
                    ${ICONS.close}
                </button>
            `;
        }

        if (showProgress && duration > 0) {
            html += `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>`;
        }

        notification.innerHTML = html;

        // Event listener para cerrar
        if (closable) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.close(id));
        }

        // Pausar progreso al hover
        if (showProgress && duration > 0) {
            notification.addEventListener('mouseenter', () => {
                const progress = notification.querySelector('.notification-progress');
                if (progress) {
                    progress.style.animationPlayState = 'paused';
                }
                const notificationData = this.notifications.find(n => n.id === id);
                if (notificationData?.timeout) {
                    clearTimeout(notificationData.timeout);
                }
            });

            notification.addEventListener('mouseleave', () => {
                const progress = notification.querySelector('.notification-progress');
                if (progress) {
                    progress.style.animationPlayState = 'running';
                }
                const notificationData = this.notifications.find(n => n.id === id);
                if (notificationData) {
                    // Reiniciar timeout con tiempo restante aproximado
                    notificationData.timeout = setTimeout(() => {
                        this.close(id);
                    }, 2000);
                }
            });
        }

        return notification;
    }

    /**
     * Cierra una notificación
     * @param {string} id - ID de la notificación
     */
    close(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        
        if (index === -1) return;

        const { element, timeout } = this.notifications[index];
        
        // Limpiar timeout
        if (timeout) {
            clearTimeout(timeout);
        }

        // Animación de salida
        element.classList.add('notification-exit');
        
        // Remover después de la animación
        setTimeout(() => {
            element.remove();
            this.notifications.splice(index, 1);
        }, 300);
    }

    /**
     * Cierra todas las notificaciones
     */
    closeAll() {
        [...this.notifications].forEach(n => this.close(n.id));
    }

    /**
     * Muestra una notificación de éxito
     */
    success(message, title = '¡Éxito!') {
        return this.show({ type: 'success', title, message });
    }

    /**
     * Muestra una notificación de error
     */
    error(message, title = 'Error') {
        return this.show({ type: 'error', title, message });
    }

    /**
     * Muestra una notificación de advertencia
     */
    warning(message, title = 'Advertencia') {
        return this.show({ type: 'warning', title, message });
    }

    /**
     * Muestra una notificación informativa
     */
    info(message, title = 'Información') {
        return this.show({ type: 'info', title, message });
    }
}

// Crear instancia única (singleton)
const Notifications = new NotificationManager();

export default Notifications;
