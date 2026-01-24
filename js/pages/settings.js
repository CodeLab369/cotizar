/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Configuraciones
 * @version 1.0.0
 */

import Settings from '../services/settings.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';
import { debounce } from '../utils/helpers.js';

/**
 * Iconos SVG
 */
const ICONS = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><line x1="8" y1="6" x2="8" y2="6"></line><line x1="16" y1="6" x2="16" y2="6"></line><line x1="12" y1="6" x2="12" y2="6"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line></svg>`,
    fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    save: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    store: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    shoppingCart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`
};

/**
 * Clase para la página de Configuraciones
 */
class SettingsPage {
    constructor() {
        this.container = null;
        this.activeSection = 'company';
    }

    /**
     * Renderiza la página
     * @param {HTMLElement} container - Contenedor
     */
    render(container) {
        this.container = container;
        this.renderContent();
        this.bindEvents();
    }

    /**
     * Renderiza el contenido
     */
    renderContent() {
        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Configuraciones</h1>
                    <p class="page-description">Personaliza el sistema según tus necesidades</p>
                </div>
            </div>

            <!-- Tabs de navegación -->
            <div class="settings-tabs">
                <button class="settings-tab active" data-section="company">
                    ${ICONS.building}
                    <span>Datos de Empresa</span>
                </button>
                <button class="settings-tab" data-section="quotation">
                    ${ICONS.fileText}
                    <span>Cotizaciones</span>
                </button>
                <button class="settings-tab" data-section="backup">
                    ${ICONS.database}
                    <span>Respaldo de Datos</span>
                </button>
            </div>

            <!-- Contenido de tabs -->
            <div class="settings-tab-content active" id="section-company">
                ${this.renderCompanySection()}
            </div>
            <div class="settings-tab-content" id="section-quotation">
                ${this.renderQuotationSection()}
            </div>
            <div class="settings-tab-content" id="section-backup">
                ${this.renderBackupSection()}
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Renderiza la sección de datos de empresa
     */
    renderCompanySection() {
        const company = Settings.getCompany();

        return `
            <div class="settings-card">
                <div class="settings-card-header">
                    <h2 class="settings-card-title">
                        ${ICONS.building}
                        <span>Datos de la Empresa</span>
                    </h2>
                    <p class="settings-card-description">Esta información aparecerá en las cotizaciones y documentos generados</p>
                </div>

                <form id="form-company" class="settings-form">
                    <!-- Logo -->
                    <div class="form-group form-group-logo">
                        <label class="form-label">Logo de la Empresa</label>
                        <div class="logo-upload-container">
                            <div class="logo-preview" id="logo-preview">
                                ${company.logo 
                                    ? `<img src="${company.logo}" alt="Logo" class="logo-image">`
                                    : `<div class="logo-placeholder">${ICONS.image}<span>Sin logo</span></div>`
                                }
                            </div>
                            <div class="logo-actions">
                                <input type="file" id="input-logo" accept="image/*" class="file-input-hidden">
                                <button type="button" class="btn btn-outline" id="btn-upload-logo">
                                    ${ICONS.upload}
                                    <span>Subir Logo</span>
                                </button>
                                ${company.logo ? `
                                    <button type="button" class="btn btn-ghost btn-danger" id="btn-remove-logo">
                                        ${ICONS.trash}
                                        <span>Eliminar</span>
                                    </button>
                                ` : ''}
                            </div>
                            <p class="form-hint">Formato: JPG, PNG. Tamaño recomendado: 200x200px</p>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label required" for="input-nombre">Nombre de la Empresa</label>
                            <input type="text" id="input-nombre" value="${company.nombre || ''}" placeholder="Ej: NICMAT S.R.L." required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-nit">NIT</label>
                            <input type="text" id="input-nit" value="${company.nit || ''}" placeholder="Ej: 123456789">
                        </div>

                        <div class="form-group form-group-full">
                            <label class="form-label" for="input-direccion">Dirección</label>
                            <input type="text" id="input-direccion" value="${company.direccion || ''}" placeholder="Ej: Av. Principal #123, Zona Centro">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-ciudad">Ciudad</label>
                            <input type="text" id="input-ciudad" value="${company.ciudad || ''}" placeholder="Ej: Santa Cruz">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-telefono">Teléfono Principal</label>
                            <input type="tel" id="input-telefono" value="${company.telefono || ''}" placeholder="Ej: 3-123456">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-telefono2">Teléfono Secundario</label>
                            <input type="tel" id="input-telefono2" value="${company.telefono2 || ''}" placeholder="Ej: 70012345">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-email">Correo Electrónico</label>
                            <input type="email" id="input-email" value="${company.email || ''}" placeholder="Ej: ventas@nicmat.com">
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
        `;
    }

    /**
     * Renderiza la sección de configuración de cotizaciones
     */
    renderQuotationSection() {
        const config = Settings.getQuotationConfig();
        const nextNumber = Settings.getNextQuotationNumber();

        return `
            <div class="settings-card">
                <div class="settings-card-header">
                    <h2 class="settings-card-title">
                        ${ICONS.fileText}
                        <span>Configuración de Cotizaciones</span>
                    </h2>
                    <p class="settings-card-description">Personaliza los valores por defecto para las cotizaciones</p>
                </div>

                <form id="form-quotation" class="settings-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label required" for="input-vigencia">Vigencia por Defecto (días)</label>
                            <input type="number" id="input-vigencia" value="${config.vigenciaDias}" min="1" max="365" required>
                            <p class="form-hint">Días de validez de la cotización</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-prefijo">Prefijo de Numeración</label>
                            <input type="text" id="input-prefijo" value="${config.prefijo}" placeholder="COT-">
                            <p class="form-hint">Se agregará al inicio del número</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="input-siguiente">Siguiente Número</label>
                            <input type="number" id="input-siguiente" value="${config.siguienteNumero}" min="1">
                            <p class="form-hint">Próximo: <strong>${nextNumber}</strong></p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="input-terminos">Términos y Condiciones</label>
                        <textarea id="input-terminos" rows="6" placeholder="Ingrese los términos y condiciones...">${config.terminosCondiciones || ''}</textarea>
                        <p class="form-hint">Use {vigencia} para insertar los días de vigencia automáticamente</p>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="input-notas">Notas Adicionales</label>
                        <textarea id="input-notas" rows="3" placeholder="Notas adicionales por defecto...">${config.notasAdicionales || ''}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            ${ICONS.save}
                            <span>Guardar Cambios</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Renderiza la sección de respaldo
     */
    renderBackupSection() {
        const stats = Settings.getDataStats();

        return `
            <div class="settings-card">
                <div class="settings-card-header">
                    <h2 class="settings-card-title">
                        ${ICONS.database}
                        <span>Respaldo y Restauración</span>
                    </h2>
                    <p class="settings-card-description">Exporta o importa los datos del sistema</p>
                </div>

                <!-- Estadísticas de datos -->
                <div class="data-stats">
                    <h3 class="data-stats-title">Datos Almacenados</h3>
                    <div class="data-stats-grid">
                        <div class="data-stat-item">
                            ${ICONS.package}
                            <span class="data-stat-value">${stats.inventory}</span>
                            <span class="data-stat-label">Productos</span>
                        </div>
                        <div class="data-stat-item">
                            ${ICONS.store}
                            <span class="data-stat-value">${stats.stores}</span>
                            <span class="data-stat-label">Tiendas</span>
                        </div>
                        <div class="data-stat-item">
                            ${ICONS.shoppingCart}
                            <span class="data-stat-value">${stats.sales}</span>
                            <span class="data-stat-label">Ventas</span>
                        </div>
                        <div class="data-stat-item">
                            ${ICONS.users}
                            <span class="data-stat-value">${stats.clients}</span>
                            <span class="data-stat-label">Clientes</span>
                        </div>
                        <div class="data-stat-item">
                            ${ICONS.fileText}
                            <span class="data-stat-value">${stats.quotations}</span>
                            <span class="data-stat-label">Cotizaciones</span>
                        </div>
                    </div>
                </div>

                <!-- Exportar -->
                <div class="backup-section">
                    <div class="backup-section-header">
                        <div class="backup-section-info">
                            <h3 class="backup-section-title">
                                ${ICONS.download}
                                <span>Exportar Datos</span>
                            </h3>
                            <p class="backup-section-description">Descarga una copia de seguridad de todos los datos del sistema</p>
                        </div>
                        <button class="btn btn-primary" id="btn-export">
                            ${ICONS.download}
                            <span>Exportar Todo</span>
                        </button>
                    </div>
                </div>

                <!-- Importar -->
                <div class="backup-section">
                    <div class="backup-section-header">
                        <div class="backup-section-info">
                            <h3 class="backup-section-title">
                                ${ICONS.upload}
                                <span>Importar Datos</span>
                            </h3>
                            <p class="backup-section-description">Restaura datos desde un archivo de respaldo</p>
                        </div>
                        <div class="backup-actions">
                            <input type="file" id="input-import" accept=".json" class="file-input-hidden">
                            <button class="btn btn-outline" id="btn-import">
                                ${ICONS.upload}
                                <span>Seleccionar Archivo</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Limpiar datos -->
                <div class="backup-section backup-section-danger">
                    <div class="backup-section-header">
                        <div class="backup-section-info">
                            <h3 class="backup-section-title danger">
                                ${ICONS.trash}
                                <span>Limpiar Datos</span>
                            </h3>
                            <p class="backup-section-description">Elimina todos los datos del sistema. Esta acción no se puede deshacer.</p>
                        </div>
                        <button class="btn btn-danger" id="btn-clear-data">
                            ${ICONS.trash}
                            <span>Limpiar Todo</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vincula eventos
     */
    bindEvents() {
        // Navegación entre tabs
        this.container.querySelectorAll('.settings-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });

        // Formulario de empresa
        document.getElementById('form-company')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCompanyData();
        });

        // Logo upload
        document.getElementById('btn-upload-logo')?.addEventListener('click', () => {
            document.getElementById('input-logo')?.click();
        });

        document.getElementById('input-logo')?.addEventListener('change', (e) => {
            this.handleLogoUpload(e);
        });

        document.getElementById('btn-remove-logo')?.addEventListener('click', () => {
            this.removeLogo();
        });

        // Formulario de cotizaciones
        document.getElementById('form-quotation')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuotationConfig();
        });

        // Exportar
        document.getElementById('btn-export')?.addEventListener('click', () => {
            this.exportData();
        });

        // Importar
        document.getElementById('btn-import')?.addEventListener('click', () => {
            document.getElementById('input-import')?.click();
        });

        document.getElementById('input-import')?.addEventListener('change', (e) => {
            this.handleImportFile(e);
        });

        // Limpiar datos
        document.getElementById('btn-clear-data')?.addEventListener('click', () => {
            this.confirmClearData();
        });
    }

    /**
     * Cambia la sección activa
     */
    switchSection(sectionId) {
        this.activeSection = sectionId;

        // Actualizar tabs
        this.container.querySelectorAll('.settings-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionId);
        });

        // Actualizar contenido
        this.container.querySelectorAll('.settings-tab-content').forEach(section => {
            section.classList.toggle('active', section.id === `section-${sectionId}`);
        });
    }

    /**
     * Guarda los datos de empresa
     */
    saveCompanyData() {
        const data = {
            nombre: document.getElementById('input-nombre')?.value.trim(),
            nit: document.getElementById('input-nit')?.value.trim(),
            direccion: document.getElementById('input-direccion')?.value.trim(),
            ciudad: document.getElementById('input-ciudad')?.value.trim(),
            telefono: document.getElementById('input-telefono')?.value.trim(),
            telefono2: document.getElementById('input-telefono2')?.value.trim(),
            email: document.getElementById('input-email')?.value.trim()
        };

        try {
            Settings.saveCompany(data);
            Notifications.success('Datos de empresa guardados correctamente');
        } catch (error) {
            Notifications.error('Error al guardar los datos');
        }
    }

    /**
     * Maneja la subida del logo
     */
    handleLogoUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            Notifications.error('El archivo debe ser una imagen');
            return;
        }

        // Validar tamaño (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            Notifications.error('La imagen no debe superar los 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            
            // Guardar logo
            Settings.saveLogo(base64);
            
            // Actualizar preview
            const preview = document.getElementById('logo-preview');
            if (preview) {
                preview.innerHTML = `<img src="${base64}" alt="Logo" class="logo-image">`;
            }

            // Refrescar sección para mostrar botón de eliminar
            const section = document.getElementById('section-company');
            if (section) {
                section.innerHTML = this.renderCompanySection();
                this.bindCompanyEvents();
            }

            Notifications.success('Logo actualizado correctamente');
        };
        reader.readAsDataURL(file);

        // Limpiar input
        event.target.value = '';
    }

    /**
     * Vincula eventos específicos de empresa
     */
    bindCompanyEvents() {
        document.getElementById('form-company')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCompanyData();
        });

        document.getElementById('btn-upload-logo')?.addEventListener('click', () => {
            document.getElementById('input-logo')?.click();
        });

        document.getElementById('input-logo')?.addEventListener('change', (e) => {
            this.handleLogoUpload(e);
        });

        document.getElementById('btn-remove-logo')?.addEventListener('click', () => {
            this.removeLogo();
        });
    }

    /**
     * Elimina el logo
     */
    removeLogo() {
        Settings.removeLogo();
        
        // Refrescar sección
        const section = document.getElementById('section-company');
        if (section) {
            section.innerHTML = this.renderCompanySection();
            this.bindCompanyEvents();
        }

        Notifications.success('Logo eliminado');
    }

    /**
     * Guarda la configuración de cotizaciones
     */
    saveQuotationConfig() {
        const config = {
            vigenciaDias: parseInt(document.getElementById('input-vigencia')?.value) || 15,
            prefijo: document.getElementById('input-prefijo')?.value || 'COT-',
            siguienteNumero: parseInt(document.getElementById('input-siguiente')?.value) || 1,
            terminosCondiciones: document.getElementById('input-terminos')?.value || '',
            notasAdicionales: document.getElementById('input-notas')?.value || ''
        };

        try {
            Settings.saveQuotationConfig(config);
            Notifications.success('Configuración de cotizaciones guardada');

            // Actualizar preview del próximo número
            const nextNumber = Settings.getNextQuotationNumber();
            const hint = document.querySelector('#input-siguiente + .form-hint strong');
            if (hint) hint.textContent = nextNumber;
        } catch (error) {
            Notifications.error('Error al guardar la configuración');
        }
    }

    /**
     * Exporta todos los datos
     */
    exportData() {
        try {
            const data = Settings.exportAllData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            
            // Crear enlace de descarga
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `nicmat_backup_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            Notifications.success('Respaldo exportado correctamente');
        } catch (error) {
            Notifications.error('Error al exportar los datos');
        }
    }

    /**
     * Maneja el archivo de importación
     */
    handleImportFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.confirmImport(data);
            } catch (error) {
                Notifications.error('Archivo inválido. Debe ser un archivo JSON de respaldo.');
            }
        };
        reader.readAsText(file);

        // Limpiar input
        event.target.value = '';
    }

    /**
     * Confirma la importación
     */
    confirmImport(data) {
        const info = [];
        if (data.inventory?.length) info.push(`${data.inventory.length} productos`);
        if (data.stores?.length) info.push(`${data.stores.length} tiendas`);
        if (data.sales?.length) info.push(`${data.sales.length} ventas`);
        if (data.clients?.length) info.push(`${data.clients.length} clientes`);
        if (data.quotations?.length) info.push(`${data.quotations.length} cotizaciones`);

        Modal.confirm({
            title: 'Importar Datos',
            message: `
                <div class="import-confirm">
                    <p>Se encontraron los siguientes datos en el archivo:</p>
                    <ul class="import-list">
                        ${info.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                    <p class="import-warning">
                        ${ICONS.alertTriangle}
                        <span>¿Deseas continuar con la importación?</span>
                    </p>
                    <label class="checkbox-label import-merge-option">
                        <input type="checkbox" id="modal-import-merge">
                        <span>Combinar con datos existentes (no reemplazar)</span>
                    </label>
                </div>
            `,
            confirmText: 'Importar',
            cancelText: 'Cancelar',
            type: 'warning'
        }).then((confirmed) => {
            if (confirmed) {
                const merge = document.getElementById('modal-import-merge')?.checked || false;
                this.executeImport(data, merge);
            }
        });
    }

    /**
     * Ejecuta la importación
     */
    executeImport(data, merge) {
        try {
            const result = Settings.importData(data, { merge });
            
            if (result.success) {
                Notifications.success(`Importación completada: ${result.imported.join(', ')}`);
                
                // Refrescar sección de backup para actualizar estadísticas
                const section = document.getElementById('section-backup');
                if (section) {
                    section.innerHTML = this.renderBackupSection();
                    this.bindBackupEvents();
                }
            } else {
                Notifications.error(`Error en la importación: ${result.errors.join(', ')}`);
            }
        } catch (error) {
            Notifications.error('Error al importar los datos');
        }
    }

    /**
     * Vincula eventos de backup
     */
    bindBackupEvents() {
        document.getElementById('btn-export')?.addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('btn-import')?.addEventListener('click', () => {
            document.getElementById('input-import')?.click();
        });

        document.getElementById('input-import')?.addEventListener('change', (e) => {
            this.handleImportFile(e);
        });

        document.getElementById('btn-clear-data')?.addEventListener('click', () => {
            this.confirmClearData();
        });
    }

    /**
     * Confirma la limpieza de datos
     */
    confirmClearData() {
        Modal.confirm({
            title: 'Limpiar Todos los Datos',
            message: `
                <div class="clear-confirm">
                    <div class="clear-warning">
                        ${ICONS.alertTriangle}
                        <span>¡ATENCIÓN!</span>
                    </div>
                    <p>Esta acción eliminará <strong>TODOS</strong> los datos del sistema:</p>
                    <ul class="clear-list">
                        <li>Inventario completo</li>
                        <li>Tiendas y su inventario</li>
                        <li>Ventas registradas</li>
                        <li>Clientes</li>
                        <li>Cotizaciones</li>
                    </ul>
                    <p class="clear-note">Esta acción <strong>NO SE PUEDE DESHACER</strong>. Se recomienda hacer un respaldo antes de continuar.</p>
                    <label class="checkbox-label">
                        <input type="checkbox" id="keep-settings">
                        <span>Mantener configuraciones (empresa y cotizaciones)</span>
                    </label>
                </div>
            `,
            confirmText: 'Eliminar Todo',
            cancelText: 'Cancelar',
            type: 'danger'
        }).then((confirmed) => {
            if (confirmed) {
                const keepSettings = document.getElementById('keep-settings')?.checked || false;
                this.executeClearData(keepSettings);
            }
        });
    }

    /**
     * Ejecuta la limpieza de datos
     */
    executeClearData(keepSettings) {
        try {
            Settings.clearAllData(keepSettings);
            Notifications.success('Todos los datos han sido eliminados');
            
            // Refrescar sección de backup
            const section = document.getElementById('section-backup');
            if (section) {
                section.innerHTML = this.renderBackupSection();
                this.bindBackupEvents();
            }

            // Si no se mantienen configuraciones, refrescar esas secciones también
            if (!keepSettings) {
                const companySection = document.getElementById('section-company');
                if (companySection) {
                    companySection.innerHTML = this.renderCompanySection();
                    this.bindCompanyEvents();
                }

                const quotationSection = document.getElementById('section-quotation');
                if (quotationSection) {
                    quotationSection.innerHTML = this.renderQuotationSection();
                    document.getElementById('form-quotation')?.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.saveQuotationConfig();
                    });
                }
            }
        } catch (error) {
            Notifications.error('Error al limpiar los datos');
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

export default SettingsPage;
