/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Autenticación
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';
import Storage from '../utils/storage.js';

/**
 * Clase para gestionar la autenticación
 */
class AuthService {
    constructor() {
        this.sessionKey = APP_CONFIG.storage.keys.session;
        this.userKey = APP_CONFIG.storage.keys.user;
    }

    /**
     * Intenta iniciar sesión con las credenciales proporcionadas
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Object} Resultado del login
     */
    login(username, password) {
        // Validar campos vacíos
        if (!username || !password) {
            return {
                success: false,
                message: 'Por favor, ingresa usuario y contraseña.'
            };
        }

        // Verificar credenciales
        const { defaultCredentials } = APP_CONFIG;
        
        if (username === defaultCredentials.username && password === defaultCredentials.password) {
            // Crear sesión
            const session = {
                isAuthenticated: true,
                loginTime: Date.now(),
                lastActivity: Date.now()
            };

            // Crear datos de usuario
            const user = {
                username: username,
                name: username,
                role: 'Administrador',
                avatar: null
            };

            // Guardar en almacenamiento
            Storage.set(this.sessionKey, session);
            Storage.set(this.userKey, user);

            return {
                success: true,
                message: APP_CONFIG.messages.auth.loginSuccess,
                user: user
            };
        }

        return {
            success: false,
            message: APP_CONFIG.messages.auth.loginError
        };
    }

    /**
     * Cierra la sesión del usuario
     * @returns {Object} Resultado del logout
     */
    logout() {
        // Eliminar datos de sesión
        Storage.remove(this.sessionKey);
        Storage.remove(this.userKey);

        return {
            success: true,
            message: APP_CONFIG.messages.auth.logoutSuccess
        };
    }

    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    isAuthenticated() {
        const session = Storage.get(this.sessionKey);
        return session?.isAuthenticated === true;
    }

    /**
     * Obtiene los datos del usuario actual
     * @returns {Object|null}
     */
    getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        return Storage.get(this.userKey);
    }

    /**
     * Actualiza la última actividad de la sesión
     */
    updateActivity() {
        const session = Storage.get(this.sessionKey);
        if (session) {
            session.lastActivity = Date.now();
            Storage.set(this.sessionKey, session);
        }
    }

    /**
     * Verifica si la sesión ha expirado (1 hora de inactividad)
     * @returns {boolean}
     */
    isSessionExpired() {
        const session = Storage.get(this.sessionKey);
        if (!session) return true;

        const inactivityTime = Date.now() - session.lastActivity;
        const maxInactivity = 60 * 60 * 1000; // 1 hora

        return inactivityTime > maxInactivity;
    }

    /**
     * Actualiza los datos del usuario
     * @param {Object} userData - Datos a actualizar
     * @returns {Object} Usuario actualizado
     */
    updateUser(userData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        const updatedUser = { ...currentUser, ...userData };
        Storage.set(this.userKey, updatedUser);

        return updatedUser;
    }

    /**
     * Cambia la contraseña del usuario
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Object} Resultado del cambio
     */
    changePassword(currentPassword, newPassword) {
        // En esta implementación básica, solo verificamos contra la contraseña por defecto
        // En una implementación real, esto se manejaría con un backend
        
        if (currentPassword !== APP_CONFIG.defaultCredentials.password) {
            return {
                success: false,
                message: 'La contraseña actual es incorrecta.'
            };
        }

        if (newPassword.length < 4) {
            return {
                success: false,
                message: 'La nueva contraseña debe tener al menos 4 caracteres.'
            };
        }

        // Nota: En esta versión demo, no persistimos el cambio de contraseña
        return {
            success: true,
            message: 'Contraseña actualizada correctamente.'
        };
    }
}

// Crear instancia única
const Auth = new AuthService();

export default Auth;
