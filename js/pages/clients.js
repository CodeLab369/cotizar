/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Clientes (En desarrollo)
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';

/**
 * Iconos SVG
 */
const ICONS = {
    users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
};

/**
 * Clase para la página de Clientes
 */
class ClientsPage {
    constructor() {
        this.container = null;
    }

    /**
     * Renderiza la página
     * @param {HTMLElement} container - Contenedor
     */
    render(container) {
        this.container = container;

        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Clientes</h1>
                    <p class="page-description">Gestiona la información de tus clientes</p>
                </div>
            </div>
            
            <div class="page-development">
                <div class="page-development-icon">
                    ${ICONS.tool}
                </div>
                <h2 class="page-development-title">${APP_CONFIG.messages.development.title}</h2>
                <p class="page-development-subtitle">${APP_CONFIG.messages.development.subtitle}</p>
                <p class="page-development-text">${APP_CONFIG.messages.development.text}</p>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Destruye la página
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default ClientsPage;
