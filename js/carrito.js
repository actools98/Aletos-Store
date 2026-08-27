// Carrito almacenado en localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el contador del header
function actualizarContador() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = total;
    }
}

// Función para agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = window.productos.find(p => p.id === idProducto);
    if (!producto) return;

    const existente = carrito.find(item => item.id === idProducto);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    alert(`${producto.nombre} añadido al carrito.`);
}

// Escuchar clics en botones "agregar-carrito"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('agregar-carrito')) {
        const id = parseInt(e.target.dataset.id);
        agregarAlCarrito(id);
    }
});

// Si estamos en la página del carrito, mostrar los items
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();

    // Renderizar carrito si existe el contenedor
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    if (listaCarrito && totalCarrito) {
        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
            totalCarrito.textContent = '';
            return;
        }

        let total = 0;
        listaCarrito.innerHTML = carrito.map(item => {
            total += item.precio * item.cantidad;
            return `
                <li>
                    <span>${item.nombre} (x${item.cantidad})</span>
                    <span>${(item.precio * item.cantidad).toFixed(2)} €</span>
                </li>
            `;
        }).join('');

        totalCarrito.textContent = `Total: ${total.toFixed(2)} €`;
    }
});
