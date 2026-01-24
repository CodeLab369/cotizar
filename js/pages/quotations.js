/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Cotizaciones
 * @version 1.0.0
 */

import Currency from '../utils/currency.js';
import Inventory from '../services/inventory.js';
import Quotations from '../services/quotations.js';
import Sales from '../services/sales.js';
import Settings from '../services/settings.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';

/**
 * Iconos SVG
 */
const ICONS = {
    fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    xCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    shoppingCart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    printer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`
};

/**
 * Clase para la página de Cotizaciones
 */
class QuotationsPage {
    constructor() {
        this.container = null;
        this.inventory = [];
        this.items = [];
        this.quotationsList = [];
        this.discount = 0;
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.editingQuotationId = null;
        this.statusFilter = 'all';
    }

    /**
     * Renderiza la página
     */
    render(container) {
        this.container = container;
        this.inventory = Inventory.getAll();
        this.quotationsList = Quotations.getAll();
        this.items = [];
        this.discount = 0;
        this.currentPage = 1;
        this.editingQuotationId = null;

        this.renderContent();
        this.bindEvents();
        this.populateBrandSelect();
        this.renderQuotationItemsTable();
        this.renderQuotationsTable();
        this.updateSummary();
        this.renderStats();
    }

    /**
     * Renderiza el contenido HTML
     */
    renderContent() {
        const config = Settings.getQuotationConfig();
        const stats = Quotations.getStats();

        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Cotizaciones</h1>
                    <p class="page-description">Crea y gestiona cotizaciones para tus clientes</p>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="quotation-stats" id="quotation-stats">
                <div class="stat-card">
                    <div class="stat-icon pending">${ICONS.clock}</div>
                    <div class="stat-info">
                        <div class="stat-value" id="stat-pending">${stats.pending}</div>
                        <div class="stat-label">Pendientes</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon success">${ICONS.check}</div>
                    <div class="stat-info">
                        <div class="stat-value" id="stat-accepted">${stats.accepted}</div>
                        <div class="stat-label">Aceptadas</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon converted">${ICONS.shoppingCart}</div>
                    <div class="stat-info">
                        <div class="stat-value" id="stat-converted">${stats.converted}</div>
                        <div class="stat-label">Convertidas</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon total">${ICONS.fileText}</div>
                    <div class="stat-info">
                        <div class="stat-value" id="stat-total">${stats.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
            </div>

            <div class="quotation-grid">
                <!-- Formulario de agregar productos -->
                <div class="card quotation-builder">
                    <div class="card-header">
                        <div class="card-title">Nueva Cotización</div>
                        <div class="card-subtitle">Selecciona productos del inventario</div>
                    </div>

                    <!-- Datos del cliente -->
                    <div class="client-section">
                        <div class="section-title">${ICONS.user} Datos del Cliente</div>
                        <div class="client-form">
                            <div class="form-group">
                                <label class="form-label" for="cliente-nombre">Nombre</label>
                                <input type="text" id="cliente-nombre" placeholder="Nombre del cliente">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="cliente-telefono">Teléfono</label>
                                <input type="tel" id="cliente-telefono" placeholder="Teléfono">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="cliente-email">Email</label>
                                <input type="email" id="cliente-email" placeholder="Email">
                            </div>
                        </div>
                    </div>

                    <!-- Productos -->
                    <div class="products-section">
                        <div class="section-title">Agregar Productos</div>
                        <div class="quotation-form">
                            <div class="form-group">
                                <label class="form-label required" for="quotation-marca">Marca</label>
                                <select id="quotation-marca" required>
                                    <option value="">Seleccione marca</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="quotation-amperaje">Amperaje</label>
                                <select id="quotation-amperaje" required>
                                    <option value="">Seleccione amperaje</option>
                                </select>
                                <div class="input-help" id="stock-info"></div>
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="quotation-cantidad">Cantidad</label>
                                <input type="number" id="quotation-cantidad" min="1" placeholder="Cantidad" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label required" for="quotation-precio">Precio Venta</label>
                                <input type="text" id="quotation-precio" placeholder="Precio" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Total</label>
                                <div class="quotation-total" id="quotation-total-linea">Bs. 0,00</div>
                            </div>
                            <div class="form-actions">
                                <button class="btn btn-primary" id="btn-add-item">
                                    ${ICONS.plus}
                                    <span>Agregar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Resumen de la cotización -->
                <div class="card quotation-summary">
                    <div class="card-header">
                        <div class="card-title">Resumen</div>
                        <div class="card-subtitle">Totales de la cotización</div>
                    </div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Total Baterías</div>
                            <div class="summary-value" id="summary-baterias">0</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Importe</div>
                            <div class="summary-value" id="summary-importe">Bs. 0,00</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Descuento (Bs.)</div>
                            <input type="text" id="summary-descuento" class="summary-input" placeholder="0,00">
                        </div>
                        <div class="summary-item highlight">
                            <div class="summary-label">Total Saldo</div>
                            <div class="summary-value" id="summary-saldo">Bs. 0,00</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Vigencia (días)</div>
                            <input type="number" id="summary-vigencia" class="summary-input" value="${config.vigenciaDias}" min="1" max="365">
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="btn btn-ghost" id="btn-clear-quotation">Limpiar</button>
                        <button class="btn btn-primary" id="btn-save-quotation">
                            ${ICONS.fileText}
                            <span>Crear Cotización</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Detalle de productos agregados -->
            <div class="card quotation-items-card">
                <div class="card-header">
                    <div class="card-title">Detalle de la cotización</div>
                    <div class="card-subtitle">Productos agregados</div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" id="quotation-items-table">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Amperaje</th>
                                <th class="col-number">Cantidad</th>
                                <th class="col-currency">Precio</th>
                                <th class="col-currency">Total</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="quotation-items-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- Listado de cotizaciones -->
            <div class="card quotations-list-card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Cotizaciones</div>
                        <div class="card-subtitle">Historial de cotizaciones</div>
                    </div>
                    <div class="table-toolbar-right">
                        <select id="quotations-status-filter" class="filter-select">
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="accepted">Aceptadas</option>
                            <option value="rejected">Rechazadas</option>
                            <option value="expired">Vencidas</option>
                            <option value="converted">Convertidas</option>
                        </select>
                        <span style="font-size: var(--font-size-sm); color: var(--text-muted);">Mostrar:</span>
                        <select id="quotations-items-per-page" class="pagination-select">
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                        </select>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" id="quotations-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th class="col-number">Unidades</th>
                                <th class="col-currency">Total</th>
                                <th>Estado</th>
                                <th>Vence</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="quotations-body"></tbody>
                    </table>
                </div>
                <div class="table-pagination" id="quotations-pagination"></div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Bindea eventos
     */
    bindEvents() {
        // Cambio de marca
        document.getElementById('quotation-marca')?.addEventListener('change', () => {
            this.populateAmperajeSelect();
            this.updateSuggestedPrice();
            this.updateStockInfo();
            this.updateLineTotal();
        });

        // Cambio de amperaje
        document.getElementById('quotation-amperaje')?.addEventListener('change', () => {
            this.updateSuggestedPrice();
            this.updateStockInfo();
            this.updateLineTotal();
        });

        // Cantidad
        document.getElementById('quotation-cantidad')?.addEventListener('input', () => {
            this.updateLineTotal();
        });

        // Precio
        document.getElementById('quotation-precio')?.addEventListener('input', (e) => {
            e.target.value = Currency.formatInput(e.target.value);
            this.updateLineTotal();
        });

        // Descuento
        document.getElementById('summary-descuento')?.addEventListener('input', (e) => {
            e.target.value = Currency.formatInput(e.target.value);
            this.discount = Currency.parse(e.target.value) || 0;
            this.updateSummary();
        });

        // Agregar producto
        document.getElementById('btn-add-item')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.addItemToQuotation();
        });

        // Limpiar cotización
        document.getElementById('btn-clear-quotation')?.addEventListener('click', () => {
            this.clearCurrentQuotation();
        });

        // Guardar cotización
        document.getElementById('btn-save-quotation')?.addEventListener('click', () => {
            this.saveQuotation();
        });

        // Filtro de estado
        document.getElementById('quotations-status-filter')?.addEventListener('change', (e) => {
            this.statusFilter = e.target.value;
            this.currentPage = 1;
            this.renderQuotationsTable();
        });

        // Paginación
        document.getElementById('quotations-items-per-page')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value) || 5;
            this.currentPage = 1;
            this.renderQuotationsTable();
        });
    }

    /**
     * Poblar select de marcas
     */
    populateBrandSelect() {
        const select = document.getElementById('quotation-marca');
        if (!select) return;
        
        const brands = Inventory.getBrands();
        select.innerHTML = `<option value="">Seleccione marca</option>` + 
            brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }

    /**
     * Poblar select de amperajes
     */
    populateAmperajeSelect() {
        const marca = document.getElementById('quotation-marca')?.value;
        const select = document.getElementById('quotation-amperaje');
        if (!select) return;
        
        const amperajes = Inventory.getAmperajes(marca || null);
        select.innerHTML = `<option value="">Seleccione amperaje</option>` + 
            amperajes.map(a => `<option value="${a}">${a}</option>`).join('');
    }

    /**
     * Obtiene el producto seleccionado
     */
    getSelectedProduct() {
        const marca = document.getElementById('quotation-marca')?.value;
        const amperaje = document.getElementById('quotation-amperaje')?.value;
        if (!marca || !amperaje) return null;
        return Inventory.findByMarcaAmperaje(marca, amperaje);
    }

    /**
     * Actualiza precio sugerido
     */
    updateSuggestedPrice() {
        const product = this.getSelectedProduct();
        const inputPrecio = document.getElementById('quotation-precio');
        if (product && inputPrecio && !inputPrecio.value) {
            inputPrecio.value = Currency.format(product.precioVenta, false);
        }
    }

    /**
     * Actualiza info de stock
     */
    updateStockInfo() {
        const info = document.getElementById('stock-info');
        const product = this.getSelectedProduct();
        if (!info) return;
        
        if (product) {
            info.textContent = `Stock disponible: ${product.cantidad}`;
            info.style.color = product.cantidad > 0 ? 'var(--text-secondary)' : 'var(--color-error)';
        } else {
            info.textContent = '';
        }
    }

    /**
     * Actualiza total de línea
     */
    updateLineTotal() {
        const cantidad = parseInt(document.getElementById('quotation-cantidad')?.value) || 0;
        const precio = Currency.parse(document.getElementById('quotation-precio')?.value) || 0;
        const total = Currency.format(cantidad * precio);
        const totalEl = document.getElementById('quotation-total-linea');
        if (totalEl) totalEl.textContent = total;
    }

    /**
     * Agrega producto a la cotización
     */
    addItemToQuotation() {
        const marca = document.getElementById('quotation-marca')?.value;
        const amperaje = document.getElementById('quotation-amperaje')?.value;
        
        if (!marca || !amperaje) {
            Notifications.warning('Selecciona una marca y amperaje');
            return;
        }

        const cantidad = parseInt(document.getElementById('quotation-cantidad')?.value) || 0;
        const precio = Currency.parse(document.getElementById('quotation-precio')?.value) || 0;

        if (cantidad <= 0) {
            Notifications.warning('Ingresa una cantidad válida');
            return;
        }
        if (precio <= 0) {
            Notifications.warning('Ingresa un precio de venta');
            return;
        }

        // Verificar si ya existe
        const existingIndex = this.items.findIndex(i => i.marca === marca && i.amperaje === amperaje);
        
        if (existingIndex !== -1) {
            const nuevoTotal = this.items[existingIndex].cantidad + cantidad;
            this.items[existingIndex].cantidad = nuevoTotal;
            this.items[existingIndex].precio = precio;
            this.items[existingIndex].total = Currency.round(nuevoTotal * precio);
            Notifications.success('Cantidad actualizada');
        } else {
            this.items.push({
                marca,
                amperaje,
                cantidad,
                precio,
                total: Currency.round(cantidad * precio)
            });
            Notifications.success('Producto agregado');
        }

        // Limpiar campos
        document.getElementById('quotation-cantidad').value = '';
        document.getElementById('quotation-precio').value = '';
        document.getElementById('quotation-total-linea').textContent = 'Bs. 0,00';

        this.renderQuotationItemsTable();
        this.updateSummary();
    }

    /**
     * Elimina item de la cotización
     */
    removeItem(index) {
        this.items.splice(index, 1);
        this.renderQuotationItemsTable();
        this.updateSummary();
        Notifications.info('Producto eliminado');
    }

    /**
     * Renderiza tabla de items
     */
    renderQuotationItemsTable() {
        const tbody = document.getElementById('quotation-items-body');
        if (!tbody) return;

        if (this.items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty">
                        <div class="empty-message">No hay productos agregados</div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.items.map((item, index) => `
            <tr>
                <td>${item.marca}</td>
                <td>${item.amperaje}</td>
                <td class="col-number">${item.cantidad}</td>
                <td class="col-currency">${Currency.format(item.precio)}</td>
                <td class="col-currency">${Currency.format(item.total)}</td>
                <td class="col-actions">
                    <button class="btn-icon btn-icon-danger" data-action="remove" data-index="${index}" title="Eliminar">
                        ${ICONS.trash}
                    </button>
                </td>
            </tr>
        `).join('');

        // Eventos de eliminar
        tbody.querySelectorAll('[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.removeItem(index);
            });
        });
    }

    /**
     * Actualiza resumen
     */
    updateSummary() {
        const totalBaterias = this.items.reduce((sum, item) => sum + item.cantidad, 0);
        const totalImporte = this.items.reduce((sum, item) => sum + item.total, 0);
        const totalSaldo = Math.max(0, totalImporte - this.discount);

        document.getElementById('summary-baterias').textContent = totalBaterias;
        document.getElementById('summary-importe').textContent = Currency.format(totalImporte);
        document.getElementById('summary-saldo').textContent = Currency.format(totalSaldo);
    }

    /**
     * Limpia la cotización actual
     */
    clearCurrentQuotation() {
        this.items = [];
        this.discount = 0;
        this.editingQuotationId = null;

        document.getElementById('cliente-nombre').value = '';
        document.getElementById('cliente-telefono').value = '';
        document.getElementById('cliente-email').value = '';
        document.getElementById('summary-descuento').value = '';
        document.getElementById('quotation-marca').value = '';
        document.getElementById('quotation-amperaje').innerHTML = '<option value="">Seleccione amperaje</option>';
        document.getElementById('quotation-cantidad').value = '';
        document.getElementById('quotation-precio').value = '';
        document.getElementById('quotation-total-linea').textContent = 'Bs. 0,00';
        document.getElementById('stock-info').textContent = '';

        const btnSave = document.getElementById('btn-save-quotation');
        if (btnSave) {
            btnSave.innerHTML = `${ICONS.fileText}<span>Crear Cotización</span>`;
        }

        this.renderQuotationItemsTable();
        this.updateSummary();
    }

    /**
     * Guarda la cotización
     */
    saveQuotation() {
        if (this.items.length === 0) {
            Notifications.warning('Agrega al menos un producto');
            return;
        }

        const vigencia = parseInt(document.getElementById('summary-vigencia')?.value) || 15;

        const quotationData = {
            items: this.items,
            descuento: this.discount,
            vigenciaDias: vigencia,
            clienteNombre: document.getElementById('cliente-nombre')?.value || '',
            clienteTelefono: document.getElementById('cliente-telefono')?.value || '',
            clienteEmail: document.getElementById('cliente-email')?.value || ''
        };

        try {
            if (this.editingQuotationId) {
                Quotations.update(this.editingQuotationId, quotationData);
                Notifications.success('Cotización actualizada');
            } else {
                const quotation = Quotations.create(quotationData);
                Notifications.success(`Cotización ${quotation.numero} creada`);
            }

            this.clearCurrentQuotation();
            this.quotationsList = Quotations.getAll();
            this.renderQuotationsTable();
            this.renderStats();
        } catch (error) {
            Notifications.error(error.message);
        }
    }

    /**
     * Renderiza estadísticas
     */
    renderStats() {
        const stats = Quotations.getStats();
        document.getElementById('stat-pending').textContent = stats.pending;
        document.getElementById('stat-accepted').textContent = stats.accepted;
        document.getElementById('stat-converted').textContent = stats.converted;
        document.getElementById('stat-total').textContent = stats.total;
    }

    /**
     * Renderiza tabla de cotizaciones
     */
    renderQuotationsTable() {
        const tbody = document.getElementById('quotations-body');
        if (!tbody) return;

        let filtered = this.quotationsList;
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(q => q.status === this.statusFilter);
        }

        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        if (this.currentPage > totalPages && totalPages > 0) {
            this.currentPage = totalPages;
        }

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(start, start + this.itemsPerPage);

        if (paginated.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="table-empty">
                        <div class="empty-message">No hay cotizaciones</div>
                    </td>
                </tr>
            `;
            document.getElementById('quotations-pagination').innerHTML = '';
            return;
        }

        tbody.innerHTML = paginated.map(q => {
            const statusClass = Quotations.getStatusColor(q.status);
            const statusLabel = Quotations.getStatusLabel(q.status);
            const expirationDate = new Date(q.expirationDate).toLocaleDateString('es-BO');
            const isExpiringSoon = q.status === 'pending' && (q.expirationDate - Date.now()) < (3 * 24 * 60 * 60 * 1000);

            return `
                <tr>
                    <td><strong>${q.numero}</strong></td>
                    <td>${new Date(q.date).toLocaleDateString('es-BO')}</td>
                    <td>${q.cliente?.nombre || '-'}</td>
                    <td class="col-number">${q.totalBaterias}</td>
                    <td class="col-currency">${Currency.format(q.totalSaldo)}</td>
                    <td>
                        <span class="status-badge status-${statusClass}">${statusLabel}</span>
                    </td>
                    <td class="${isExpiringSoon ? 'text-warning' : ''}">${expirationDate}</td>
                    <td class="col-actions">
                        <button class="btn-icon" data-action="view" data-id="${q.id}" title="Ver detalle">
                            ${ICONS.eye}
                        </button>
                        <button class="btn-icon" data-action="pdf" data-id="${q.id}" title="Generar PDF">
                            ${ICONS.printer}
                        </button>
                        ${q.status === 'pending' ? `
                            <button class="btn-icon btn-icon-success" data-action="accept" data-id="${q.id}" title="Marcar aceptada">
                                ${ICONS.check}
                            </button>
                            <button class="btn-icon btn-icon-danger" data-action="reject" data-id="${q.id}" title="Marcar rechazada">
                                ${ICONS.xCircle}
                            </button>
                        ` : ''}
                        ${q.status === 'accepted' ? `
                            <button class="btn-icon btn-icon-primary" data-action="convert" data-id="${q.id}" title="Convertir a venta">
                                ${ICONS.shoppingCart}
                            </button>
                        ` : ''}
                        ${q.status === 'pending' ? `
                            <button class="btn-icon btn-icon-danger" data-action="delete" data-id="${q.id}" title="Eliminar">
                                ${ICONS.trash}
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        // Bind actions
        this.bindTableActions(tbody);

        // Paginación
        this.renderPagination(totalPages, filtered.length);
    }

    /**
     * Bind acciones de tabla
     */
    bindTableActions(tbody) {
        tbody.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;

                switch (action) {
                    case 'view':
                        this.showQuotationDetail(id);
                        break;
                    case 'pdf':
                        this.generatePDF(id);
                        break;
                    case 'accept':
                        this.updateQuotationStatus(id, 'accepted');
                        break;
                    case 'reject':
                        this.updateQuotationStatus(id, 'rejected');
                        break;
                    case 'convert':
                        this.convertToSale(id);
                        break;
                    case 'delete':
                        this.deleteQuotation(id);
                        break;
                }
            });
        });
    }

    /**
     * Renderiza paginación
     */
    renderPagination(totalPages, totalItems) {
        const container = document.getElementById('quotations-pagination');
        if (!container) return;

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let pagesHtml = '';
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pagesHtml += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        container.innerHTML = `
            <div class="pagination-info">
                Mostrando ${((this.currentPage - 1) * this.itemsPerPage) + 1} - ${Math.min(this.currentPage * this.itemsPerPage, totalItems)} de ${totalItems}
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" id="quotations-btn-prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                    ${ICONS.chevronLeft}
                </button>
                <div class="pagination-pages">${pagesHtml}</div>
                <button class="pagination-btn" id="quotations-btn-next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    ${ICONS.chevronRight}
                </button>
            </div>
        `;

        // Bind pagination
        document.getElementById('quotations-btn-prev')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderQuotationsTable();
            }
        });

        document.getElementById('quotations-btn-next')?.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderQuotationsTable();
            }
        });

        container.querySelectorAll('.pagination-pages .pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderQuotationsTable();
            });
        });
    }

    /**
     * Muestra detalle de cotización
     */
    showQuotationDetail(id) {
        const quotation = Quotations.getById(id);
        if (!quotation) return;

        const statusClass = Quotations.getStatusColor(quotation.status);
        const statusLabel = Quotations.getStatusLabel(quotation.status);

        const content = `
            <div class="quotation-detail">
                <div class="detail-header">
                    <div class="detail-number">${quotation.numero}</div>
                    <span class="status-badge status-${statusClass}">${statusLabel}</span>
                </div>

                <div class="detail-section">
                    <h4>Información</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Fecha</span>
                            <span class="detail-value">${new Date(quotation.date).toLocaleString('es-BO')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Vence</span>
                            <span class="detail-value">${new Date(quotation.expirationDate).toLocaleDateString('es-BO')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Cliente</span>
                            <span class="detail-value">${quotation.cliente?.nombre || '-'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Teléfono</span>
                            <span class="detail-value">${quotation.cliente?.telefono || '-'}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Productos</h4>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Amperaje</th>
                                    <th class="col-number">Cantidad</th>
                                    <th class="col-currency">Precio</th>
                                    <th class="col-currency">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${quotation.items.map(item => `
                                    <tr>
                                        <td>${item.marca}</td>
                                        <td>${item.amperaje}</td>
                                        <td class="col-number">${item.cantidad}</td>
                                        <td class="col-currency">${Currency.format(item.precio)}</td>
                                        <td class="col-currency">${Currency.format(item.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="detail-totals">
                    <div class="total-row">
                        <span>Total Baterías</span>
                        <span>${quotation.totalBaterias}</span>
                    </div>
                    <div class="total-row">
                        <span>Total Importe</span>
                        <span>${Currency.format(quotation.totalImporte)}</span>
                    </div>
                    <div class="total-row">
                        <span>Descuento</span>
                        <span>${Currency.format(quotation.descuento)}</span>
                    </div>
                    <div class="total-row highlight">
                        <span>Total Saldo</span>
                        <span>${Currency.format(quotation.totalSaldo)}</span>
                    </div>
                </div>
            </div>
        `;

        Modal.open({
            title: 'Detalle de Cotización',
            content,
            size: 'lg',
            showFooter: true,
            footerContent: `
                <button class="btn btn-outline" id="btn-detail-pdf">${ICONS.printer} Generar PDF</button>
                <button class="btn btn-primary" id="btn-detail-close">Cerrar</button>
            `
        });

        document.getElementById('btn-detail-close')?.addEventListener('click', () => Modal.closeAll());
        document.getElementById('btn-detail-pdf')?.addEventListener('click', () => {
            Modal.closeAll();
            this.generatePDF(id);
        });
    }

    /**
     * Actualiza estado de cotización
     */
    updateQuotationStatus(id, status) {
        const labels = {
            accepted: 'aceptar',
            rejected: 'rechazar'
        };

        Modal.confirm({
            title: `${labels[status]?.charAt(0).toUpperCase() + labels[status]?.slice(1)} Cotización`,
            message: `¿Estás seguro de ${labels[status]} esta cotización?`,
            confirmText: 'Sí, confirmar',
            type: status === 'rejected' ? 'danger' : 'success'
        }).then(confirmed => {
            if (confirmed) {
                try {
                    Quotations.updateStatus(id, status);
                    this.quotationsList = Quotations.getAll();
                    this.renderQuotationsTable();
                    this.renderStats();
                    Notifications.success(`Cotización marcada como ${Quotations.getStatusLabel(status).toLowerCase()}`);
                } catch (error) {
                    Notifications.error(error.message);
                }
            }
        });
    }

    /**
     * Convierte cotización a venta
     */
    convertToSale(id) {
        const quotation = Quotations.getById(id);
        if (!quotation) return;

        Modal.confirm({
            title: 'Convertir a Venta',
            message: `¿Convertir la cotización ${quotation.numero} en una venta? Esto descontará los productos del inventario.`,
            confirmText: 'Sí, convertir',
            type: 'warning'
        }).then(confirmed => {
            if (confirmed) {
                try {
                    const saleData = Quotations.convertToSale(id);
                    
                    // Crear la venta
                    Sales.add({
                        items: saleData.items,
                        descuento: saleData.descuento
                    });

                    this.quotationsList = Quotations.getAll();
                    this.renderQuotationsTable();
                    this.renderStats();
                    Notifications.success('Cotización convertida a venta exitosamente');
                } catch (error) {
                    Notifications.error(error.message);
                }
            }
        });
    }

    /**
     * Elimina cotización
     */
    deleteQuotation(id) {
        Modal.confirm({
            title: 'Eliminar Cotización',
            message: '¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.',
            confirmText: 'Sí, eliminar',
            type: 'danger'
        }).then(confirmed => {
            if (confirmed) {
                Quotations.delete(id);
                this.quotationsList = Quotations.getAll();
                this.renderQuotationsTable();
                this.renderStats();
                Notifications.success('Cotización eliminada');
            }
        });
    }

    /**
     * Genera PDF de cotización
     */
    generatePDF(id) {
        const quotation = Quotations.getById(id);
        if (!quotation) return;

        // Crear ventana de impresión con diseño profesional
        const printWindow = window.open('about:blank', '_blank');
        
        const html = this.generatePDFContent(quotation);
        
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Cambiar la URL del historial para que no aparezca en el PDF
        try {
            printWindow.history.replaceState(null, ' ', ' ');
        } catch (e) {
            // Ignorar si no se puede cambiar
        }
        
        // Esperar a que cargue y luego imprimir
        printWindow.onload = () => {
            printWindow.print();
        };
    }

    /**
     * Genera contenido HTML del PDF
     */
    generatePDFContent(quotation) {
        const empresa = quotation.empresa;
        const cliente = quotation.cliente;
        const fechaEmision = new Date(quotation.date).toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const fechaVencimiento = new Date(quotation.expirationDate).toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> </title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 15mm;
        }
        
        @media print {
            @page {
                margin: 15mm;
            }
            
            /* Ocultar header y footer del navegador */
            html {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            color: #333;
            line-height: 1.5;
            background: white;
        }
        
        .document {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a5f7a;
            margin-bottom: 25px;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }
        
        .logo-placeholder {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #1a5f7a, #2d8eb4);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24pt;
            font-weight: bold;
        }
        
        .company-info h1 {
            font-size: 18pt;
            color: #1a5f7a;
            margin-bottom: 5px;
        }
        
        .company-info p {
            font-size: 9pt;
            color: #666;
            margin: 2px 0;
        }
        
        .quotation-info {
            text-align: right;
        }
        
        .quotation-number {
            background: linear-gradient(135deg, #1a5f7a, #2d8eb4);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            display: inline-block;
        }
        
        .quotation-dates {
            font-size: 9pt;
            color: #666;
        }
        
        .quotation-dates strong {
            color: #333;
        }
        
        /* Title */
        .document-title {
            text-align: center;
            margin: 25px 0;
        }
        
        .document-title h2 {
            font-size: 20pt;
            color: #1a5f7a;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        /* Client Info */
        .client-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #1a5f7a;
        }
        
        .client-section h3 {
            font-size: 11pt;
            color: #1a5f7a;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .client-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .client-item {
            font-size: 10pt;
        }
        
        .client-item span {
            color: #666;
        }
        
        .client-item strong {
            color: #333;
        }
        
        /* Products Table */
        .products-section {
            margin-bottom: 25px;
        }
        
        .products-section h3 {
            font-size: 11pt;
            color: #1a5f7a;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        thead {
            background: linear-gradient(135deg, #1a5f7a, #2d8eb4);
        }
        
        th {
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-size: 10pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        th:first-child {
            border-radius: 8px 0 0 0;
        }
        
        th:last-child {
            border-radius: 0 8px 0 0;
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 10pt;
        }
        
        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        tbody tr:last-child td:first-child {
            border-radius: 0 0 0 8px;
        }
        
        tbody tr:last-child td:last-child {
            border-radius: 0 0 8px 0;
        }
        
        .col-center {
            text-align: center;
        }
        
        .col-right {
            text-align: right;
        }
        
        /* Totals */
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .totals-box {
            width: 280px;
            background: #f8f9fa;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            font-size: 10pt;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .total-row:last-child {
            border-bottom: none;
        }
        
        .total-row.highlight {
            background: linear-gradient(135deg, #1a5f7a, #2d8eb4);
            color: white;
            font-size: 12pt;
            font-weight: bold;
        }
        
        .total-row span:first-child {
            color: #666;
        }
        
        .total-row.highlight span:first-child {
            color: rgba(255,255,255,0.9);
        }
        
        /* Terms */
        .terms-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .terms-section h3 {
            font-size: 10pt;
            color: #1a5f7a;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .terms-section p {
            font-size: 9pt;
            color: #666;
            white-space: pre-line;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
        }
        
        .footer p {
            font-size: 9pt;
            color: #999;
            margin: 3px 0;
        }
        
        .validity-notice {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 12px 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .validity-notice p {
            font-size: 10pt;
            color: #856404;
            margin: 0;
        }
        
        .validity-notice strong {
            color: #664d03;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .document {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="document">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                ${empresa.logo 
                    ? `<img src="${empresa.logo}" alt="Logo" class="logo">`
                    : `<div class="logo-placeholder">${empresa.nombre?.substring(0, 2) || 'NM'}</div>`
                }
                <div class="company-info">
                    <h1>${empresa.nombre || 'NICMAT S.R.L.'}</h1>
                    ${empresa.nit ? `<p><strong>NIT:</strong> ${empresa.nit}</p>` : ''}
                    ${empresa.direccion ? `<p>${empresa.direccion}</p>` : ''}
                    ${empresa.ciudad ? `<p>${empresa.ciudad}, Bolivia</p>` : ''}
                    ${empresa.telefono ? `<p>Tel: ${empresa.telefono}${empresa.telefono2 ? ` / ${empresa.telefono2}` : ''}</p>` : ''}
                    ${empresa.email ? `<p>${empresa.email}</p>` : ''}
                </div>
            </div>
            <div class="quotation-info">
                <div class="quotation-number">${quotation.numero}</div>
                <div class="quotation-dates">
                    <p><span>Fecha:</span> <strong>${fechaEmision}</strong></p>
                    <p><span>Válido hasta:</span> <strong>${fechaVencimiento}</strong></p>
                </div>
            </div>
        </div>
        
        <!-- Title -->
        <div class="document-title">
            <h2>Cotización</h2>
        </div>
        
        <!-- Client -->
        <div class="client-section">
            <h3>Datos del Cliente</h3>
            <div class="client-grid">
                <div class="client-item">
                    <span>Nombre:</span> <strong>${cliente.nombre || 'No especificado'}</strong>
                </div>
                <div class="client-item">
                    <span>Teléfono:</span> <strong>${cliente.telefono || '-'}</strong>
                </div>
                <div class="client-item">
                    <span>Email:</span> <strong>${cliente.email || '-'}</strong>
                </div>
                <div class="client-item">
                    <span>Dirección:</span> <strong>${cliente.direccion || '-'}</strong>
                </div>
            </div>
        </div>
        
        <!-- Products -->
        <div class="products-section">
            <h3>Detalle de Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%">#</th>
                        <th style="width: 30%">Marca</th>
                        <th style="width: 20%">Amperaje</th>
                        <th style="width: 15%" class="col-center">Cantidad</th>
                        <th style="width: 15%" class="col-right">Precio Unit.</th>
                        <th style="width: 15%" class="col-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${quotation.items.map((item, index) => `
                        <tr>
                            <td class="col-center">${index + 1}</td>
                            <td>${item.marca}</td>
                            <td>${item.amperaje}</td>
                            <td class="col-center">${item.cantidad}</td>
                            <td class="col-right">${Currency.format(item.precio)}</td>
                            <td class="col-right">${Currency.format(item.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <span>Total Baterías:</span>
                    <span><strong>${quotation.totalBaterias}</strong></span>
                </div>
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span><strong>${Currency.format(quotation.totalImporte)}</strong></span>
                </div>
                ${quotation.descuento > 0 ? `
                    <div class="total-row">
                        <span>Descuento:</span>
                        <span><strong>- ${Currency.format(quotation.descuento)}</strong></span>
                    </div>
                ` : ''}
                <div class="total-row highlight">
                    <span>TOTAL A PAGAR:</span>
                    <span>${Currency.format(quotation.totalSaldo)}</span>
                </div>
            </div>
        </div>
        
        <!-- Validity Notice -->
        <div class="validity-notice">
            <p>Esta cotización tiene una validez de <strong>${quotation.vigenciaDias} días</strong> a partir de la fecha de emisión.</p>
        </div>
        
        <!-- Terms -->
        ${quotation.terminosCondiciones ? `
            <div class="terms-section">
                <h3>Términos y Condiciones</h3>
                <p>${quotation.terminosCondiciones}</p>
            </div>
        ` : ''}
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>${empresa.nombre || 'NICMAT S.R.L.'}</strong></p>
            <p>Gracias por su preferencia</p>
            ${empresa.telefono ? `<p>Contáctenos: ${empresa.telefono}</p>` : ''}
        </div>
    </div>
</body>
</html>
        `;
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

export default QuotationsPage;
