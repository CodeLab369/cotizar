/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Configuración global de la aplicación
 * @version 1.0.0
 */

const APP_CONFIG = {
    // Información de la aplicación
    app: {
        name: 'NICMAT S.R.L.',
        description: 'Sistema de Cotización de Baterías',
        version: '1.0.0',
        year: new Date().getFullYear()
    },

    // Configuración de moneda (Bolivianos)
    currency: {
        code: 'BOB',
        symbol: 'Bs.',
        decimalSeparator: ',',
        thousandsSeparator: '.',
        decimals: 2
    },

    // Credenciales por defecto
    defaultCredentials: {
        username: 'Anahi',
        password: '2026'
    },

    // Configuración de almacenamiento
    storage: {
        prefix: 'nicmat_',
        keys: {
            session: 'session',
            user: 'user',
            settings: 'settings',
            inventory: 'inventory',
            clients: 'clients',
            quotations: 'quotations'
        }
    },

    // Configuración de notificaciones
    notifications: {
        defaultDuration: 5000, // 5 segundos
        maxVisible: 5,
        position: 'top-right'
    },

    // Rutas de la aplicación
    routes: {
        login: 'login',
        inventory: 'inventory',
        clients: 'clients',
        quoter: 'quoter',
        settings: 'settings'
    },

    // Mensajes de la aplicación
    messages: {
        auth: {
            loginSuccess: '¡Bienvenido/a! Has iniciado sesión correctamente.',
            loginError: 'Usuario o contraseña incorrectos.',
            logoutSuccess: 'Has cerrado sesión correctamente.',
            sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        },
        common: {
            saveSuccess: 'Los datos se han guardado correctamente.',
            saveError: 'Error al guardar los datos.',
            deleteSuccess: 'El elemento se ha eliminado correctamente.',
            deleteConfirm: '¿Estás seguro de que deseas eliminar este elemento?',
            loading: 'Cargando...',
            error: 'Ha ocurrido un error. Por favor, intenta nuevamente.'
        },
        development: {
            title: 'Módulo en Desarrollo',
            subtitle: 'Estamos trabajando en esta funcionalidad',
            text: 'Este módulo estará disponible próximamente. Gracias por tu paciencia.'
        }
    }
};

// Exportar configuración
export default APP_CONFIG;
