/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Login
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';
import Auth from '../services/auth.js';
import Notifications from '../components/notifications.js';

/**
 * Iconos SVG para el login
 */
const LOGIN_ICONS = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
};

/**
 * Clase para gestionar la página de login
 */
class LoginPage {
    constructor() {
        this.container = null;
        this.form = null;
        this.onLoginSuccess = null;
        this.showPassword = false;
    }

    /**
     * Renderiza la página de login
     * @param {HTMLElement} container - Contenedor donde renderizar
     * @param {Function} onLoginSuccess - Callback cuando el login es exitoso
     */
    render(container, onLoginSuccess) {
        this.container = container;
        this.onLoginSuccess = onLoginSuccess;

        const html = `
            <div class="login-container">
                <div class="login-decoration login-decoration-1"></div>
                <div class="login-decoration login-decoration-2"></div>
                
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">NM</div>
                        <h1 class="login-title">${APP_CONFIG.app.name}</h1>
                        <p class="login-subtitle">${APP_CONFIG.app.description}</p>
                    </div>
                    
                    <div class="login-body">
                        <div class="login-welcome">
                            <h2 class="login-welcome-title">Bienvenido/a</h2>
                            <p class="login-welcome-text">Ingresa tus credenciales para continuar</p>
                        </div>
                        
                        <div class="login-error" id="login-error">
                            ${LOGIN_ICONS.error}
                            <span id="login-error-message"></span>
                        </div>
                        
                        <form class="login-form" id="login-form">
                            <div class="form-group">
                                <label class="form-label" for="username">Usuario</label>
                                <div class="form-input-wrapper">
                                    <span class="form-input-icon form-input-icon-left">
                                        ${LOGIN_ICONS.user}
                                    </span>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username"
                                        class="has-icon-left"
                                        placeholder="Ingresa tu usuario"
                                        autocomplete="username"
                                        required
                                    >
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="password">Contraseña</label>
                                <div class="form-input-wrapper">
                                    <span class="form-input-icon form-input-icon-left">
                                        ${LOGIN_ICONS.lock}
                                    </span>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password"
                                        class="has-icon-left"
                                        placeholder="Ingresa tu contraseña"
                                        autocomplete="current-password"
                                        required
                                    >
                                    <button type="button" class="form-input-action" id="toggle-password" aria-label="Mostrar contraseña">
                                        ${LOGIN_ICONS.eye}
                                    </button>
                                </div>
                            </div>
                            
                            <div class="login-options">
                                <label class="login-remember">
                                    <input type="checkbox" id="remember" name="remember">
                                    <span>Recordarme</span>
                                </label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block login-submit" id="login-submit">
                                Iniciar Sesión
                            </button>
                        </form>
                    </div>
                    
                    <div class="login-footer">
                        <p class="login-footer-text">
                            © ${APP_CONFIG.app.year} ${APP_CONFIG.app.name}. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.form = document.getElementById('login-form');
        this.bindEvents();
    }

    /**
     * Vincula los eventos del formulario
     */
    bindEvents() {
        // Submit del formulario
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Toggle de contraseña
        const toggleBtn = document.getElementById('toggle-password');
        toggleBtn?.addEventListener('click', () => {
            this.togglePassword();
        });

        // Limpiar error al escribir
        const inputs = this.form?.querySelectorAll('input');
        inputs?.forEach(input => {
            input.addEventListener('input', () => {
                this.hideError();
            });
        });

        // Focus en el campo de usuario
        document.getElementById('username')?.focus();
    }

    /**
     * Maneja el proceso de login
     */
    handleLogin() {
        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;
        const submitBtn = document.getElementById('login-submit');

        // Mostrar loading
        submitBtn?.classList.add('btn-loading');
        this.hideError();

        // Simular pequeño delay para UX
        setTimeout(() => {
            const result = Auth.login(username, password);

            submitBtn?.classList.remove('btn-loading');

            if (result.success) {
                Notifications.success(result.message);
                
                if (typeof this.onLoginSuccess === 'function') {
                    this.onLoginSuccess(result.user);
                }
            } else {
                this.showError(result.message);
            }
        }, 500);
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        const errorContainer = document.getElementById('login-error');
        const errorMessage = document.getElementById('login-error-message');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.classList.add('show');
        }
    }

    /**
     * Oculta el mensaje de error
     */
    hideError() {
        const errorContainer = document.getElementById('login-error');
        errorContainer?.classList.remove('show');
    }

    /**
     * Toggle de visibilidad de contraseña
     */
    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('toggle-password');
        
        if (passwordInput && toggleBtn) {
            this.showPassword = !this.showPassword;
            passwordInput.type = this.showPassword ? 'text' : 'password';
            toggleBtn.innerHTML = this.showPassword ? LOGIN_ICONS.eyeOff : LOGIN_ICONS.eye;
        }
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

// Exportar instancia
export default LoginPage;
