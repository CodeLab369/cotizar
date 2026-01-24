/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Inventario
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';
import Inventory from '../services/inventory.js';
import Currency from '../utils/currency.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';
import { debounce } from '../utils/helpers.js';

/**
 * Iconos SVG
 */
const ICONS = {
    box: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    layers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    emptyBox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`
};

/**
 * Clase para la página de Inventario
 */
class InventoryPage {
    constructor() {
        this.container = null;
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.filters = {
            search: '',
            marca: '',
            amperaje: '',
            cantidadOperador: '',
            cantidadValor: ''
        };
        this.filteredData = [];
    }

    /**
     * Renderiza la página
     * @param {HTMLElement} container - Contenedor
     */
    render(container) {
        this.container = container;
        this.currentPage = 1;
        this.filters = {
            search: '',
            marca: '',
            amperaje: '',
            cantidadOperador: '',
            cantidadValor: ''
        };
        
        this.loadXLSXLibrary().then(() => {
            this.renderContent();
            this.bindEvents();
            this.loadData();
        });
    }

    /**
     * Carga la librería XLSX dinámicamente
     */
    async loadXLSXLibrary() {
        if (window.XLSX) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Renderiza el contenido de la página
     */
    renderContent() {
        const stats = Inventory.getStats();
        const brands = Inventory.getBrands();

        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Inventario</h1>
                    <p class="page-description">Gestiona el inventario de baterías</p>
                </div>
                <div class="page-header-actions inventory-actions">
                    <button class="btn btn-primary" id="btn-add">
                        ${ICONS.plus}
                        <span>Agregar</span>
                    </button>
                    <div class="btn-group-import">
                        <button class="btn btn-outline-primary" id="btn-import" title="Importar desde Excel">
                            ${ICONS.upload}
                            <span>Importar</span>
                        </button>
                        <button class="btn btn-outline-primary" id="btn-export" title="Exportar a Excel">
                            ${ICONS.download}
                            <span>Exportar</span>
                        </button>
                        <button class="btn btn-outline-primary" id="btn-format" title="Descargar plantilla">
                            ${ICONS.file}
                            <span>Formato</span>
                        </button>
                    </div>
                    <button class="btn btn-danger" id="btn-delete-all" title="Eliminar todo">
                        ${ICONS.trash}
                        <span>Eliminar</span>
                    </button>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="inventory-stats" id="inventory-stats">
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon primary">
                        ${ICONS.package}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="stat-products">${stats.totalProductos}</div>
                        <div class="inventory-stat-label">Productos</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon success">
                        ${ICONS.layers}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="stat-units">${stats.totalUnidades}</div>
                        <div class="inventory-stat-label">Unidades Totales</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon warning">
                        ${ICONS.dollarSign}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="stat-cost">${Currency.format(stats.costoTotalInventario)}</div>
                        <div class="inventory-stat-label">Costo Total</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon info">
                        ${ICONS.trendingUp}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="stat-value">${Currency.format(stats.valorVentaTotal)}</div>
                        <div class="inventory-stat-label">Valor de Venta</div>
                    </div>
                </div>
            </div>

            <!-- Tabla de inventario -->
            <div class="table-container">
                <div class="table-toolbar">
                    <div class="table-toolbar-left">
                        <div class="table-search">
                            <span class="table-search-icon">${ICONS.search}</span>
                            <input type="text" class="table-search-input" id="search-input" placeholder="Buscar por marca o amperaje...">
                        </div>
                    </div>
                    <div class="table-toolbar-right">
                        <span style="font-size: var(--font-size-sm); color: var(--text-muted);">Mostrar:</span>
                        <select id="items-per-page" class="pagination-select">
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                        </select>
                    </div>
                </div>

                <div class="table-filters">
                    <div class="filter-group">
                        <label>Marca:</label>
                        <select id="filter-marca">
                            <option value="">Todas</option>
                            ${brands.map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Amperaje:</label>
                        <select id="filter-amperaje">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Cantidad:</label>
                        <select id="filter-cantidad-op" class="filter-operator">
                            <option value="">--</option>
                            <option value="=">=</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&ge;</option>
                            <option value="<=">&le;</option>
                        </select>
                        <input type="number" id="filter-cantidad-val" placeholder="Valor" min="0">
                    </div>
                    <button class="btn btn-ghost btn-sm btn-clear-filters" id="btn-clear-filters">
                        ${ICONS.x}
                        <span>Limpiar filtros</span>
                    </button>
                </div>

                <div class="table-wrapper">
                    <table class="data-table" id="inventory-table">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Amperaje</th>
                                <th class="col-number">Cantidad</th>
                                <th class="col-currency">Costo</th>
                                <th class="col-currency">Precio Venta</th>
                                <th class="col-currency">Costo Total</th>
                                <th class="col-currency">Costo Venta</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-tbody">
                        </tbody>
                    </table>
                </div>

                <div class="table-pagination" id="pagination">
                </div>
            </div>

            <!-- Input file oculto para importar -->
            <input type="file" id="file-import" class="file-input-hidden" accept=".xlsx,.xls">
        `;

        this.container.innerHTML = html;
    }

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Botón agregar
        document.getElementById('btn-add')?.addEventListener('click', () => {
            this.showProductModal();
        });

        // Botones de importación/exportación
        document.getElementById('btn-import')?.addEventListener('click', () => {
            document.getElementById('file-import')?.click();
        });

        document.getElementById('file-import')?.addEventListener('change', (e) => {
            this.handleImport(e);
        });

        document.getElementById('btn-export')?.addEventListener('click', () => {
            this.handleExport();
        });

        document.getElementById('btn-format')?.addEventListener('click', () => {
            this.downloadTemplate();
        });

        // Botón eliminar todo
        document.getElementById('btn-delete-all')?.addEventListener('click', () => {
            this.handleDeleteAll();
        });

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('input', debounce((e) => {
            this.filters.search = e.target.value;
            this.currentPage = 1;
            this.loadData();
        }, 300));

        // Items por página
        document.getElementById('items-per-page')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.loadData();
        });

        // Filtros
        document.getElementById('filter-marca')?.addEventListener('change', (e) => {
            this.filters.marca = e.target.value;
            this.filters.amperaje = '';
            this.updateAmperajeFilter();
            this.currentPage = 1;
            this.loadData();
        });

        document.getElementById('filter-amperaje')?.addEventListener('change', (e) => {
            this.filters.amperaje = e.target.value;
            this.currentPage = 1;
            this.loadData();
        });

        document.getElementById('filter-cantidad-op')?.addEventListener('change', (e) => {
            this.filters.cantidadOperador = e.target.value;
            this.currentPage = 1;
            this.loadData();
        });

        document.getElementById('filter-cantidad-val')?.addEventListener('input', debounce((e) => {
            this.filters.cantidadValor = e.target.value;
            this.currentPage = 1;
            this.loadData();
        }, 300));

        // Limpiar filtros
        document.getElementById('btn-clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    /**
     * Actualiza el filtro de amperaje según la marca seleccionada
     */
    updateAmperajeFilter() {
        const amperajeSelect = document.getElementById('filter-amperaje');
        if (!amperajeSelect) return;

        const amperajes = Inventory.getAmperajes(this.filters.marca || null);
        
        amperajeSelect.innerHTML = `
            <option value="">Todos</option>
            ${amperajes.map(a => `<option value="${a}">${a}</option>`).join('')}
        `;
    }

    /**
     * Limpia todos los filtros
     */
    clearFilters() {
        this.filters = {
            search: '',
            marca: '',
            amperaje: '',
            cantidadOperador: '',
            cantidadValor: ''
        };

        document.getElementById('search-input').value = '';
        document.getElementById('filter-marca').value = '';
        document.getElementById('filter-amperaje').value = '';
        document.getElementById('filter-cantidad-op').value = '';
        document.getElementById('filter-cantidad-val').value = '';

        this.updateAmperajeFilter();
        this.currentPage = 1;
        this.loadData();
    }

    /**
     * Carga y renderiza los datos
     */
    loadData() {
        this.filteredData = Inventory.filter(this.filters);
        this.renderTable();
        this.renderPagination();
        this.updateStats();
        this.updateBrandsFilter();
    }

    /**
     * Actualiza las estadísticas
     */
    updateStats() {
        const stats = Inventory.getStats();
        
        document.getElementById('stat-products').textContent = stats.totalProductos;
        document.getElementById('stat-units').textContent = stats.totalUnidades;
        document.getElementById('stat-cost').textContent = Currency.format(stats.costoTotalInventario);
        document.getElementById('stat-value').textContent = Currency.format(stats.valorVentaTotal);
    }

    /**
     * Actualiza el filtro de marcas
     */
    updateBrandsFilter() {
        const marcaSelect = document.getElementById('filter-marca');
        if (!marcaSelect) return;

        const currentValue = marcaSelect.value;
        const brands = Inventory.getBrands();
        
        marcaSelect.innerHTML = `
            <option value="">Todas</option>
            ${brands.map(b => `<option value="${b}" ${b === currentValue ? 'selected' : ''}>${b}</option>`).join('')}
        `;
    }

    /**
     * Renderiza la tabla
     */
    renderTable() {
        const tbody = document.getElementById('inventory-tbody');
        if (!tbody) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.filteredData.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="table-empty">
                            <div class="table-empty-icon">${ICONS.emptyBox}</div>
                            <div class="table-empty-title">No hay productos</div>
                            <div class="table-empty-text">
                                ${this.filteredData.length === 0 && Inventory.getAll().length > 0 
                                    ? 'No se encontraron productos con los filtros aplicados' 
                                    : 'Agrega productos al inventario para comenzar'}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageData.map(item => `
            <tr data-id="${item.id}">
                <td>${item.marca}</td>
                <td>${item.amperaje}</td>
                <td class="col-number">${item.cantidad}</td>
                <td class="col-currency">${Currency.format(item.costo)}</td>
                <td class="col-currency">${Currency.format(item.precioVenta)}</td>
                <td class="col-currency">${Currency.format(item.costoTotal)}</td>
                <td class="col-currency">${Currency.format(item.costoVenta)}</td>
                <td class="col-actions">
                    <div class="row-actions">
                        <button class="row-action-btn view" title="Ver detalle" data-action="view" data-id="${item.id}">
                            ${ICONS.eye}
                        </button>
                        <button class="row-action-btn edit" title="Editar" data-action="edit" data-id="${item.id}">
                            ${ICONS.edit}
                        </button>
                        <button class="row-action-btn delete" title="Eliminar" data-action="delete" data-id="${item.id}">
                            ${ICONS.trash}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind action events
        tbody.querySelectorAll('.row-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                
                if (action === 'view') this.showProductView(id);
                if (action === 'edit') this.showProductModal(id);
                if (action === 'delete') this.handleDelete(id);
            });
        });
    }

    /**
     * Renderiza la paginación
     */
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);

        if (this.filteredData.length === 0) {
            pagination.innerHTML = '';
            return;
        }

        let pagesHtml = '';
        
        // Mostrar máximo 5 páginas
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pagesHtml += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        pagination.innerHTML = `
            <div class="pagination-info">
                Mostrando ${start} - ${end} de ${this.filteredData.length} productos
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" id="btn-prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                    ${ICONS.chevronLeft}
                </button>
                <div class="pagination-pages">
                    ${pagesHtml}
                </div>
                <button class="pagination-btn" id="btn-next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    ${ICONS.chevronRight}
                </button>
            </div>
        `;

        // Bind pagination events
        document.getElementById('btn-prev')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadData();
            }
        });

        document.getElementById('btn-next')?.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.loadData();
            }
        });

        pagination.querySelectorAll('.pagination-pages .pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.loadData();
            });
        });
    }

    /**
     * Muestra el modal de producto (agregar/editar)
     */
    showProductModal(id = null) {
        const isEdit = id !== null;
        const product = isEdit ? Inventory.getById(id) : null;

        // Estado para detectar producto existente
        let existingProduct = null;
        let isRestockMode = false;

        const content = `
            <form id="product-form">
                <!-- Alerta de producto existente -->
                <div class="product-exists-alert" id="product-exists-alert" style="display: none;">
                    <div class="product-exists-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div class="product-exists-content">
                        <div class="product-exists-title">Producto existente detectado</div>
                        <div class="product-exists-text" id="product-exists-text"></div>
                    </div>
                </div>

                <div class="product-form-grid">
                    <div class="form-group">
                        <label class="form-label required" for="input-marca">Marca</label>
                        <input type="text" id="input-marca" placeholder="Ingrese marca" value="${product?.marca || ''}" required ${isEdit ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label required" for="input-amperaje">Amperaje</label>
                        <input type="text" id="input-amperaje" placeholder="Ingrese amperaje" value="${product?.amperaje || ''}" required ${isEdit ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label class="form-label required" for="input-cantidad">
                            <span id="cantidad-label">Cantidad</span>
                        </label>
                        <input type="number" id="input-cantidad" placeholder="Ingrese cantidad" min="0" value="${product?.cantidad || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required" for="input-costo">Costo</label>
                        <input type="text" id="input-costo" placeholder="Ingrese costo" value="${product ? Currency.format(product.costo, false) : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label required" for="input-precio">Precio de Venta</label>
                        <input type="text" id="input-precio" placeholder="Ingrese precio de venta" value="${product ? Currency.format(product.precioVenta, false) : ''}" required>
                    </div>
                </div>

                <!-- Checkbox para actualizar precios en modo reabastecimiento -->
                <div class="form-group restock-options" id="restock-options" style="display: none;">
                    <label class="checkbox-label">
                        <input type="checkbox" id="update-prices-checkbox">
                        <span>Actualizar precios con los valores ingresados</span>
                    </label>
                </div>
                
                <div class="product-calculated">
                    <div class="product-calculated-title">Valores calculados</div>
                    <div class="product-calculated-grid">
                        <div class="product-calculated-item">
                            <span class="product-calculated-label">Costo Total</span>
                            <span class="product-calculated-value" id="calc-costo-total">${product ? Currency.format(product.costoTotal) : 'Bs. 0,00'}</span>
                        </div>
                        <div class="product-calculated-item">
                            <span class="product-calculated-label">Costo Venta</span>
                            <span class="product-calculated-value" id="calc-costo-venta">${product ? Currency.format(product.costoVenta) : 'Bs. 0,00'}</span>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const modalId = Modal.open({
            title: isEdit ? 'Editar Producto' : 'Agregar Producto',
            content,
            size: 'default',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="modal-cancel">Cancelar</button>
                <button class="btn btn-primary" id="modal-save">${isEdit ? 'Guardar Cambios' : 'Agregar'}</button>
            `
        });

        // Función para verificar si el producto existe
        const checkExistingProduct = () => {
            if (isEdit) return; // No verificar en modo edición

            const marca = document.getElementById('input-marca')?.value?.trim();
            const amperaje = document.getElementById('input-amperaje')?.value?.trim();

            if (!marca || !amperaje) {
                hideExistingAlert();
                return;
            }

            existingProduct = Inventory.findByMarcaAmperaje(marca, amperaje);

            if (existingProduct) {
                showExistingAlert(existingProduct);
            } else {
                hideExistingAlert();
            }
        };

        const showExistingAlert = (product) => {
            isRestockMode = true;
            const alert = document.getElementById('product-exists-alert');
            const text = document.getElementById('product-exists-text');
            const saveBtn = document.getElementById('modal-save');
            const cantidadLabel = document.getElementById('cantidad-label');
            const restockOptions = document.getElementById('restock-options');

            alert.style.display = 'flex';
            text.innerHTML = `<strong>${product.marca} ${product.amperaje}</strong> ya existe con <strong>${product.cantidad}</strong> unidades en stock.`;
            saveBtn.textContent = 'Reabastecer';
            saveBtn.classList.remove('btn-primary');
            saveBtn.classList.add('btn-success');
            cantidadLabel.textContent = 'Cantidad a agregar';
            restockOptions.style.display = 'block';

            // Actualizar título del modal
            const modalTitle = document.querySelector('.modal-title');
            if (modalTitle) modalTitle.textContent = 'Reabastecer Producto';
        };

        const hideExistingAlert = () => {
            isRestockMode = false;
            existingProduct = null;
            const alert = document.getElementById('product-exists-alert');
            const saveBtn = document.getElementById('modal-save');
            const cantidadLabel = document.getElementById('cantidad-label');
            const restockOptions = document.getElementById('restock-options');

            alert.style.display = 'none';
            saveBtn.textContent = 'Agregar';
            saveBtn.classList.add('btn-primary');
            saveBtn.classList.remove('btn-success');
            cantidadLabel.textContent = 'Cantidad';
            restockOptions.style.display = 'none';

            // Restaurar título
            const modalTitle = document.querySelector('.modal-title');
            if (modalTitle) modalTitle.textContent = 'Agregar Producto';
        };

        // Calcular totales en tiempo real
        const updateCalculations = () => {
            const cantidad = parseInt(document.getElementById('input-cantidad')?.value) || 0;
            const costo = Currency.parse(document.getElementById('input-costo')?.value) || 0;
            const precio = Currency.parse(document.getElementById('input-precio')?.value) || 0;

            // Si estamos en modo reabastecimiento, calcular con la cantidad total
            if (isRestockMode && existingProduct) {
                const totalCantidad = existingProduct.cantidad + cantidad;
                const updatePrices = document.getElementById('update-prices-checkbox')?.checked;
                const costoFinal = updatePrices ? costo : existingProduct.costo;
                const precioFinal = updatePrices ? precio : existingProduct.precioVenta;

                document.getElementById('calc-costo-total').textContent = Currency.format(totalCantidad * costoFinal);
                document.getElementById('calc-costo-venta').textContent = Currency.format(totalCantidad * precioFinal);
            } else {
                document.getElementById('calc-costo-total').textContent = Currency.format(cantidad * costo);
                document.getElementById('calc-costo-venta').textContent = Currency.format(cantidad * precio);
            }
        };

        // Eventos para detectar producto existente
        if (!isEdit) {
            document.getElementById('input-marca')?.addEventListener('blur', checkExistingProduct);
            document.getElementById('input-amperaje')?.addEventListener('blur', checkExistingProduct);
        }

        // Checkbox de actualizar precios
        document.getElementById('update-prices-checkbox')?.addEventListener('change', updateCalculations);

        // Formateo de moneda en inputs
        ['input-costo', 'input-precio'].forEach(inputId => {
            const input = document.getElementById(inputId);
            input?.addEventListener('input', (e) => {
                e.target.value = Currency.formatInput(e.target.value);
                updateCalculations();
            });
        });

        document.getElementById('input-cantidad')?.addEventListener('input', updateCalculations);

        // Eventos del modal
        document.getElementById('modal-cancel')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        document.getElementById('modal-save')?.addEventListener('click', () => {
            const form = document.getElementById('product-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const productData = {
                marca: document.getElementById('input-marca').value,
                amperaje: document.getElementById('input-amperaje').value,
                cantidad: document.getElementById('input-cantidad').value,
                costo: document.getElementById('input-costo').value,
                precioVenta: document.getElementById('input-precio').value
            };

            if (isEdit) {
                Inventory.update(id, productData);
                Notifications.success('Producto actualizado correctamente');
            } else if (isRestockMode && existingProduct) {
                // Modo reabastecimiento
                const updatePrices = document.getElementById('update-prices-checkbox')?.checked;
                Inventory.restock(existingProduct.id, productData.cantidad, {
                    updatePrices,
                    costo: productData.costo,
                    precioVenta: productData.precioVenta
                });
                Notifications.success(`Producto reabastecido: +${productData.cantidad} unidades agregadas`);
            } else {
                Inventory.add(productData);
                Notifications.success('Producto agregado correctamente');
            }

            Modal.close(modalId);
            this.loadData();
        });
    }

    /**
     * Muestra la vista de detalle del producto
     */
    showProductView(id) {
        const product = Inventory.getById(id);
        if (!product) return;

        const content = `
            <div class="product-view">
                <div class="product-view-row">
                    <span class="product-view-label">Marca</span>
                    <span class="product-view-value">${product.marca}</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Amperaje</span>
                    <span class="product-view-value">${product.amperaje}</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Cantidad</span>
                    <span class="product-view-value">${product.cantidad} unidades</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Costo Unitario</span>
                    <span class="product-view-value">${Currency.format(product.costo)}</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Precio de Venta</span>
                    <span class="product-view-value">${Currency.format(product.precioVenta)}</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Costo Total</span>
                    <span class="product-view-value highlight">${Currency.format(product.costoTotal)}</span>
                </div>
                <div class="product-view-row">
                    <span class="product-view-label">Costo Venta</span>
                    <span class="product-view-value highlight">${Currency.format(product.costoVenta)}</span>
                </div>
            </div>
        `;

        const modalId = Modal.open({
            title: 'Detalle del Producto',
            content,
            size: 'sm',
            showFooter: true,
            footerContent: `
                <button class="btn btn-primary" id="btn-close-view">Cerrar</button>
            `
        });

        // Vincular evento del botón cerrar
        document.getElementById('btn-close-view')?.addEventListener('click', () => {
            Modal.close(modalId);
        });
    }

    /**
     * Maneja la eliminación de un producto
     */
    async handleDelete(id) {
        const product = Inventory.getById(id);
        if (!product) return;

        const confirmed = await Modal.confirm({
            title: '¿Eliminar producto?',
            message: `¿Estás seguro de que deseas eliminar "${product.marca} ${product.amperaje}"?`,
            type: 'danger',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (confirmed) {
            Inventory.delete(id);
            Notifications.success('Producto eliminado correctamente');
            this.loadData();
        }
    }

    /**
     * Maneja la eliminación de todo el inventario
     */
    async handleDeleteAll() {
        const total = Inventory.getAll().length;
        
        if (total === 0) {
            Notifications.warning('No hay productos para eliminar');
            return;
        }

        const confirmed = await Modal.confirm({
            title: '¿Eliminar todo el inventario?',
            message: `Esta acción eliminará ${total} producto(s) de forma permanente. Esta acción no se puede deshacer.`,
            type: 'danger',
            confirmText: 'Sí, eliminar todo',
            cancelText: 'Cancelar',
            dangerConfirm: true
        });

        if (confirmed) {
            Inventory.deleteAll();
            Notifications.success('Inventario eliminado completamente');
            this.clearFilters();
        }
    }

    /**
     * Maneja la importación de archivos Excel
     */
    async handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const data = await this.readExcelFile(file);
            
            if (data.length === 0) {
                Notifications.error('El archivo está vacío o no tiene el formato correcto');
                event.target.value = '';
                return;
            }

            // Mostrar modal de opciones de importación
            this.showImportOptionsModal(data);
        } catch (error) {
            console.error('Error al importar:', error);
            Notifications.error('Error al leer el archivo. Asegúrate de que sea un archivo Excel válido.');
        }

        // Limpiar input
        event.target.value = '';
    }

    /**
     * Muestra el modal de opciones de importación
     */
    showImportOptionsModal(data) {
        // Contar productos existentes vs nuevos
        let existingCount = 0;
        let newCount = 0;

        data.forEach(item => {
            const existing = Inventory.findByMarcaAmperaje(item.marca, item.amperaje);
            if (existing) {
                existingCount++;
            } else {
                newCount++;
            }
        });

        const content = `
            <div class="import-options-summary">
                <div class="import-summary-title">Resumen del archivo</div>
                <div class="import-summary-grid">
                    <div class="import-summary-item">
                        <span class="import-summary-value">${data.length}</span>
                        <span class="import-summary-label">Total productos</span>
                    </div>
                    <div class="import-summary-item new">
                        <span class="import-summary-value">${newCount}</span>
                        <span class="import-summary-label">Productos nuevos</span>
                    </div>
                    <div class="import-summary-item existing">
                        <span class="import-summary-value">${existingCount}</span>
                        <span class="import-summary-label">Ya existentes</span>
                    </div>
                </div>
            </div>

            <div class="import-options-form">
                <div class="import-options-title">¿Qué deseas hacer con los ${existingCount} productos existentes?</div>
                
                <div class="import-option-group">
                    <label class="radio-card">
                        <input type="radio" name="import-mode" value="restock" ${existingCount > 0 ? 'checked' : ''}>
                        <div class="radio-card-content">
                            <div class="radio-card-icon success">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                            </div>
                            <div class="radio-card-text">
                                <div class="radio-card-title">Reabastecer existentes</div>
                                <div class="radio-card-desc">Suma las cantidades a los productos que ya existen</div>
                            </div>
                        </div>
                    </label>

                    <label class="radio-card">
                        <input type="radio" name="import-mode" value="duplicate" ${existingCount === 0 ? 'checked' : ''}>
                        <div class="radio-card-content">
                            <div class="radio-card-icon warning">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
                            </div>
                            <div class="radio-card-text">
                                <div class="radio-card-title">Crear duplicados</div>
                                <div class="radio-card-desc">Crea nuevos registros aunque ya existan</div>
                            </div>
                        </div>
                    </label>
                </div>

                <div class="import-extra-options" id="import-extra-options" style="${existingCount > 0 ? '' : 'display: none;'}">
                    <label class="checkbox-label">
                        <input type="checkbox" id="import-update-prices">
                        <span>Actualizar precios de los productos existentes</span>
                    </label>
                </div>
            </div>
        `;

        const modalId = Modal.open({
            title: 'Opciones de Importación',
            content,
            size: 'default',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="import-cancel">Cancelar</button>
                <button class="btn btn-primary" id="import-confirm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Importar
                </button>
            `
        });

        // Mostrar/ocultar opciones extra según el modo
        document.querySelectorAll('input[name="import-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const extraOptions = document.getElementById('import-extra-options');
                if (e.target.value === 'restock') {
                    extraOptions.style.display = '';
                } else {
                    extraOptions.style.display = 'none';
                }
            });
        });

        // Cancelar
        document.getElementById('import-cancel')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        // Confirmar importación
        document.getElementById('import-confirm')?.addEventListener('click', () => {
            const mode = document.querySelector('input[name="import-mode"]:checked')?.value || 'duplicate';
            const updatePrices = document.getElementById('import-update-prices')?.checked || false;

            const options = {
                restockExisting: mode === 'restock',
                updatePrices: updatePrices
            };

            const result = Inventory.import(data, options);

            // Construir mensaje de resultado
            let message = '';
            if (result.added > 0) {
                message += `${result.added} producto(s) nuevo(s)`;
            }
            if (result.restocked > 0) {
                message += message ? ', ' : '';
                message += `${result.restocked} producto(s) reabastecido(s)`;
            }
            if (result.errors > 0) {
                message += message ? ', ' : '';
                message += `${result.errors} error(es)`;
            }

            if (result.added > 0 || result.restocked > 0) {
                Notifications.success(`Importación completada: ${message}`);
            } else if (result.errors > 0) {
                Notifications.error('No se pudo importar ningún producto');
            }

            Modal.close(modalId);
            this.loadData();
        });
    }

    /**
     * Lee un archivo Excel
     */
    readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    
                    // Mapear columnas
                    const mappedData = jsonData.map(row => ({
                        marca: row['Marca'] || row['marca'] || '',
                        amperaje: row['Amperaje'] || row['amperaje'] || '',
                        cantidad: row['Cantidad'] || row['cantidad'] || 0,
                        costo: row['Costo'] || row['costo'] || 0,
                        precioVenta: row['Precio de Venta'] || row['precioVenta'] || row['Precio Venta'] || row['precio_venta'] || 0
                    }));
                    
                    resolve(mappedData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Exporta el inventario a Excel
     */
    handleExport() {
        const data = Inventory.export();
        
        if (data.length === 0) {
            Notifications.warning('No hay datos para exportar');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
        
        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 20 }, // Marca
            { wch: 15 }, // Amperaje
            { wch: 12 }, // Cantidad
            { wch: 15 }, // Costo
            { wch: 18 }, // Precio de Venta
            { wch: 15 }, // Costo Total
            { wch: 15 }  // Costo Venta
        ];
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, `Inventario_NICMAT_${new Date().toISOString().split('T')[0]}.xlsx`);
        Notifications.success('Inventario exportado correctamente');
    }

    /**
     * Descarga la plantilla de importación
     */
    downloadTemplate() {
        const templateData = [
            {
                'Marca': 'Ejemplo: BOSCH',
                'Amperaje': '60Ah',
                'Cantidad': 10,
                'Costo': 450,
                'Precio de Venta': 650
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');

        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 20 },
            { wch: 15 },
            { wch: 12 },
            { wch: 15 },
            { wch: 18 }
        ];
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, 'Plantilla_Inventario_NICMAT.xlsx');
        Notifications.info('Plantilla descargada. Completa los datos y usa "Importar" para cargarlos.');
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
