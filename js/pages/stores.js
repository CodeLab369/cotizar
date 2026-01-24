/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Tiendas
 * @version 1.0.0
 */

import Stores, { STORE_TYPES } from '../services/stores.js';
import Inventory from '../services/inventory.js';
import Currency from '../utils/currency.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';
import { debounce } from '../utils/helpers.js';

/**
 * Iconos SVG
 */
const ICONS = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    store: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><line x1="8" y1="6" x2="8" y2="6"></line><line x1="16" y1="6" x2="16" y2="6"></line><line x1="12" y1="6" x2="12" y2="6"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    login: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>`,
    tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    layers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    truck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    emptyBox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`,
    checkSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
    square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
    minusSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    minus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
};

/**
 * Clase para la página de Tiendas
 */
class StoresPage {
    constructor() {
        this.container = null;
        this.stores = [];
        this.sendItems = []; // Items para envío
        this.currentView = 'list'; // 'list' o 'detail'
        this.currentStoreId = null;
        
        // Propiedades para vista de detalle (tipo inventario)
        this.storeInventory = [];
        this.mainInventory = [];
        this.selectedProducts = new Map(); // productId -> cantidad a enviar
        this.detailCurrentPage = 1;
        this.detailItemsPerPage = 10;
        this.detailFilters = {
            search: '',
            marca: ''
        };
        this.filteredMainInventory = [];
    }

    /**
     * Renderiza la página
     */
    render(container) {
        this.container = container;
        this.stores = Stores.getAll();
        this.currentView = 'list';
        this.currentStoreId = null;

        this.renderContent();
        this.bindEvents();
    }

    /**
     * Renderiza el contenido HTML según la vista actual
     */
    renderContent() {
        if (this.currentView === 'detail' && this.currentStoreId) {
            this.renderStoreDetail();
        } else {
            this.renderStoresList();
        }
    }

    /**
     * Renderiza la lista de tiendas
     */
    renderStoresList() {
        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Tiendas</h1>
                    <p class="page-description">Gestiona Casa Matriz y Sucursales</p>
                </div>
                <div class="page-header-actions">
                    <button class="btn btn-primary" id="btn-new-store">
                        ${ICONS.plus}
                        <span>Nueva Tienda</span>
                    </button>
                </div>
            </div>

            <!-- Grid de tiendas -->
            <div id="stores-container">
                ${this.renderStoresGrid()}
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Renderiza la página de detalle de una tienda
     */
    renderStoreDetail() {
        const store = Stores.getById(this.currentStoreId);
        if (!store) {
            this.goBackToList();
            return;
        }

        const isMatriz = store.tipo === STORE_TYPES.MATRIZ;
        this.storeInventory = store.inventory || [];
        this.mainInventory = Inventory.getAll();
        this.selectedProducts = new Map();
        this.detailCurrentPage = 1;
        this.filteredMainInventory = [...this.mainInventory];
        
        // Calcular estadísticas de la tienda
        const storeStats = this.getStoreStats(store);
        const brands = Inventory.getBrands();

        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <button class="btn btn-ghost btn-back" id="btn-back-to-list">
                        ${ICONS.arrowLeft}
                        <span>Volver</span>
                    </button>
                    <h1 class="page-title">${store.nombre}</h1>
                    <p class="page-description">
                        <span class="store-type-badge ${isMatriz ? 'matriz' : 'sucursal'}">${store.tipo}</span>
                        ${store.ciudad ? ` • ${store.ciudad}` : ''}
                        ${store.encargado ? ` • ${store.encargado}` : ''}
                    </p>
                </div>
            </div>

            <!-- Estadísticas de la tienda -->
            <div class="store-detail-stats">
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon primary">
                        ${ICONS.package}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="store-stat-products">${storeStats.totalProductos}</div>
                        <div class="inventory-stat-label">Productos en Tienda</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon success">
                        ${ICONS.layers}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="store-stat-units">${storeStats.totalUnidades}</div>
                        <div class="inventory-stat-label">Unidades Totales</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon warning">
                        ${ICONS.dollarSign}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="store-stat-cost">${Currency.format(storeStats.costoTotal)}</div>
                        <div class="inventory-stat-label">Costo Total</div>
                    </div>
                </div>
                <div class="inventory-stat-card">
                    <div class="inventory-stat-icon info">
                        ${ICONS.truck}
                    </div>
                    <div class="inventory-stat-content">
                        <div class="inventory-stat-value" id="store-stat-selected">0</div>
                        <div class="inventory-stat-label">Seleccionados para Enviar</div>
                    </div>
                </div>
            </div>

            <!-- Tabs para navegación -->
            <div class="store-detail-tabs">
                <button class="store-tab active" data-tab="send">
                    ${ICONS.send}
                    <span>Enviar Productos</span>
                </button>
                <button class="store-tab" data-tab="inventory">
                    ${ICONS.package}
                    <span>Inventario de Tienda</span>
                </button>
            </div>

            <!-- Contenido de tabs -->
            <div class="store-detail-content">
                <!-- Tab: Enviar Productos -->
                <div class="store-tab-content active" id="tab-send">
                    <div class="send-products-container">
                        <!-- Toolbar de búsqueda -->
                        <div class="table-toolbar">
                            <div class="table-toolbar-left">
                                <div class="table-search">
                                    <span class="table-search-icon">${ICONS.search}</span>
                                    <input type="text" class="table-search-input" id="send-search-input" placeholder="Buscar por marca o amperaje...">
                                </div>
                                <select id="send-filter-marca" class="filter-select">
                                    <option value="">Todas las marcas</option>
                                    ${brands.map(b => `<option value="${b}">${b}</option>`).join('')}
                                </select>
                            </div>
                            <div class="table-toolbar-right">
                                <button class="btn btn-primary" id="btn-send-selected" disabled>
                                    ${ICONS.send}
                                    <span>Enviar Seleccionados (<span id="selected-count">0</span>)</span>
                                </button>
                            </div>
                        </div>

                        <!-- Tabla de productos disponibles -->
                        <div class="table-wrapper">
                            <table class="data-table" id="send-products-table">
                                <thead>
                                    <tr>
                                        <th class="col-checkbox">
                                            <button class="select-all-btn" id="select-all-btn" title="Seleccionar todos">
                                                ${ICONS.square}
                                            </button>
                                        </th>
                                        <th>Marca</th>
                                        <th>Amperaje</th>
                                        <th class="col-number">Disponible</th>
                                        <th class="col-number">Cantidad a Enviar</th>
                                        <th class="col-currency">Costo Unit.</th>
                                        <th class="col-currency">Total</th>
                                    </tr>
                                </thead>
                                <tbody id="send-products-tbody">
                                </tbody>
                            </table>
                        </div>

                        <!-- Paginación -->
                        <div class="table-pagination" id="send-pagination">
                        </div>
                    </div>
                </div>

                <!-- Tab: Inventario de Tienda -->
                <div class="store-tab-content" id="tab-inventory">
                    <div class="store-inventory-container">
                        ${this.renderStoreInventoryTable(store)}
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.bindStoreDetailEvents();
        this.loadSendProductsTable();
    }

    /**
     * Calcula estadísticas de la tienda
     */
    getStoreStats(store) {
        const inventory = store.inventory || [];
        return {
            totalProductos: inventory.length,
            totalUnidades: inventory.reduce((sum, item) => sum + item.cantidad, 0),
            costoTotal: inventory.reduce((sum, item) => sum + (item.costo * item.cantidad), 0),
            valorVenta: inventory.reduce((sum, item) => sum + (item.precioVenta * item.cantidad), 0)
        };
    }

    /**
     * Renderiza la tabla de inventario de la tienda
     */
    renderStoreInventoryTable(store) {
        const inventory = store.inventory || [];
        
        if (inventory.length === 0) {
            return `
                <div class="table-empty">
                    <div class="table-empty-icon">${ICONS.emptyBox}</div>
                    <div class="table-empty-title">Sin inventario</div>
                    <div class="table-empty-text">Esta tienda aún no tiene productos. Usa la pestaña "Enviar Productos" para agregar stock.</div>
                </div>
            `;
        }

        return `
            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Amperaje</th>
                            <th class="col-number">Cantidad</th>
                            <th class="col-currency">Costo Unit.</th>
                            <th class="col-currency">Precio Venta</th>
                            <th class="col-currency">Costo Total</th>
                            <th class="col-currency">Valor Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventory.map(item => `
                            <tr>
                                <td>${item.marca}</td>
                                <td>${item.amperaje}</td>
                                <td class="col-number">${item.cantidad}</td>
                                <td class="col-currency">${Currency.format(item.costo)}</td>
                                <td class="col-currency">${Currency.format(item.precioVenta)}</td>
                                <td class="col-currency">${Currency.format(item.costo * item.cantidad)}</td>
                                <td class="col-currency">${Currency.format(item.precioVenta * item.cantidad)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="totals-row">
                            <td colspan="2"><strong>TOTALES</strong></td>
                            <td class="col-number"><strong>${inventory.reduce((s, i) => s + i.cantidad, 0)}</strong></td>
                            <td></td>
                            <td></td>
                            <td class="col-currency"><strong>${Currency.format(inventory.reduce((s, i) => s + (i.costo * i.cantidad), 0))}</strong></td>
                            <td class="col-currency"><strong>${Currency.format(inventory.reduce((s, i) => s + (i.precioVenta * i.cantidad), 0))}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }

    /**
     * Carga la tabla de productos para enviar
     */
    loadSendProductsTable() {
        this.applyDetailFilters();
        this.renderSendProductsTable();
        this.renderSendPagination();
    }

    /**
     * Aplica filtros a la tabla de envío
     */
    applyDetailFilters() {
        let filtered = [...this.mainInventory];

        // Filtrar por búsqueda
        if (this.detailFilters.search) {
            const search = this.detailFilters.search.toLowerCase();
            filtered = filtered.filter(item => 
                item.marca.toLowerCase().includes(search) ||
                item.amperaje.toLowerCase().includes(search)
            );
        }

        // Filtrar por marca
        if (this.detailFilters.marca) {
            filtered = filtered.filter(item => item.marca === this.detailFilters.marca);
        }

        // Solo mostrar productos con stock disponible
        filtered = filtered.filter(item => item.cantidad > 0);

        this.filteredMainInventory = filtered;
    }

    /**
     * Renderiza la tabla de productos para enviar
     */
    renderSendProductsTable() {
        const tbody = document.getElementById('send-products-tbody');
        if (!tbody) return;

        const start = (this.detailCurrentPage - 1) * this.detailItemsPerPage;
        const end = start + this.detailItemsPerPage;
        const pageData = this.filteredMainInventory.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="table-empty">
                            <div class="table-empty-icon">${ICONS.emptyBox}</div>
                            <div class="table-empty-title">No hay productos disponibles</div>
                            <div class="table-empty-text">
                                ${this.mainInventory.length === 0 
                                    ? 'El inventario principal está vacío' 
                                    : 'No se encontraron productos con los filtros aplicados'}
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageData.map(item => {
            const selectedQty = this.selectedProducts.get(item.id) || 0;
            const isSelected = selectedQty > 0;
            const totalCost = selectedQty * item.costo;

            return `
                <tr data-id="${item.id}" class="${isSelected ? 'row-selected' : ''}">
                    <td class="col-checkbox">
                        <button class="row-select-btn ${isSelected ? 'selected' : ''}" data-action="toggle-select" data-id="${item.id}">
                            ${isSelected ? ICONS.checkSquare : ICONS.square}
                        </button>
                    </td>
                    <td>${item.marca}</td>
                    <td>${item.amperaje}</td>
                    <td class="col-number">
                        <span class="stock-badge ${item.cantidad < 5 ? 'low' : ''}">${item.cantidad}</span>
                    </td>
                    <td class="col-number">
                        <div class="qty-input-group">
                            <button class="qty-btn minus" data-action="decrease" data-id="${item.id}" ${selectedQty <= 0 ? 'disabled' : ''}>
                                ${ICONS.minus}
                            </button>
                            <input type="number" 
                                   class="qty-input" 
                                   data-id="${item.id}" 
                                   value="${selectedQty}" 
                                   min="0" 
                                   max="${item.cantidad}"
                                   ${!isSelected ? 'disabled' : ''}>
                            <button class="qty-btn plus" data-action="increase" data-id="${item.id}" ${selectedQty >= item.cantidad ? 'disabled' : ''}>
                                ${ICONS.plus}
                            </button>
                        </div>
                    </td>
                    <td class="col-currency">${Currency.format(item.costo)}</td>
                    <td class="col-currency">
                        <span class="total-cost ${isSelected ? 'active' : ''}">${Currency.format(totalCost)}</span>
                    </td>
                </tr>
            `;
        }).join('');

        // Bind eventos de la tabla
        this.bindTableRowEvents();
    }

    /**
     * Vincula eventos a las filas de la tabla
     */
    bindTableRowEvents() {
        const tbody = document.getElementById('send-products-tbody');
        if (!tbody) return;

        // Botones de selección
        tbody.querySelectorAll('[data-action="toggle-select"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                this.toggleProductSelection(id);
            });
        });

        // Botones de cantidad
        tbody.querySelectorAll('[data-action="decrease"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.adjustQuantity(id, -1);
            });
        });

        tbody.querySelectorAll('[data-action="increase"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.adjustQuantity(id, 1);
            });
        });

        // Inputs de cantidad
        tbody.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = input.dataset.id;
                const value = parseInt(e.target.value) || 0;
                this.setQuantity(id, value);
            });
        });
    }

    /**
     * Alterna la selección de un producto
     */
    toggleProductSelection(productId) {
        const product = this.mainInventory.find(p => p.id === productId);
        if (!product) return;

        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            // Seleccionar con cantidad 1 por defecto
            this.selectedProducts.set(productId, 1);
        }

        this.updateSelectionUI();
        this.renderSendProductsTable();
    }

    /**
     * Ajusta la cantidad de un producto seleccionado
     */
    adjustQuantity(productId, delta) {
        const product = this.mainInventory.find(p => p.id === productId);
        if (!product) return;

        let currentQty = this.selectedProducts.get(productId) || 0;
        let newQty = currentQty + delta;

        // Validar límites
        newQty = Math.max(0, Math.min(newQty, product.cantidad));

        if (newQty === 0) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.set(productId, newQty);
        }

        this.updateSelectionUI();
        this.renderSendProductsTable();
    }

    /**
     * Establece la cantidad de un producto
     */
    setQuantity(productId, qty) {
        const product = this.mainInventory.find(p => p.id === productId);
        if (!product) return;

        qty = Math.max(0, Math.min(qty, product.cantidad));

        if (qty === 0) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.set(productId, qty);
        }

        this.updateSelectionUI();
        this.renderSendProductsTable();
    }

    /**
     * Selecciona todos los productos de la página actual
     */
    selectAllProducts() {
        const start = (this.detailCurrentPage - 1) * this.detailItemsPerPage;
        const end = start + this.detailItemsPerPage;
        const pageData = this.filteredMainInventory.slice(start, end);

        // Verificar si todos están seleccionados
        const allSelected = pageData.every(item => this.selectedProducts.has(item.id));

        if (allSelected) {
            // Deseleccionar todos de la página
            pageData.forEach(item => {
                this.selectedProducts.delete(item.id);
            });
        } else {
            // Seleccionar todos con cantidad 1
            pageData.forEach(item => {
                if (!this.selectedProducts.has(item.id)) {
                    this.selectedProducts.set(item.id, 1);
                }
            });
        }

        this.updateSelectionUI();
        this.renderSendProductsTable();
    }

    /**
     * Actualiza la UI de selección
     */
    updateSelectionUI() {
        const totalSelected = this.selectedProducts.size;
        const totalUnits = Array.from(this.selectedProducts.values()).reduce((sum, qty) => sum + qty, 0);

        // Actualizar contador
        const countEl = document.getElementById('selected-count');
        if (countEl) countEl.textContent = totalUnits;

        // Actualizar botón de envío
        const btnSend = document.getElementById('btn-send-selected');
        if (btnSend) btnSend.disabled = totalSelected === 0;

        // Actualizar stat de seleccionados
        const statSelected = document.getElementById('store-stat-selected');
        if (statSelected) statSelected.textContent = totalUnits;

        // Actualizar ícono de select all
        this.updateSelectAllIcon();
    }

    /**
     * Actualiza el ícono de seleccionar todos
     */
    updateSelectAllIcon() {
        const btn = document.getElementById('select-all-btn');
        if (!btn) return;

        const start = (this.detailCurrentPage - 1) * this.detailItemsPerPage;
        const end = start + this.detailItemsPerPage;
        const pageData = this.filteredMainInventory.slice(start, end);

        const selectedCount = pageData.filter(item => this.selectedProducts.has(item.id)).length;
        
        if (selectedCount === 0) {
            btn.innerHTML = ICONS.square;
        } else if (selectedCount === pageData.length) {
            btn.innerHTML = ICONS.checkSquare;
        } else {
            btn.innerHTML = ICONS.minusSquare;
        }
    }

    /**
     * Renderiza la paginación
     */
    renderSendPagination() {
        const container = document.getElementById('send-pagination');
        if (!container) return;

        const totalItems = this.filteredMainInventory.length;
        const totalPages = Math.ceil(totalItems / this.detailItemsPerPage);

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const startItem = (this.detailCurrentPage - 1) * this.detailItemsPerPage + 1;
        const endItem = Math.min(this.detailCurrentPage * this.detailItemsPerPage, totalItems);

        container.innerHTML = `
            <div class="pagination-info">
                Mostrando ${startItem}-${endItem} de ${totalItems} productos
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" id="prev-page" ${this.detailCurrentPage === 1 ? 'disabled' : ''}>
                    ${ICONS.chevronLeft}
                </button>
                <span class="pagination-current">Página ${this.detailCurrentPage} de ${totalPages}</span>
                <button class="pagination-btn" id="next-page" ${this.detailCurrentPage === totalPages ? 'disabled' : ''}>
                    ${ICONS.chevronRight}
                </button>
            </div>
        `;

        // Bind eventos de paginación
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.detailCurrentPage > 1) {
                this.detailCurrentPage--;
                this.renderSendProductsTable();
                this.renderSendPagination();
            }
        });

        document.getElementById('next-page')?.addEventListener('click', () => {
            if (this.detailCurrentPage < totalPages) {
                this.detailCurrentPage++;
                this.renderSendProductsTable();
                this.renderSendPagination();
            }
        });
    }

    /**
     * Bindea eventos de la vista de detalle
     */
    bindStoreDetailEvents() {
        // Botón volver
        document.getElementById('btn-back-to-list')?.addEventListener('click', () => {
            this.goBackToList();
        });

        // Tabs
        document.querySelectorAll('.store-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Búsqueda
        const searchInput = document.getElementById('send-search-input');
        searchInput?.addEventListener('input', debounce((e) => {
            this.detailFilters.search = e.target.value;
            this.detailCurrentPage = 1;
            this.loadSendProductsTable();
        }, 300));

        // Filtro de marca
        document.getElementById('send-filter-marca')?.addEventListener('change', (e) => {
            this.detailFilters.marca = e.target.value;
            this.detailCurrentPage = 1;
            this.loadSendProductsTable();
        });

        // Seleccionar todos
        document.getElementById('select-all-btn')?.addEventListener('click', () => {
            this.selectAllProducts();
        });

        // Botón enviar
        document.getElementById('btn-send-selected')?.addEventListener('click', () => {
            this.confirmSendProducts();
        });
    }

    /**
     * Cambia entre tabs
     */
    switchTab(tabId) {
        // Actualizar botones
        document.querySelectorAll('.store-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Actualizar contenido
        document.querySelectorAll('.store-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });

        // Refrescar inventario de tienda si es necesario
        if (tabId === 'inventory') {
            const store = Stores.getById(this.currentStoreId);
            if (store) {
                const container = document.querySelector('.store-inventory-container');
                if (container) {
                    container.innerHTML = this.renderStoreInventoryTable(store);
                }
            }
        }
    }

    /**
     * Confirma el envío de productos
     */
    confirmSendProducts() {
        if (this.selectedProducts.size === 0) {
            Notifications.warning('Selecciona al menos un producto para enviar');
            return;
        }

        const store = Stores.getById(this.currentStoreId);
        if (!store) return;

        // Construir resumen
        let totalUnits = 0;
        let totalCost = 0;
        const items = [];

        this.selectedProducts.forEach((qty, productId) => {
            const product = this.mainInventory.find(p => p.id === productId);
            if (product) {
                totalUnits += qty;
                totalCost += qty * product.costo;
                items.push({ product, qty });
            }
        });

        const summaryHtml = `
            <div class="send-confirm-summary">
                <p class="send-confirm-text">¿Estás seguro de enviar los siguientes productos a <strong>${store.nombre}</strong>?</p>
                
                <div class="send-confirm-items">
                    ${items.slice(0, 5).map(({ product, qty }) => `
                        <div class="send-confirm-item">
                            <span class="item-name">${product.marca} ${product.amperaje}</span>
                            <span class="item-qty">x${qty}</span>
                        </div>
                    `).join('')}
                    ${items.length > 5 ? `<div class="send-confirm-more">... y ${items.length - 5} productos más</div>` : ''}
                </div>

                <div class="send-confirm-totals">
                    <div class="send-confirm-total">
                        <span>Total Productos:</span>
                        <strong>${items.length}</strong>
                    </div>
                    <div class="send-confirm-total">
                        <span>Total Unidades:</span>
                        <strong>${totalUnits}</strong>
                    </div>
                    <div class="send-confirm-total">
                        <span>Costo Total:</span>
                        <strong>${Currency.format(totalCost)}</strong>
                    </div>
                </div>
            </div>
        `;

        Modal.confirm({
            title: 'Confirmar Envío',
            message: summaryHtml,
            confirmText: 'Enviar Productos',
            cancelText: 'Cancelar',
            type: 'primary',
            onConfirm: () => this.executeSendProducts()
        });
    }

    /**
     * Ejecuta el envío de productos
     */
    executeSendProducts() {
        try {
            const items = [];
            this.selectedProducts.forEach((cantidad, productId) => {
                items.push({ productId, cantidad });
            });

            const transfer = Stores.sendProducts(this.currentStoreId, items);
            
            Notifications.success(`Se enviaron ${transfer.totalUnidades} unidades correctamente`);
            
            // Limpiar selección y refrescar
            this.selectedProducts.clear();
            this.mainInventory = Inventory.getAll();
            
            // Actualizar stats
            const store = Stores.getById(this.currentStoreId);
            if (store) {
                this.storeInventory = store.inventory || [];
                this.updateStoreStats(store);
            }
            
            this.loadSendProductsTable();
            this.updateSelectionUI();

        } catch (error) {
            Notifications.error(error.message);
        }
    }

    /**
     * Actualiza las estadísticas de la tienda
     */
    updateStoreStats(store) {
        const stats = this.getStoreStats(store);
        
        const statProducts = document.getElementById('store-stat-products');
        const statUnits = document.getElementById('store-stat-units');
        const statCost = document.getElementById('store-stat-cost');

        if (statProducts) statProducts.textContent = stats.totalProductos;
        if (statUnits) statUnits.textContent = stats.totalUnidades;
        if (statCost) statCost.textContent = Currency.format(stats.costoTotal);
    }

    /**
     * Vuelve a la lista de tiendas
     */
    goBackToList() {
        this.currentView = 'list';
        this.currentStoreId = null;
        this.stores = Stores.getAll();
        this.renderContent();
        this.bindEvents();
    }

    /**
     * Entra a una tienda
     */
    enterStore(storeId) {
        this.currentView = 'detail';
        this.currentStoreId = storeId;
        this.renderContent();
    }

    /**
     * Renderiza el grid de tiendas
     */
    renderStoresGrid() {
        if (this.stores.length === 0) {
            return `
                <div class="stores-empty">
                    <div class="stores-empty-icon">${ICONS.store}</div>
                    <h3 class="stores-empty-title">No hay tiendas registradas</h3>
                    <p class="stores-empty-text">Crea tu primera tienda para comenzar a gestionar tu red de distribución</p>
                    <button class="btn btn-primary" id="btn-new-store-empty">
                        ${ICONS.plus}
                        <span>Crear Primera Tienda</span>
                    </button>
                </div>
            `;
        }

        // Ordenar: Casa Matriz primero, luego sucursales por nombre
        const sortedStores = [...this.stores].sort((a, b) => {
            if (a.tipo === STORE_TYPES.MATRIZ) return -1;
            if (b.tipo === STORE_TYPES.MATRIZ) return 1;
            return a.nombre.localeCompare(b.nombre);
        });

        return `
            <div class="stores-grid">
                ${sortedStores.map(store => this.renderStoreCard(store)).join('')}
            </div>
        `;
    }

    /**
     * Renderiza una card de tienda
     */
    renderStoreCard(store) {
        const isMatriz = store.tipo === STORE_TYPES.MATRIZ;
        const totalUnidades = (store.inventory || []).reduce((sum, item) => sum + item.cantidad, 0);
        const totalProductos = (store.inventory || []).length;

        return `
            <div class="store-card" data-id="${store.id}">
                <div class="store-card-header">
                    <h3 class="store-card-title">${store.nombre}</h3>
                    <span class="store-card-badge ${isMatriz ? 'matriz' : 'sucursal'}">
                        ${store.tipo}
                    </span>
                </div>
                
                <div class="store-card-info">
                    ${store.encargado ? `
                        <div class="store-card-info-item">
                            ${ICONS.user}
                            <span>${store.encargado}</span>
                        </div>
                    ` : ''}
                    ${store.ciudad ? `
                        <div class="store-card-info-item">
                            ${ICONS.mapPin}
                            <span>${store.ciudad}</span>
                        </div>
                    ` : ''}
                    ${store.direccion ? `
                        <div class="store-card-info-item">
                            ${ICONS.building}
                            <span>${store.direccion}</span>
                        </div>
                    ` : ''}
                </div>

                <div class="store-card-stats">
                    <div class="store-card-stat">
                        <div class="store-card-stat-value">${totalProductos}</div>
                        <div class="store-card-stat-label">Productos</div>
                    </div>
                    <div class="store-card-stat">
                        <div class="store-card-stat-value">${totalUnidades}</div>
                        <div class="store-card-stat-label">Unidades</div>
                    </div>
                </div>

                <div class="store-card-actions">
                    <button class="btn btn-primary btn-sm" data-action="enter" data-id="${store.id}" title="Ingresar a tienda">
                        ${ICONS.login}
                        <span>Ingresar</span>
                    </button>
                    <button class="btn btn-outline btn-sm" data-action="edit" data-id="${store.id}" title="Editar">
                        ${ICONS.edit}
                    </button>
                    <button class="btn btn-outline btn-sm" data-action="delete" data-id="${store.id}" title="Eliminar">
                        ${ICONS.trash}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Bindea eventos
     */
    bindEvents() {
        // Botón nueva tienda
        document.getElementById('btn-new-store')?.addEventListener('click', () => {
            this.showStoreModal();
        });

        document.getElementById('btn-new-store-empty')?.addEventListener('click', () => {
            this.showStoreModal();
        });

        // Eventos de cards
        this.container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;

                switch (action) {
                    case 'enter':
                        this.enterStore(id);
                        break;
                    case 'edit':
                        this.showStoreModal(id);
                        break;
                    case 'delete':
                        this.confirmDeleteStore(id);
                        break;
                }
            });
        });
    }

    /**
     * Muestra modal para crear/editar tienda
     */
    showStoreModal(storeId = null) {
        const store = storeId ? Stores.getById(storeId) : null;
        const isEdit = !!store;
        const title = isEdit ? 'Editar Tienda' : 'Nueva Tienda';

        // Verificar si ya existe Casa Matriz
        const hasMatriz = this.stores.some(s => s.tipo === STORE_TYPES.MATRIZ && s.id !== storeId);

        const content = `
            <form id="store-form" class="form">
                <div class="form-group">
                    <label class="form-label required" for="store-nombre">Nombre de la Tienda</label>
                    <input type="text" id="store-nombre" placeholder="Ej: Sucursal Centro" value="${store?.nombre || ''}" required>
                </div>

                <div class="form-group">
                    <label class="form-label required" for="store-tipo">Tipo</label>
                    <select id="store-tipo" required>
                        <option value="">Seleccione tipo</option>
                        <option value="${STORE_TYPES.MATRIZ}" ${store?.tipo === STORE_TYPES.MATRIZ ? 'selected' : ''} ${hasMatriz && store?.tipo !== STORE_TYPES.MATRIZ ? 'disabled' : ''}>
                            ${STORE_TYPES.MATRIZ} ${hasMatriz && store?.tipo !== STORE_TYPES.MATRIZ ? '(Ya existe)' : ''}
                        </option>
                        <option value="${STORE_TYPES.SUCURSAL}" ${store?.tipo === STORE_TYPES.SUCURSAL ? 'selected' : ''}>
                            ${STORE_TYPES.SUCURSAL}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="store-encargado">Encargado</label>
                    <input type="text" id="store-encargado" placeholder="Nombre del encargado" value="${store?.encargado || ''}">
                </div>

                <div class="form-group">
                    <label class="form-label" for="store-ciudad">Ciudad</label>
                    <input type="text" id="store-ciudad" placeholder="Ciudad" value="${store?.ciudad || ''}">
                </div>

                <div class="form-group">
                    <label class="form-label" for="store-direccion">Dirección</label>
                    <textarea id="store-direccion" rows="2" placeholder="Dirección completa">${store?.direccion || ''}</textarea>
                </div>
            </form>
        `;

        const modalId = Modal.open({
            title,
            content,
            size: 'default',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="btn-cancel-store">Cancelar</button>
                <button class="btn btn-primary" id="btn-save-store">${isEdit ? 'Guardar Cambios' : 'Crear Tienda'}</button>
            `
        });

        document.getElementById('btn-cancel-store')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        document.getElementById('btn-save-store')?.addEventListener('click', () => {
            this.saveStore(modalId, storeId);
        });

        document.getElementById('store-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStore(modalId, storeId);
        });
    }

    /**
     * Guarda una tienda
     */
    saveStore(modalId, storeId = null) {
        const nombre = document.getElementById('store-nombre')?.value.trim();
        const tipo = document.getElementById('store-tipo')?.value;
        const encargado = document.getElementById('store-encargado')?.value.trim();
        const ciudad = document.getElementById('store-ciudad')?.value.trim();
        const direccion = document.getElementById('store-direccion')?.value.trim();

        if (!nombre) {
            Notifications.warning('Ingresa el nombre de la tienda');
            return;
        }

        if (!tipo) {
            Notifications.warning('Selecciona el tipo de tienda');
            return;
        }

        try {
            if (storeId) {
                Stores.update(storeId, { nombre, tipo, encargado, ciudad, direccion });
                Notifications.success('Tienda actualizada correctamente');
            } else {
                Stores.add({ nombre, tipo, encargado, ciudad, direccion });
                Notifications.success('Tienda creada correctamente');
            }

            this.stores = Stores.getAll();
            this.renderContent();
            this.bindEvents();
            Modal.close(modalId);
        } catch (error) {
            Notifications.error(error.message);
        }
    }

    /**
     * Confirma eliminación de tienda
     */
    confirmDeleteStore(storeId) {
        const store = Stores.getById(storeId);
        if (!store) return;

        const totalUnidades = (store.inventory || []).reduce((sum, item) => sum + item.cantidad, 0);

        const content = `
            <div class="confirm-delete">
                <p>¿Estás seguro de eliminar esta tienda?</p>
                <div class="confirm-details">
                    <div><strong>Nombre:</strong> ${store.nombre}</div>
                    <div><strong>Tipo:</strong> ${store.tipo}</div>
                    <div><strong>Inventario:</strong> ${totalUnidades} unidades</div>
                </div>
                ${totalUnidades > 0 ? '<p class="confirm-warning">Esta tienda tiene inventario. Debes transferirlo primero.</p>' : ''}
            </div>
        `;

        const modalId = Modal.open({
            title: 'Eliminar Tienda',
            content,
            size: 'small',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="btn-cancel-delete">Cancelar</button>
                <button class="btn btn-danger" id="btn-confirm-delete" ${totalUnidades > 0 ? 'disabled' : ''}>Eliminar</button>
            `
        });

        document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
            try {
                Stores.delete(storeId);
                Notifications.success('Tienda eliminada correctamente');
                this.stores = Stores.getAll();
                this.renderContent();
                this.bindEvents();
            } catch (error) {
                Notifications.error(error.message);
            }
            Modal.close(modalId);
        });
    }

    /**
     * Muestra modal para enviar productos
     */
    showSendProductsModal(storeId) {
        const store = Stores.getById(storeId);
        if (!store) return;

        const inventory = Inventory.getAll().filter(p => p.cantidad > 0);
        this.sendItems = [];

        const content = `
            <div class="send-products-form">
                <div class="send-products-store">
                    <div class="send-products-store-name">${store.nombre}</div>
                    <div class="send-products-store-type">${store.tipo}</div>
                </div>

                <!-- Selector rápido de productos -->
                <div class="send-products-selector">
                    <div class="form-group">
                        <label class="form-label">Marca</label>
                        <select id="send-marca">
                            <option value="">Seleccione</option>
                            ${Inventory.getBrands().map(b => `<option value="${b}">${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Amperaje</label>
                        <select id="send-amperaje">
                            <option value="">Seleccione</option>
                        </select>
                        <div class="input-help" id="send-stock-info"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cantidad</label>
                        <input type="number" id="send-cantidad" min="1" placeholder="Qty">
                    </div>
                    <button class="btn btn-primary btn-sm" id="btn-add-send-item">
                        ${ICONS.plus}
                    </button>
                </div>

                <!-- Lista de productos a enviar -->
                <div class="send-products-list" id="send-items-list">
                    <div class="send-products-empty">
                        Agrega productos para enviar
                    </div>
                </div>

                <!-- Resumen -->
                <div class="send-products-summary">
                    <div class="send-products-summary-label">Total a enviar</div>
                    <div class="send-products-summary-value" id="send-total">0 unidades</div>
                </div>
            </div>
        `;

        const modalId = Modal.open({
            title: 'Enviar Productos',
            content,
            size: 'large',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="btn-cancel-send">Cancelar</button>
                <button class="btn btn-primary" id="btn-confirm-send">
                    ${ICONS.send}
                    <span>Enviar Productos</span>
                </button>
            `
        });

        // Eventos
        document.getElementById('send-marca')?.addEventListener('change', () => {
            this.updateSendAmperajes();
        });

        document.getElementById('send-amperaje')?.addEventListener('change', () => {
            this.updateSendStockInfo();
        });

        document.getElementById('btn-add-send-item')?.addEventListener('click', () => {
            this.addSendItem();
        });

        document.getElementById('btn-cancel-send')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        document.getElementById('btn-confirm-send')?.addEventListener('click', () => {
            this.confirmSendProducts(storeId, modalId);
        });
    }

    /**
     * Actualiza select de amperajes para envío
     */
    updateSendAmperajes() {
        const marca = document.getElementById('send-marca')?.value;
        const select = document.getElementById('send-amperaje');
        if (!select) return;

        const amperajes = Inventory.getAmperajes(marca || null);
        select.innerHTML = `<option value="">Seleccione</option>` +
            amperajes.map(a => `<option value="${a}">${a}</option>`).join('');
        
        this.updateSendStockInfo();
    }

    /**
     * Actualiza info de stock para envío
     */
    updateSendStockInfo() {
        const marca = document.getElementById('send-marca')?.value;
        const amperaje = document.getElementById('send-amperaje')?.value;
        const info = document.getElementById('send-stock-info');
        
        if (!info) return;

        if (marca && amperaje) {
            const product = Inventory.findByMarcaAmperaje(marca, amperaje);
            if (product) {
                const enLista = this.sendItems
                    .filter(i => i.productId === product.id)
                    .reduce((sum, i) => sum + i.cantidad, 0);
                const disponible = product.cantidad - enLista;
                info.textContent = `Disponible: ${disponible}`;
                info.style.color = disponible > 0 ? 'var(--text-muted)' : 'var(--color-error)';
            } else {
                info.textContent = '';
            }
        } else {
            info.textContent = '';
        }
    }

    /**
     * Agrega item a la lista de envío
     */
    addSendItem() {
        const marca = document.getElementById('send-marca')?.value;
        const amperaje = document.getElementById('send-amperaje')?.value;
        const cantidad = parseInt(document.getElementById('send-cantidad')?.value) || 0;

        if (!marca || !amperaje) {
            Notifications.warning('Selecciona marca y amperaje');
            return;
        }

        if (cantidad <= 0) {
            Notifications.warning('Ingresa una cantidad válida');
            return;
        }

        const product = Inventory.findByMarcaAmperaje(marca, amperaje);
        if (!product) {
            Notifications.error('Producto no encontrado');
            return;
        }

        // Verificar stock disponible
        const enLista = this.sendItems
            .filter(i => i.productId === product.id)
            .reduce((sum, i) => sum + i.cantidad, 0);
        const disponible = product.cantidad - enLista;

        if (cantidad > disponible) {
            Notifications.error(`Stock insuficiente. Disponible: ${disponible}`);
            return;
        }

        // Agregar o actualizar item
        const existingIndex = this.sendItems.findIndex(i => i.productId === product.id);
        if (existingIndex !== -1) {
            this.sendItems[existingIndex].cantidad += cantidad;
        } else {
            this.sendItems.push({
                productId: product.id,
                marca: product.marca,
                amperaje: product.amperaje,
                cantidad,
                stockOriginal: product.cantidad
            });
        }

        // Limpiar cantidad
        document.getElementById('send-cantidad').value = '';
        
        this.renderSendItemsList();
        this.updateSendStockInfo();
    }

    /**
     * Renderiza lista de items a enviar
     */
    renderSendItemsList() {
        const container = document.getElementById('send-items-list');
        if (!container) return;

        if (this.sendItems.length === 0) {
            container.innerHTML = `<div class="send-products-empty">Agrega productos para enviar</div>`;
            document.getElementById('send-total').textContent = '0 unidades';
            return;
        }

        container.innerHTML = this.sendItems.map((item, index) => `
            <div class="send-products-item" data-index="${index}">
                <div class="send-products-item-info">
                    <span class="send-products-item-name">${item.marca} ${item.amperaje}</span>
                    <span class="send-products-item-stock">Stock: ${item.stockOriginal}</span>
                </div>
                <div class="send-products-item-qty">
                    <input type="number" value="${item.cantidad}" min="1" max="${item.stockOriginal}" data-index="${index}" class="send-qty-input">
                </div>
                <button class="send-products-item-remove" data-index="${index}">
                    ${ICONS.x}
                </button>
            </div>
        `).join('');

        // Eventos de cantidad
        container.querySelectorAll('.send-qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const val = parseInt(e.target.value) || 1;
                const item = this.sendItems[index];
                
                // Recalcular disponible
                const enOtros = this.sendItems
                    .filter((i, idx) => i.productId === item.productId && idx !== index)
                    .reduce((sum, i) => sum + i.cantidad, 0);
                const disponible = item.stockOriginal - enOtros;

                if (val > disponible) {
                    e.target.value = disponible;
                    this.sendItems[index].cantidad = disponible;
                } else if (val < 1) {
                    e.target.value = 1;
                    this.sendItems[index].cantidad = 1;
                } else {
                    this.sendItems[index].cantidad = val;
                }

                this.updateSendTotal();
            });
        });

        // Eventos de eliminar
        container.querySelectorAll('.send-products-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                this.sendItems.splice(index, 1);
                this.renderSendItemsList();
                this.updateSendStockInfo();
            });
        });

        this.updateSendTotal();
    }

    /**
     * Actualiza total de envío
     */
    updateSendTotal() {
        const total = this.sendItems.reduce((sum, item) => sum + item.cantidad, 0);
        const el = document.getElementById('send-total');
        if (el) {
            el.textContent = `${total} unidad${total !== 1 ? 'es' : ''}`;
        }
    }

    /**
     * Confirma y ejecuta el envío
     */
    confirmSendProducts(storeId, modalId) {
        if (this.sendItems.length === 0) {
            Notifications.warning('Agrega al menos un producto para enviar');
            return;
        }

        try {
            const transfer = Stores.sendProducts(storeId, this.sendItems);
            Notifications.success(`Enviadas ${transfer.totalUnidades} unidades correctamente`);
            
            this.stores = Stores.getAll();
            this.sendItems = [];
            this.renderContent();
            this.bindEvents();
            Modal.close(modalId);
        } catch (error) {
            Notifications.error(error.message);
        }
    }

    /**
     * Muestra inventario de una tienda
     */
    showStoreInventory(storeId) {
        const store = Stores.getById(storeId);
        if (!store) return;

        const inventory = store.inventory || [];
        const totalUnidades = inventory.reduce((sum, item) => sum + item.cantidad, 0);

        const content = `
            <div class="store-inventory">
                <div class="send-products-store">
                    <div class="send-products-store-name">${store.nombre}</div>
                    <div class="send-products-store-type">${store.tipo} • ${totalUnidades} unidades</div>
                </div>

                ${inventory.length === 0 ? `
                    <div class="table-empty" style="padding: var(--spacing-lg);">
                        <div class="table-empty-icon">${ICONS.package}</div>
                        <div class="table-empty-title">Sin inventario</div>
                        <div class="table-empty-text">Esta tienda aún no tiene productos</div>
                    </div>
                ` : `
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Amperaje</th>
                                    <th class="col-number">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${inventory.map(item => `
                                    <tr>
                                        <td>${item.marca}</td>
                                        <td>${item.amperaje}</td>
                                        <td class="col-number">${item.cantidad}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;

        const modalId = Modal.open({
            title: 'Inventario de Tienda',
            content,
            size: 'default',
            showFooter: true,
            footerContent: `
                <button class="btn btn-primary" id="btn-close-inventory">Cerrar</button>
            `
        });

        document.getElementById('btn-close-inventory')?.addEventListener('click', () => {
            Modal.close(modalId);
        });
    }

    /**
     * Muestra página de tienda en desarrollo
     */
    showStoreDevelopment(storeId) {
        const store = Stores.getById(storeId);
        if (!store) return;

        const content = `
            <div class="page-development" style="padding: var(--spacing-xl);">
                <div class="page-development-icon">
                    ${ICONS.tool}
                </div>
                <h2 class="page-development-title">En Desarrollo</h2>
                <p class="page-development-subtitle">Esta funcionalidad estará disponible próximamente</p>
                <p class="page-development-text">Estamos trabajando para traerte la mejor experiencia de gestión para <strong>${store.nombre}</strong>.</p>
            </div>
        `;

        const modalId = Modal.open({
            title: store.nombre,
            content,
            size: 'default',
            showFooter: true,
            footerContent: `
                <button class="btn btn-primary" id="btn-close-dev">Cerrar</button>
            `
        });

        document.getElementById('btn-close-dev')?.addEventListener('click', () => {
            Modal.close(modalId);
        });
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

export default StoresPage;
