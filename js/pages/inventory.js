/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Inventario (En desarrollo)
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';

/**
 * Iconos SVG
 */
const ICONS = {
    box: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
};

/**
 * Clase para la página de Inventario
 */
class InventoryPage {
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
                    <h1 class="page-title">Inventario</h1>
                    <p class="page-description">Gestiona el inventario de baterías</p>
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

export default InventoryPage;
