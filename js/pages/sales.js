/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Ventas
 * @version 1.0.0
 */

import Currency from '../utils/currency.js';
import Inventory from '../services/inventory.js';
import Sales from '../services/sales.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';

/**
 * Iconos SVG
 */
const ICONS = {
    cart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    receipt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h16a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V4a2 2 0 0 1 2-2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="13" y2="15"></line></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
};

/**
 * Clase para la página de Ventas
 */
class SalesPage {
    constructor() {
        this.container = null;
        this.inventory = [];
        this.items = [];
        this.salesList = [];
        this.discount = 0;
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.editingSaleId = null; // ID de venta en edición
    }

    /**
     * Renderiza la página
     */
    render(container) {
        this.container = container;
        this.inventory = Inventory.getAll();
        this.salesList = Sales.getAll();
        this.items = [];
        this.discount = 0;
        this.currentPage = 1;
        this.editingSaleId = null;

        this.renderContent();
        this.bindEvents();
        this.populateBrandSelect();
        this.renderSaleItemsTable();
        this.renderSalesTable();
        this.updateSummary();
    }

    /**
     * Renderiza el contenido HTML
     */
    renderContent() {
        const html = `
            <div class="page-header">
                <div class="page-header-content">
                    <h1 class="page-title">Ventas</h1>
                    <p class="page-description">Registra ventas rápidas usando los productos del inventario</p>
                </div>
            </div>

            <div class="sales-grid">
                <!-- Formulario de agregar productos -->
                <div class="card sale-builder">
                    <div class="card-header">
                        <div class="card-title">Agregar productos a la venta</div>
                        <div class="card-subtitle">Selecciona desde el inventario</div>
                    </div>

                    <div class="sale-form">
                        <div class="form-group">
                            <label class="form-label required" for="sale-marca">Marca</label>
                            <select id="sale-marca" required>
                                <option value="">Seleccione marca</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label required" for="sale-amperaje">Amperaje</label>
                            <select id="sale-amperaje" required>
                                <option value="">Seleccione amperaje</option>
                            </select>
                            <div class="input-help" id="stock-info"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label required" for="sale-cantidad">Cantidad</label>
                            <input type="number" id="sale-cantidad" min="1" placeholder="Cantidad" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label required" for="sale-precio">Precio Venta</label>
                            <input type="text" id="sale-precio" placeholder="Precio" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Total</label>
                            <div class="sale-total" id="sale-total-linea">Bs. 0,00</div>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary" id="btn-add-item">
                                ${ICONS.plus}
                                <span>Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Resumen de la venta -->
                <div class="card sale-summary">
                    <div class="card-header">
                        <div class="card-title">Resumen</div>
                        <div class="card-subtitle">Totales de la venta actual</div>
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
                    </div>
                    <div class="summary-actions">
                        <button class="btn btn-ghost" id="btn-clear-sale">Limpiar</button>
                        <button class="btn btn-primary" id="btn-save-sale">Registrar Venta</button>
                    </div>
                </div>
            </div>

            <!-- Detalle de productos agregados -->
            <div class="card sale-items-card">
                <div class="card-header">
                    <div class="card-title">Detalle de la venta</div>
                    <div class="card-subtitle">Productos agregados</div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" id="sale-items-table">
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
                        <tbody id="sale-items-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- Historial de ventas -->
            <div class="card sales-list-card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Ventas Registradas</div>
                        <div class="card-subtitle">Historial de ventas</div>
                    </div>
                    <div class="table-toolbar-right">
                        <span style="font-size: var(--font-size-sm); color: var(--text-muted);">Mostrar:</span>
                        <select id="sales-items-per-page" class="pagination-select">
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                        </select>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" id="sales-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th class="col-number"># Productos</th>
                                <th class="col-number">Unidades</th>
                                <th class="col-currency">Importe</th>
                                <th class="col-currency">Descuento</th>
                                <th class="col-currency">Total</th>
                                <th class="col-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="sales-body"></tbody>
                    </table>
                </div>
                <div class="table-pagination" id="sales-pagination"></div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Bindea eventos
     */
    bindEvents() {
        // Cambio de marca
        document.getElementById('sale-marca')?.addEventListener('change', () => {
            this.populateAmperajeSelect();
            this.updateSuggestedPrice();
            this.updateStockInfo();
            this.updateLineTotal();
        });

        // Cambio de amperaje
        document.getElementById('sale-amperaje')?.addEventListener('change', () => {
            this.updateSuggestedPrice();
            this.updateStockInfo();
            this.updateLineTotal();
        });

        // Cantidad
        document.getElementById('sale-cantidad')?.addEventListener('input', () => {
            this.updateLineTotal();
        });

        // Precio
        document.getElementById('sale-precio')?.addEventListener('input', (e) => {
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
            this.addItemToSale();
        });

        // Limpiar venta
        document.getElementById('btn-clear-sale')?.addEventListener('click', () => {
            this.clearCurrentSale();
        });

        // Registrar venta
        document.getElementById('btn-save-sale')?.addEventListener('click', () => {
            this.saveSale();
        });

        // Paginación
        document.getElementById('sales-items-per-page')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value) || 5;
            this.currentPage = 1;
            this.renderSalesTable();
        });
    }

    /**
     * Poblar select de marcas
     */
    populateBrandSelect() {
        const select = document.getElementById('sale-marca');
        if (!select) return;
        
        const brands = Inventory.getBrands();
        select.innerHTML = `<option value="">Seleccione marca</option>` + 
            brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }

    /**
     * Poblar select de amperajes
     */
    populateAmperajeSelect() {
        const marca = document.getElementById('sale-marca')?.value;
        const select = document.getElementById('sale-amperaje');
        if (!select) return;
        
        const amperajes = Inventory.getAmperajes(marca || null);
        select.innerHTML = `<option value="">Seleccione amperaje</option>` + 
            amperajes.map(a => `<option value="${a}">${a}</option>`).join('');
    }

    /**
     * Obtiene el producto seleccionado
     */
    getSelectedProduct() {
        const marca = document.getElementById('sale-marca')?.value;
        const amperaje = document.getElementById('sale-amperaje')?.value;
        if (!marca || !amperaje) return null;
        return Inventory.findByMarcaAmperaje(marca, amperaje);
    }

    /**
     * Obtiene cantidad en carrito de un producto
     */
    getCartQuantityForProduct(productId) {
        return this.items
            .filter(i => i.productId === productId)
            .reduce((sum, item) => sum + item.cantidad, 0);
    }

    /**
     * Actualiza precio sugerido
     */
    updateSuggestedPrice() {
        const product = this.getSelectedProduct();
        const inputPrecio = document.getElementById('sale-precio');
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
            const enCarrito = this.getCartQuantityForProduct(product.id);
            const disponible = Math.max(0, product.cantidad - enCarrito);
            info.textContent = `Stock disponible: ${disponible}`;
            info.style.color = disponible > 0 ? 'var(--text-secondary)' : 'var(--color-error)';
        } else {
            info.textContent = '';
        }
    }

    /**
     * Actualiza total de línea
     */
    updateLineTotal() {
        const cantidad = parseInt(document.getElementById('sale-cantidad')?.value) || 0;
        const precio = Currency.parse(document.getElementById('sale-precio')?.value) || 0;
        const total = Currency.format(cantidad * precio);
        const totalEl = document.getElementById('sale-total-linea');
        if (totalEl) totalEl.textContent = total;
    }

    /**
     * Agrega producto a la venta
     */
    addItemToSale() {
        const product = this.getSelectedProduct();
        if (!product) {
            Notifications.warning('Selecciona una marca y amperaje');
            return;
        }

        const cantidad = parseInt(document.getElementById('sale-cantidad')?.value) || 0;
        const precio = Currency.parse(document.getElementById('sale-precio')?.value) || 0;

        if (cantidad <= 0) {
            Notifications.warning('Ingresa una cantidad válida');
            return;
        }
        if (precio <= 0) {
            Notifications.warning('Ingresa un precio de venta');
            return;
        }

        const enCarrito = this.getCartQuantityForProduct(product.id);
        const disponible = product.cantidad - enCarrito;
        
        if (cantidad > disponible) {
            Notifications.error(`Stock insuficiente. Disponible: ${disponible}`);
            return;
        }

        // Verificar si ya existe en carrito
        const existingIndex = this.items.findIndex(i => i.productId === product.id);
        
        if (existingIndex !== -1) {
            const nuevoTotal = this.items[existingIndex].cantidad + cantidad;
            if (nuevoTotal > product.cantidad) {
                Notifications.error(`Stock insuficiente. Disponible: ${disponible}`);
                return;
            }
            this.items[existingIndex].cantidad = nuevoTotal;
            this.items[existingIndex].precio = precio;
            this.items[existingIndex].total = Currency.round(nuevoTotal * precio);
        } else {
            this.items.push({
                productId: product.id,
                marca: product.marca,
                amperaje: product.amperaje,
                cantidad,
                precio,
                total: Currency.round(cantidad * precio)
            });
        }

        // Reset cantidad
        const cantidadInput = document.getElementById('sale-cantidad');
        if (cantidadInput) cantidadInput.value = '';
        
        this.updateStockInfo();
        this.updateLineTotal();
        this.renderSaleItemsTable();
        this.updateSummary();
    }

    /**
     * Renderiza tabla de items en venta actual
     */
    renderSaleItemsTable() {
        const tbody = document.getElementById('sale-items-body');
        if (!tbody) return;

        if (this.items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="table-empty">
                            <div class="table-empty-title">Agrega productos para la venta</div>
                            <div class="table-empty-text">Selecciona marca, amperaje y presiona "Agregar"</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.items.map((item, index) => `
            <tr data-index="${index}">
                <td>${item.marca}</td>
                <td>${item.amperaje}</td>
                <td class="col-number">
                    <input type="number" class="table-input qty-input" value="${item.cantidad}" min="1">
                </td>
                <td class="col-currency">
                    <input type="text" class="table-input price-input" value="${Currency.format(item.precio, false)}">
                </td>
                <td class="col-currency">${Currency.format(item.total)}</td>
                <td class="col-actions">
                    <div class="row-actions">
                        <button class="row-action-btn delete" data-action="remove" title="Eliminar">
                            ${ICONS.trash}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind eventos de fila
        tbody.querySelectorAll('tr').forEach(row => {
            const index = parseInt(row.dataset.index);
            if (isNaN(index)) return;
            
            const qtyInput = row.querySelector('.qty-input');
            const priceInput = row.querySelector('.price-input');
            const removeBtn = row.querySelector('[data-action="remove"]');

            qtyInput?.addEventListener('change', () => {
                const val = parseInt(qtyInput.value) || 0;
                const item = this.items[index];
                const product = Inventory.getById(item.productId);
                const otros = this.getCartQuantityForProduct(item.productId) - item.cantidad;
                const disponible = product ? product.cantidad - otros : val;

                if (val <= 0) {
                    qtyInput.value = item.cantidad;
                    return;
                }
                if (product && val > disponible) {
                    qtyInput.value = disponible;
                    Notifications.error(`Stock máximo: ${disponible}`);
                    this.items[index].cantidad = disponible;
                } else {
                    this.items[index].cantidad = val;
                }
                this.items[index].total = Currency.round(this.items[index].cantidad * this.items[index].precio);
                this.renderSaleItemsTable();
                this.updateSummary();
            });

            priceInput?.addEventListener('input', (e) => {
                e.target.value = Currency.formatInput(e.target.value);
            });

            priceInput?.addEventListener('change', (e) => {
                const val = Currency.parse(e.target.value) || 0;
                this.items[index].precio = val;
                this.items[index].total = Currency.round(this.items[index].cantidad * val);
                this.renderSaleItemsTable();
                this.updateSummary();
            });

            removeBtn?.addEventListener('click', () => {
                this.items.splice(index, 1);
                this.renderSaleItemsTable();
                this.updateSummary();
                this.updateStockInfo();
            });
        });
    }

    /**
     * Actualiza resumen
     */
    updateSummary() {
        const totalBaterias = this.items.reduce((sum, item) => sum + item.cantidad, 0);
        const totalImporte = this.items.reduce((sum, item) => sum + item.total, 0);
        const saldo = Math.max(0, totalImporte - this.discount);

        document.getElementById('summary-baterias').textContent = totalBaterias;
        document.getElementById('summary-importe').textContent = Currency.format(totalImporte);
        document.getElementById('summary-saldo').textContent = Currency.format(saldo);
        
        // Actualizar texto del botón según modo
        const btnSave = document.getElementById('btn-save-sale');
        const btnClear = document.getElementById('btn-clear-sale');
        if (btnSave) {
            btnSave.textContent = this.editingSaleId ? 'Actualizar Venta' : 'Registrar Venta';
        }
        if (btnClear) {
            btnClear.textContent = this.editingSaleId ? 'Cancelar Edición' : 'Limpiar';
        }
    }

    /**
     * Limpia venta actual o cancela edición
     */
    clearCurrentSale() {
        if (this.editingSaleId) {
            // Cancelar edición - re-descontar stock
            this.cancelEdit();
            return;
        }
        
        this.items = [];
        this.discount = 0;
        
        const descInput = document.getElementById('summary-descuento');
        if (descInput) descInput.value = '';
        
        document.getElementById('sale-cantidad').value = '';
        document.getElementById('sale-precio').value = '';
        document.getElementById('sale-amperaje').innerHTML = `<option value="">Seleccione amperaje</option>`;
        
        this.updateLineTotal();
        this.renderSaleItemsTable();
        this.updateSummary();
        this.updateStockInfo();
    }

    /**
     * Guarda la venta (nueva o editada)
     */
    saveSale() {
        if (this.items.length === 0) {
            Notifications.warning('Agrega al menos un producto');
            return;
        }

        try {
            if (this.editingSaleId) {
                // Actualizar venta existente
                Sales.updateWithStock(this.editingSaleId, {
                    items: this.items,
                    descuento: this.discount
                });
                Notifications.success('Venta actualizada correctamente');
                this.editingSaleId = null;
            } else {
                // Nueva venta
                Sales.add({
                    items: this.items,
                    descuento: this.discount
                });
                Notifications.success('Venta registrada correctamente');
            }
            
            this.items = [];
            this.discount = 0;
            this.inventory = Inventory.getAll();
            this.salesList = Sales.getAll();
            
            const descInput = document.getElementById('summary-descuento');
            if (descInput) descInput.value = '';
            
            this.renderSaleItemsTable();
            this.renderSalesTable();
            this.updateSummary();
            this.populateBrandSelect();
            this.populateAmperajeSelect();
            this.updateStockInfo();
        } catch (error) {
            console.error(error);
            Notifications.error(error.message || 'No se pudo registrar la venta');
        }
    }

    /**
     * Renderiza tabla de ventas históricas
     */
    renderSalesTable() {
        const tbody = document.getElementById('sales-body');
        const pagination = document.getElementById('sales-pagination');
        if (!tbody || !pagination) return;

        if (this.salesList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="table-empty">
                            <div class="table-empty-icon">${ICONS.receipt}</div>
                            <div class="table-empty-title">Aún no hay ventas registradas</div>
                            <div class="table-empty-text">Registra una venta para verla aquí</div>
                        </div>
                    </td>
                </tr>
            `;
            pagination.innerHTML = '';
            return;
        }

        const totalPages = Math.max(1, Math.ceil(this.salesList.length / this.itemsPerPage));
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.salesList.slice(start, end);

        tbody.innerHTML = pageData.map(sale => {
            const fecha = new Date(sale.date);
            const formattedDate = fecha.toLocaleDateString('es-BO', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            return `
                <tr data-id="${sale.id}">
                    <td>${formattedDate}</td>
                    <td class="col-number">${sale.items.length}</td>
                    <td class="col-number">${sale.totalBaterias}</td>
                    <td class="col-currency">${Currency.format(sale.totalImporte)}</td>
                    <td class="col-currency">${Currency.format(sale.descuento)}</td>
                    <td class="col-currency">${Currency.format(sale.totalSaldo)}</td>
                    <td class="col-actions">
                        <div class="row-actions">
                            <button class="row-action-btn view" data-action="view" data-id="${sale.id}" title="Ver detalle">
                                ${ICONS.eye}
                            </button>
                            <button class="row-action-btn edit" data-action="edit" data-id="${sale.id}" title="Editar">
                                ${ICONS.edit}
                            </button>
                            <button class="row-action-btn delete" data-action="delete" data-id="${sale.id}" title="Eliminar">
                                ${ICONS.trash}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Paginación
        this.renderPagination(pagination, totalPages, start, end);

        // Eventos de vista
        tbody.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const sale = Sales.getById(id);
                if (sale) this.showSaleDetail(sale);
            });
        });

        // Eventos de editar
        tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const sale = Sales.getById(id);
                if (sale) this.showEditSaleModal(sale);
            });
        });

        // Eventos de eliminar
        tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.confirmDeleteSale(id);
            });
        });
    }

    /**
     * Renderiza paginación
     */
    renderPagination(container, totalPages, start, end) {
        let pagesHtml = '';
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

        for (let i = startPage; i <= endPage; i++) {
            pagesHtml += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        container.innerHTML = `
            <div class="pagination-info">
                Mostrando ${start + 1} - ${Math.min(end, this.salesList.length)} de ${this.salesList.length} ventas
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" id="sales-btn-prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                    ${ICONS.chevronLeft}
                </button>
                <div class="pagination-pages">${pagesHtml}</div>
                <button class="pagination-btn" id="sales-btn-next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    ${ICONS.chevronRight}
                </button>
            </div>
        `;

        document.getElementById('sales-btn-prev')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderSalesTable();
            }
        });

        document.getElementById('sales-btn-next')?.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderSalesTable();
            }
        });

        container.querySelectorAll('.pagination-pages .pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderSalesTable();
            });
        });
    }

    /**
     * Muestra detalle de una venta
     */
    showSaleDetail(sale) {
        const content = `
            <div class="sale-detail">
                <div class="sale-detail-row">
                    <span class="sale-detail-label">Fecha</span>
                    <span class="sale-detail-value">${new Date(sale.date).toLocaleString('es-BO')}</span>
                </div>
                <div class="sale-detail-row">
                    <span class="sale-detail-label">Unidades</span>
                    <span class="sale-detail-value">${sale.totalBaterias}</span>
                </div>
                <div class="sale-detail-row">
                    <span class="sale-detail-label">Importe</span>
                    <span class="sale-detail-value">${Currency.format(sale.totalImporte)}</span>
                </div>
                <div class="sale-detail-row">
                    <span class="sale-detail-label">Descuento</span>
                    <span class="sale-detail-value">${Currency.format(sale.descuento)}</span>
                </div>
                <div class="sale-detail-row highlight">
                    <span class="sale-detail-label">Total</span>
                    <span class="sale-detail-value">${Currency.format(sale.totalSaldo)}</span>
                </div>

                <div class="sale-detail-items">
                    <div class="sale-detail-items-title">Productos</div>
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
                                ${sale.items.map(item => `
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
            </div>
        `;

        const modalId = Modal.open({
            title: 'Detalle de Venta',
            content,
            size: 'default',
            showFooter: true,
            footerContent: `<button class="btn btn-primary" id="btn-close-detail">Cerrar</button>`
        });

        document.getElementById('btn-close-detail')?.addEventListener('click', () => {
            Modal.close(modalId);
        });
    }

    /**
     * Confirma eliminación de una venta
     */
    confirmDeleteSale(id) {
        const sale = Sales.getById(id);
        if (!sale) return;

        const fecha = new Date(sale.date).toLocaleString('es-BO');
        const content = `
            <div class="confirm-delete">
                <p>¿Estás seguro de eliminar esta venta?</p>
                <div class="confirm-details">
                    <div><strong>Fecha:</strong> ${fecha}</div>
                    <div><strong>Total:</strong> ${Currency.format(sale.totalSaldo)}</div>
                    <div><strong>Productos:</strong> ${sale.items.length}</div>
                    <div><strong>Unidades:</strong> ${sale.totalBaterias}</div>
                </div>
                <p class="confirm-info">El stock de los productos será repuesto al inventario.</p>
            </div>
        `;

        const modalId = Modal.open({
            title: 'Eliminar Venta',
            content,
            size: 'small',
            showFooter: true,
            footerContent: `
                <button class="btn btn-ghost" id="btn-cancel-delete">Cancelar</button>
                <button class="btn btn-danger" id="btn-confirm-delete">Eliminar</button>
            `
        });

        document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
            Modal.close(modalId);
        });

        document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
            if (Sales.delete(id)) {
                Notifications.success('Venta eliminada y stock repuesto');
                this.inventory = Inventory.getAll();
                this.salesList = Sales.getAll();
                this.renderSalesTable();
                this.populateBrandSelect();
                this.updateStockInfo();
            } else {
                Notifications.error('No se pudo eliminar la venta');
            }
            Modal.close(modalId);
        });
    }

    /**
     * Edita una venta cargándola en el formulario principal
     */
    showEditSaleModal(sale) {
        // Primero reponer el stock de la venta original
        Sales.restoreStock(sale.id);
        
        // Marcar que estamos editando
        this.editingSaleId = sale.id;
        
        // Cargar items en el formulario
        this.items = sale.items.map(item => ({
            productId: item.productId,
            marca: item.marca,
            amperaje: item.amperaje,
            cantidad: item.cantidad,
            precio: item.precio,
            total: item.total
        }));
        
        // Cargar descuento
        this.discount = sale.descuento;
        const descInput = document.getElementById('summary-descuento');
        if (descInput) descInput.value = Currency.format(sale.descuento, false);
        
        // Refrescar inventario y UI
        this.inventory = Inventory.getAll();
        this.populateBrandSelect();
        this.renderSaleItemsTable();
        this.updateSummary();
        this.updateStockInfo();
        
        // Scroll al formulario
        this.container.scrollIntoView({ behavior: 'smooth' });
        
        Notifications.info(`Editando venta del ${new Date(sale.date).toLocaleDateString('es-BO')}. Modifica los productos y guarda.`);
    }

    /**
     * Cancela la edición de una venta
     */
    cancelEdit() {
        if (!this.editingSaleId) return;
        
        const sale = Sales.getById(this.editingSaleId);
        if (sale) {
            // Re-descontar el stock que habíamos repuesto
            Sales.deductStock(sale.items);
        }
        
        this.editingSaleId = null;
        
        // Limpiar manualmente sin llamar clearCurrentSale
        this.items = [];
        this.discount = 0;
        
        const descInput = document.getElementById('summary-descuento');
        if (descInput) descInput.value = '';
        
        document.getElementById('sale-cantidad').value = '';
        document.getElementById('sale-precio').value = '';
        document.getElementById('sale-amperaje').innerHTML = `<option value="">Seleccione amperaje</option>`;
        
        this.inventory = Inventory.getAll();
        this.populateBrandSelect();
        this.updateLineTotal();
        this.renderSaleItemsTable();
        this.updateSummary();
        this.updateStockInfo();
        
        Notifications.info('Edición cancelada');
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

export default SalesPage;
