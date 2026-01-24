/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Página: Tiendas
 * @version 1.0.0
 */

import Stores, { STORE_TYPES } from '../services/stores.js';
import Inventory from '../services/inventory.js';
import Modal from '../components/modal.js';
import Notifications from '../components/notifications.js';

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
    tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
};

/**
 * Clase para la página de Tiendas
 */
class StoresPage {
    constructor() {
        this.container = null;
        this.stores = [];
        this.sendItems = []; // Items para envío
    }

    /**
     * Renderiza la página
     */
    render(container) {
        this.container = container;
        this.stores = Stores.getAll();

        this.renderContent();
        this.bindEvents();
    }

    /**
     * Renderiza el contenido HTML
     */
    renderContent() {
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
                        this.showStoreDevelopment(id);
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
