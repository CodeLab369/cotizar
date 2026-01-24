/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Componente: Modal de Perfil de Usuario
 * @version 1.0.0
 */

import Auth from '../services/auth.js';
import Modal from './modal.js';
import Notifications from './notifications.js';

/**
 * Iconos SVG
 */
const ICONS = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    save: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`
};

/**
 * Clase para gestionar el modal de perfil
 */
class ProfileModal {
    constructor() {
        this.modalId = null;
        this.activeTab = 'info';
    }

    /**
     * Abre el modal de perfil
     * @param {Function} onUpdate - Callback cuando se actualiza el perfil
     */
    open(onUpdate = null) {
        this.onUpdate = onUpdate;
        const user = Auth.getCurrentUser();

        if (!user) {
            Notifications.error('No se pudo obtener la información del usuario');
            return;
        }

        this.modalId = Modal.open({
            title: 'Mi Perfil',
            content: this.renderContent(user),
            size: 'default',
            closable: true,
            className: 'profile-modal'
        });

        this.bindEvents();
    }

    /**
     * Renderiza el contenido del modal
     */
    renderContent(user) {
        const session = this.getSessionInfo();

        return `
            <div class="profile-container">
                <!-- Tabs -->
                <div class="profile-tabs">
                    <button class="profile-tab active" data-tab="info">
                        ${ICONS.user}
                        <span>Información</span>
                    </button>
                    <button class="profile-tab" data-tab="security">
                        ${ICONS.lock}
                        <span>Seguridad</span>
                    </button>
                </div>

                <!-- Tab: Información -->
                <div class="profile-tab-content active" id="tab-info">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <span class="profile-avatar-text">${this.getInitials(user.name)}</span>
                        </div>
                        <div class="profile-info">
                            <h3 class="profile-name">${user.name}</h3>
                            <span class="profile-role">${user.role}</span>
                        </div>
                    </div>

                    <form id="form-profile" class="profile-form">
                        <div class="form-group">
                            <label class="form-label" for="profile-name">Nombre</label>
                            <input type="text" id="profile-name" value="${user.name}" placeholder="Tu nombre" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="profile-username">Usuario</label>
                            <input type="text" id="profile-username" value="${user.username}" disabled>
                            <p class="form-hint">El nombre de usuario no se puede cambiar</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="profile-role">Rol</label>
                            <input type="text" id="profile-role" value="${user.role}" disabled>
                        </div>

                        <div class="profile-session-info">
                            <div class="session-item">
                                ${ICONS.calendar}
                                <span>Sesión iniciada: <strong>${session.loginTime}</strong></span>
                            </div>
                            <div class="session-item">
                                ${ICONS.shield}
                                <span>Última actividad: <strong>${session.lastActivity}</strong></span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                ${ICONS.save}
                                <span>Guardar Cambios</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Tab: Seguridad -->
                <div class="profile-tab-content" id="tab-security">
                    <div class="security-header">
                        <div class="security-icon">
                            ${ICONS.shield}
                        </div>
                        <h3 class="security-title">Cambiar Contraseña</h3>
                        <p class="security-description">Por seguridad, ingresa tu contraseña actual antes de establecer una nueva</p>
                    </div>

                    <form id="form-password" class="profile-form">
                        <div class="form-group">
                            <label class="form-label" for="current-password">Contraseña Actual</label>
                            <div class="input-password-wrapper">
                                <input type="password" id="current-password" placeholder="••••••••" required>
                                <button type="button" class="btn-toggle-password" data-target="current-password">
                                    ${ICONS.eye}
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="new-password">Nueva Contraseña</label>
                            <div class="input-password-wrapper">
                                <input type="password" id="new-password" placeholder="••••••••" required minlength="4">
                                <button type="button" class="btn-toggle-password" data-target="new-password">
                                    ${ICONS.eye}
                                </button>
                            </div>
                            <p class="form-hint">Mínimo 4 caracteres</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="confirm-password">Confirmar Nueva Contraseña</label>
                            <div class="input-password-wrapper">
                                <input type="password" id="confirm-password" placeholder="••••••••" required minlength="4">
                                <button type="button" class="btn-toggle-password" data-target="confirm-password">
                                    ${ICONS.eye}
                                </button>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                ${ICONS.lock}
                                <span>Cambiar Contraseña</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Obtiene las iniciales del nombre
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    /**
     * Obtiene información de la sesión
     */
    getSessionInfo() {
        const session = JSON.parse(localStorage.getItem('nicmat_session') || '{}');
        
        const formatDate = (timestamp) => {
            if (!timestamp) return 'No disponible';
            const date = new Date(timestamp);
            return date.toLocaleString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return {
            loginTime: formatDate(session.loginTime),
            lastActivity: formatDate(session.lastActivity)
        };
    }

    /**
     * Vincula eventos
     */
    bindEvents() {
        // Tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Formulario de perfil
        document.getElementById('form-profile')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Formulario de contraseña
        document.getElementById('form-password')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Toggle password visibility
        document.querySelectorAll('.btn-toggle-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                if (input) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    btn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
                }
            });
        });
    }

    /**
     * Cambia de tab
     */
    switchTab(tabId) {
        this.activeTab = tabId;

        // Actualizar tabs
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Actualizar contenido
        document.querySelectorAll('.profile-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });
    }

    /**
     * Guarda el perfil
     */
    saveProfile() {
        const name = document.getElementById('profile-name')?.value.trim();

        if (!name) {
            Notifications.error('El nombre es requerido');
            return;
        }

        const updatedUser = Auth.updateUser({ name });

        if (updatedUser) {
            Notifications.success('Perfil actualizado correctamente');

            // Actualizar avatar en el modal
            const avatarText = document.querySelector('.profile-avatar-text');
            const profileName = document.querySelector('.profile-name');
            
            if (avatarText) avatarText.textContent = this.getInitials(name);
            if (profileName) profileName.textContent = name;

            // Callback para actualizar el header
            if (typeof this.onUpdate === 'function') {
                this.onUpdate(updatedUser);
            }
        } else {
            Notifications.error('Error al actualizar el perfil');
        }
    }

    /**
     * Cambia la contraseña
     */
    changePassword() {
        const currentPassword = document.getElementById('current-password')?.value;
        const newPassword = document.getElementById('new-password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;

        // Validaciones
        if (!currentPassword || !newPassword || !confirmPassword) {
            Notifications.error('Todos los campos son requeridos');
            return;
        }

        if (newPassword !== confirmPassword) {
            Notifications.error('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 4) {
            Notifications.error('La nueva contraseña debe tener al menos 4 caracteres');
            return;
        }

        const result = Auth.changePassword(currentPassword, newPassword);

        if (result.success) {
            Notifications.success(result.message);
            
            // Limpiar formulario
            document.getElementById('form-password')?.reset();
        } else {
            Notifications.error(result.message);
        }
    }

    /**
     * Cierra el modal
     */
    close() {
        if (this.modalId) {
            Modal.close(this.modalId);
            this.modalId = null;
        }
    }
}

// Crear instancia única
const Profile = new ProfileModal();

export default Profile;
