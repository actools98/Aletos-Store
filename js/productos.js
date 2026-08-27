// Array de productos (simulando base de datos)
const productos = [
    {
        id: 1,
        nombre: "Camiseta Cima",
        categoria: "camiseta",
        precio: 29.90,
        imagen: "https://placehold.co/300x300/e0dcd6/6b6b6b?text=Camiseta",
        destacado: true
    },
    {
        id: 2,
        nombre: "Gorra Pico",
        categoria: "gorra",
        precio: 19.90,
        imagen: "https://placehold.co/300x300/e0dcd6/6b6b6b?text=Gorra",
        destacado: true
    },
    {
        id: 3,
        nombre: "Camiseta Bosque",
        categoria: "camiseta",
        precio: 34.90,
        imagen: "https://placehold.co/300x300/e0dcd6/6b6b6b?text=Camiseta+Bosque",
        destacado: false
    },
    {
        id: 4,
        nombre: "Gorra Cumbre",
        categoria: "gorra",
        precio: 24.90,
        imagen: "https://placehold.co/300x300/e0dcd6/6b6b6b?text=Gorra+Cumbre",
        destacado: false
    }
];

// Función para renderizar productos en un contenedor
function renderizarProductos(contenedorId, lista) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = lista.map(p => `
        <div class="producto" data-id="${p.id}">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h4>${p.nombre}</h4>
            <div class="precio">${p.precio.toFixed(2)} €</div>
            <button class="agregar-carrito" data-id="${p.id}">Añadir al carrito</button>
        </div>
    `).join('');
}

// Renderizar destacados en el index
document.addEventListener('DOMContentLoaded', () => {
    const destacados = productos.filter(p => p.destacado);
    renderizarProductos('lista-destacados', destacados);
});

// Exportar productos para usarlos en carrito.js (si usas módulos, pero aquí lo dejamos global)
window.productos = productos;
