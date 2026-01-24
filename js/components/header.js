/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Componente: Header / Cabecera
 * @version 1.0.0
 */

import { getInitials } from '../utils/helpers.js';
import Profile from './profile.js';

/**
 * Iconos SVG para el header
 */
const HEADER_ICONS = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
};

/**
 * Clase para gestionar el header
 */
class HeaderManager {
    constructor() {
        this.header = null;
        this.currentTitle = '';
        this.user = null;
        this.onLogout = null;
        this.onNavigate = null;
    }

    /**
     * Inicializa el header
     * @param {Object} options - Opciones de configuración
     */
    init(options = {}) {
        const { user, onLogout, onNavigate } = options;
        this.user = user || { name: 'Usuario', role: 'Administrador' };
        this.onLogout = onLogout;
        this.onNavigate = onNavigate;
        this.render();
        this.bindEvents();
    }

    /**
     * Renderiza el header
     */
    render() {
        this.header = document.createElement('header');
        this.header.className = 'header';
        this.header.id = 'header';

        const initials = getInitials(this.user.name);

        this.header.innerHTML = `
            <div class="header-left">
                <h1 class="header-title" id="page-title">Dashboard</h1>
            </div>
            
            <div class="header-right">
                <div class="header-actions">
                    <button class="header-action-btn" title="Notificaciones">
                        ${HEADER_ICONS.bell}
                    </button>
                </div>
                
                <div class="header-user" id="header-user">
                    <div class="header-user-avatar">${initials}</div>
                    <div class="header-user-info">
                        <span class="header-user-name">${this.user.name}</span>
                        <span class="header-user-role">${this.user.role}</span>
                    </div>
                    <span class="header-user-dropdown-icon">${HEADER_ICONS.chevronDown}</span>
                    
                    <div class="header-dropdown" id="header-dropdown">
                        <a href="#" class="header-dropdown-item" data-action="profile">
                            ${HEADER_ICONS.user}
                            <span>Mi Perfil</span>
                        </a>
                        <a href="#" class="header-dropdown-item" data-action="settings">
                            ${HEADER_ICONS.settings}
                            <span>Configuraciones</span>
                        </a>
                        <div class="header-dropdown-divider"></div>
                        <a href="#" class="header-dropdown-item danger" data-action="logout">
                            ${HEADER_ICONS.logout}
                            <span>Cerrar Sesión</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Toggle dropdown del usuario
        const userBtn = this.header.querySelector('#header-user');
        
        userBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            userBtn.classList.toggle('active');
        });

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', () => {
            userBtn?.classList.remove('active');
        });

        // Acciones del dropdown
        const dropdownItems = this.header.querySelectorAll('.header-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.dataset.action;
                
                if (action === 'logout' && typeof this.onLogout === 'function') {
                    this.onLogout();
                } else if (action === 'settings' && typeof this.onNavigate === 'function') {
                    this.onNavigate('settings');
                } else if (action === 'profile') {
                    this.openProfile();
                }
                
                userBtn?.classList.remove('active');
            });
        });
    }

    /**
     * Establece el título de la página
     * @param {string} title - Título de la página
     */
    setTitle(title) {
        const titleEl = this.header.querySelector('#page-title');
        if (titleEl) {
            titleEl.textContent = title;
            this.currentTitle = title;
        }
    }

    /**
     * Abre el modal de perfil
     */
    openProfile() {
        Profile.open((updatedUser) => {
            // Actualizar header cuando se modifica el perfil
            this.updateUser(updatedUser);
        });
    }

    /**
     * Actualiza la información del usuario
     * @param {Object} user - Datos del usuario
     */
    updateUser(user) {
        this.user = user;
        const avatar = this.header.querySelector('.header-user-avatar');
        const name = this.header.querySelector('.header-user-name');
        const role = this.header.querySelector('.header-user-role');

        if (avatar) avatar.textContent = getInitials(user.name);
        if (name) name.textContent = user.name;
        if (role) role.textContent = user.role;
    }

    /**
     * Obtiene el elemento del header
     * @returns {HTMLElement}
     */
    getElement() {
        return this.header;
    }

    /**
     * Muestra el header
     */
    show() {
        this.header?.classList.remove('hidden');
    }

    /**
     * Oculta el header
     */
    hide() {
        this.header?.classList.add('hidden');
    }

    /**
     * Destruye el header
     */
    destroy() {
        this.header?.remove();
    }
}

// Crear instancia única
const Header = new HeaderManager();

export default Header;
