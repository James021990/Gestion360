/* ==========================================================
   GESTIÓN 360 ERP - SCRIPT GLOBAL CENTRALIZADO (js/main.js)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // MENÚS DESPLEGABLES DEL SIDEBAR (Dashboard y Navegación)
    // ==========================================================
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', () => {
            const container = button.nextElementSibling;
            const arrow = button.querySelector('.arrow');
            
            if (container && arrow) {
                if (container.style.display === "block") {
                    container.style.display = "none";
                    arrow.style.transform = "rotate(0deg)";
                } else {
                    container.style.display = "block";
                    arrow.style.transform = "rotate(90deg)";
                }
            }
        });
    });


    // ==========================================================
    // CONTROL DE VENTANA MODAL (usuarios.html)
    // ==========================================================
    const modal = document.getElementById('userModal');
    const btnAbrir = document.getElementById('btnNuevoUsuario');
    const btnCerrar = document.getElementById('btnCerrarModal');
    const btnCancelar = document.getElementById('btnCancelarModal');

    if (modal) {
        const abrirModal = (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        };

        const cerrarModal = (e) => {
            e.preventDefault();
            modal.style.display = 'none';
        };

        if (btnAbrir) btnAbrir.addEventListener('click', abrirModal);
        if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
        if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // ==========================================================
    // GRÁFICOS DE REPORTES - CHART.JS (dashboard.html)
    // ==========================================================
    const ctxSales = document.getElementById('salesChart');
    if (ctxSales && typeof Chart !== 'undefined') {
        new Chart(ctxSales.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Ventas ($ COP)',
                    data: [25000000, 28000000, 32000000, 30000000, 38000000, 42000000, 40000000, 44000000, 41000000, 45850000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const ctxCat = document.getElementById('categoriesChart');
    if (ctxCat && typeof Chart !== 'undefined') {
        new Chart(ctxCat.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Tecnología', 'Papelería', 'Servicios', 'Otros'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

});

// ==========================================================
    //LÓGICA DEL PUNTO DE VENTA / CARRITO (factura.html)
    // ==========================================================
    const cartTableBody = document.getElementById('cartTableBody');
    
    if (cartTableBody) {
        let cart = [];
        const lblSubtotal = document.getElementById('lblSubtotal');
        const lblIva = document.getElementById('lblIva');
        const lblTotal = document.getElementById('lblTotal');
        const searchInput = document.getElementById('searchInput');
        const btnCancelarFactura = document.getElementById('btnCancelar');
        const btnProcesar = document.getElementById('btnProcesar');

        // Formateador de moneda (Pesos Colombianos)
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(amount);
        };

        // Agregar producto al carrito desde las sugerencias
        document.querySelectorAll('.btn-add-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-item');
                const id = productCard.dataset.id;
                const nombre = productCard.dataset.nombre;
                const precio = parseFloat(productCard.dataset.precio);

                const existingProduct = cart.find(item => item.id === id);

                if (existingProduct) {
                    existingProduct.cantidad += 1;
                } else {
                    cart.push({ id, nombre, precio, cantidad: 1 });
                }

                renderCart();
            });
        });

        // Renderizar tabla del carrito y recalcular totales
        function renderCart() {
            cartTableBody.innerHTML = '';

            if (cart.length === 0) {
                cartTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
                            El carrito está vacío. Agrega productos desde el panel izquierdo.
                        </td>
                    </tr>
                `;
                calculateTotals(0);
                return;
            }

            let subtotalAcumulado = 0;

            cart.forEach((item, index) => {
                const itemSubtotal = item.precio * item.cantidad;
                subtotalAcumulado += itemSubtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <strong>${item.nombre}</strong>
                        <small>${item.id}</small>
                    </td>
                    <td>
                        <input type="number" value="${item.cantidad}" min="1" class="qty-input" data-index="${index}">
                    </td>
                    <td>${formatCurrency(item.precio)}</td>
                    <td><strong>${formatCurrency(itemSubtotal)}</strong></td>
                    <td>
                        <button class="btn-remove" data-index="${index}" title="Eliminar">🗑️</button>
                    </td>
                `;
                cartTableBody.appendChild(row);
            });

            calculateTotals(subtotalAcumulado);
            bindCartEvents();
        }

        // Vincular eventos internos de la tabla del carrito
        function bindCartEvents() {
            document.querySelectorAll('.qty-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const index = e.target.dataset.index;
                    const newQty = parseInt(e.target.value);
                    cart[index].cantidad = newQty > 0 ? newQty : 1;
                    renderCart();
                });
            });

            document.querySelectorAll('.btn-remove').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.dataset.index;
                    cart.splice(index, 1);
                    renderCart();
                });
            });
        }

        // Calcular Subtotal, IVA (19%) y Total
        function calculateTotals(subtotal) {
            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            if (lblSubtotal) lblSubtotal.textContent = formatCurrency(subtotal);
            if (lblIva) lblIva.textContent = formatCurrency(iva);
            if (lblTotal) lblTotal.textContent = formatCurrency(total);
        }

        