/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Componente: Sidebar / Menú lateral
 * @version 1.0.0
 */

import { isMobile } from '../utils/helpers.js';

/**
 * Iconos SVG para el sidebar
 */
export const SIDEBAR_ICONS = {
    inventory: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    quotations: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    clients: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    quoter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
};

/**
 * Clase para gestionar el sidebar
 */
class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.toggleBtn = null;
        this.isOpen = false;
        this.isCollapsed = false;
        this.activeItem = null;
        this.onNavigate = null;
    }

    /**
     * Inicializa el sidebar
     * @param {Function} onNavigate - Callback cuando se navega
     */
    init(onNavigate) {
        this.onNavigate = onNavigate;
        this.render();
        this.bindEvents();
    }

    /**
     * Renderiza el sidebar
     */
    render() {
        // Crear sidebar
        this.sidebar = document.createElement('aside');
        this.sidebar.className = 'sidebar';
        this.sidebar.id = 'sidebar';

        this.sidebar.innerHTML = `
            <div class="sidebar-header">
                <a href="#" class="sidebar-logo">
                    <div class="sidebar-logo-icon">NM</div>
                    <div class="sidebar-logo-text">
                        <span class="sidebar-logo-name">NICMAT</span>
                        <span class="sidebar-logo-subtitle">Sistema de Cotización</span>
                    </div>
                </a>
            </div>
            
            <nav class="sidebar-nav">
                <ul class="sidebar-menu">
                    <li class="sidebar-menu-label">Menú Principal</li>
                    
                    <li>
                        <a href="#" class="sidebar-menu-item" data-page="inventory" data-tooltip="Inventario">
                            <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.inventory}</span>
                            <span class="sidebar-menu-item-text">Inventario</span>
                        </a>
                    </li>
                    
                    <li>
                        <a href="#" class="sidebar-menu-item" data-page="quotations" data-tooltip="Cotizaciones">
                            <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.quotations}</span>
                            <span class="sidebar-menu-item-text">Cotizaciones</span>
                        </a>
                    </li>
                    
                    <li>
                        <a href="#" class="sidebar-menu-item" data-page="clients" data-tooltip="Ventas">
                            <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.clients}</span>
                            <span class="sidebar-menu-item-text">Ventas</span>
                        </a>
                    </li>
                    
                    <li>
                        <a href="#" class="sidebar-menu-item" data-page="quoter" data-tooltip="Tiendas">
                            <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.quoter}</span>
                            <span class="sidebar-menu-item-text">Tiendas</span>
                        </a>
                    </li>
                    
                    <li class="sidebar-menu-label" style="margin-top: auto; padding-top: var(--spacing-lg);">Sistema</li>
                    
                    <li>
                        <a href="#" class="sidebar-menu-item" data-page="settings" data-tooltip="Configuraciones">
                            <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.settings}</span>
                            <span class="sidebar-menu-item-text">Configuraciones</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
            <div class="sidebar-footer">
                <a href="#" class="sidebar-menu-item" id="sidebar-logout" data-tooltip="Cerrar Sesión">
                    <span class="sidebar-menu-item-icon">${SIDEBAR_ICONS.logout}</span>
                    <span class="sidebar-menu-item-text">Cerrar Sesión</span>
                </a>
            </div>
        `;

        // Crear overlay para móvil
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        this.overlay.id = 'sidebar-overlay';

        // Crear botón toggle
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'sidebar-toggle';
        this.toggleBtn.id = 'sidebar-toggle';
        this.toggleBtn.innerHTML = SIDEBAR_ICONS.menu;
        this.toggleBtn.setAttribute('aria-label', 'Abrir menú');

        // Agregar al DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.sidebar);
        document.body.appendChild(this.toggleBtn);
    }

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Click en items del menú
        const menuItems = this.sidebar.querySelectorAll('.sidebar-menu-item[data-page]');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.setActive(page);
                
                if (typeof this.onNavigate === 'function') {
                    this.onNavigate(page);
                }

                // Cerrar en móvil
                if (isMobile()) {
                    this.closeMobile();
                }
            });
        });

        // Click en logout
        const logoutBtn = this.sidebar.querySelector('#sidebar-logout');
        logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof this.onNavigate === 'function') {
                this.onNavigate('logout');
            }
        });

        // Toggle en móvil
        this.toggleBtn?.addEventListener('click', () => {
            this.toggleMobile();
        });

        // Click en overlay para cerrar
        this.overlay?.addEventListener('click', () => {
            this.closeMobile();
        });

        // Cerrar en resize
        window.addEventListener('resize', () => {
            if (!isMobile() && this.isOpen) {
                this.closeMobile();
            }
        });
    }

    /**
     * Establece el item activo
     * @param {string} page - Página activa
     */
    setActive(page) {
        const items = this.sidebar.querySelectorAll('.sidebar-menu-item');
        items.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        this.activeItem = page;
    }

    /**
     * Abre el sidebar en móvil
     */
    openMobile() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
        this.toggleBtn.innerHTML = SIDEBAR_ICONS.close;
        this.isOpen = true;
    }

    /**
     * Cierra el sidebar en móvil
     */
    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        this.toggleBtn.innerHTML = SIDEBAR_ICONS.menu;
        this.isOpen = false;
    }

    /**
     * Toggle del sidebar en móvil
     */
    toggleMobile() {
        if (this.isOpen) {
            this.closeMobile();
        } else {
            this.openMobile();
        }
    }

    /**
     * Muestra el sidebar
     */
    show() {
        this.sidebar?.classList.remove('hidden');
        this.toggleBtn?.classList.remove('hidden');
    }

    /**
     * Oculta el sidebar
     */
    hide() {
        this.sidebar?.classList.add('hidden');
        this.toggleBtn?.classList.add('hidden');
        this.overlay?.classList.remove('active');
    }

    /**
     * Destruye el sidebar
     */
    destroy() {
        this.sidebar?.remove();
        this.overlay?.remove();
        this.toggleBtn?.remove();
    }
}

// Crear instancia única
const Sidebar = new SidebarManager();

export default Sidebar;
