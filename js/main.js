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
