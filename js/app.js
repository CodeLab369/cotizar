/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Aplicación Principal
 * @version 1.0.0
 */

import APP_CONFIG from './config.js';
import Auth from './services/auth.js';
import Notifications from './components/notifications.js';
import Modal from './components/modal.js';
import Sidebar from './components/sidebar.js';
import Header from './components/header.js';
import LoginPage from './pages/login.js';
import InventoryPage from './pages/inventory.js';
import QuotationsPage from './pages/quotations.js';
import SalesPage from './pages/sales.js';
import StoresPage from './pages/stores.js';
import SettingsPage from './pages/settings.js';

/**
 * Clase principal de la aplicación
 */
class App {
    constructor() {
        this.currentPage = null;
        this.currentPageInstance = null;
        this.mainContainer = null;
        this.pageContainer = null;
        this.isInitialized = false;

        // Instancias de páginas
        this.pages = {
            login: new LoginPage(),
            inventory: new InventoryPage(),
            quotations: new QuotationsPage(),
            clients: new SalesPage(),
            quoter: new StoresPage(),
            settings: new SettingsPage()
        };

        // Títulos de páginas
        this.pageTitles = {
            inventory: 'Inventario',
            quotations: 'Cotizaciones',
            clients: 'Ventas',
            quoter: 'Tiendas',
            settings: 'Configuraciones'
        };
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        if (this.isInitialized) return;

        this.mainContainer = document.getElementById('app');
        
        if (!this.mainContainer) {
            console.error('No se encontró el contenedor principal #app');
            return;
        }

        // Verificar autenticación
        if (Auth.isAuthenticated()) {
            this.initDashboard();
        } else {
            this.showLogin();
        }

        this.isInitialized = true;

        // Actualizar actividad periódicamente
        setInterval(() => {
            if (Auth.isAuthenticated()) {
                Auth.updateActivity();
            }
        }, 60000); // Cada minuto

        console.log(`${APP_CONFIG.app.name} v${APP_CONFIG.app.version} iniciado`);
    }

    /**
     * Muestra la página de login
     */
    showLogin() {
        // Limpiar contenedor y ocultar sidebar/header
        this.mainContainer.innerHTML = '';
        this.mainContainer.className = '';
        
        Sidebar.hide();

        // Renderizar login
        this.pages.login.render(this.mainContainer, (user) => {
            this.onLoginSuccess(user);
        });

        this.currentPage = 'login';
    }

    /**
     * Callback cuando el login es exitoso
     * @param {Object} user - Datos del usuario
     */
    onLoginSuccess(user) {
        this.pages.login.destroy();
        this.initDashboard();
    }

    /**
     * Inicializa el dashboard (después del login)
     */
    initDashboard() {
        const user = Auth.getCurrentUser();
        
        // Crear estructura del dashboard
        this.mainContainer.innerHTML = '';
        this.mainContainer.className = 'app-container';

        // Inicializar Sidebar
        Sidebar.init((page) => {
            this.handleNavigation(page);
        });
        Sidebar.show();

        // Crear contenedor principal
        const mainContent = document.createElement('main');
        mainContent.className = 'main-content';
        mainContent.id = 'main-content';

        // Inicializar Header
        Header.init({
            user: {
                name: user?.name || 'Usuario',
                role: user?.role || 'Administrador'
            },
            onLogout: () => this.handleLogout(),
            onNavigate: (page) => this.handleNavigation(page)
        });

        mainContent.appendChild(Header.getElement());

        // Crear contenedor de página
        this.pageContainer = document.createElement('div');
        this.pageContainer.className = 'page-content';
        this.pageContainer.id = 'page-content';
        mainContent.appendChild(this.pageContainer);

        this.mainContainer.appendChild(mainContent);

        // Navegar a la página por defecto
        this.handleNavigation('inventory');
    }

    /**
     * Maneja la navegación entre páginas
     * @param {string} page - Página a mostrar
     */
    handleNavigation(page) {
        if (page === 'logout') {
            this.handleLogout();
            return;
        }

        // Destruir página actual
        if (this.currentPageInstance?.destroy) {
            this.currentPageInstance.destroy();
        }

        // Actualizar sidebar
        Sidebar.setActive(page);

        // Actualizar header
        Header.setTitle(this.pageTitles[page] || 'Dashboard');

        // Renderizar nueva página
        const pageInstance = this.pages[page];
        if (pageInstance) {
            pageInstance.render(this.pageContainer);
            this.currentPageInstance = pageInstance;
            this.currentPage = page;
        } else {
            console.warn(`Página "${page}" no encontrada`);
        }
    }

    /**
     * Maneja el cierre de sesión
     */
    async handleLogout() {
        const confirmed = await Modal.confirm({
            title: '¿Cerrar sesión?',
            message: '¿Estás seguro de que deseas cerrar tu sesión?',
            type: 'warning',
            confirmText: 'Sí, cerrar sesión',
            cancelText: 'Cancelar'
        });

        if (confirmed) {
            const result = Auth.logout();
            
            // Limpiar UI
            Sidebar.destroy();
            Header.destroy();
            
            // Mostrar login
            this.showLogin();
            
            // Notificar
            Notifications.success(result.message);
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    
    // Exponer para debugging
    window.NicmatApp = app;
});

export default App;
