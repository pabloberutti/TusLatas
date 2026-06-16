let todosLosLineups = [];

// 1. Cargar el JSON apenas abre la página
fetch('lineups.json')
    .then(response => response.json())
    .then(data => {
        todosLosLineups = data;
    });

// 2. Función que se ejecuta al tocar un mapa
function seleccionarMapa(mapaSeleccionado) {
    const contenedor = document.getElementById('lista-lineups');
    contenedor.innerHTML = ''; // Limpiar pantalla

    // Filtrar el JSON en tiempo real
    const filtrados = todosLosLineups.filter(lata => lata.mapa === mapaSeleccionado);

    if (filtrados.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500 text-sm">No hay latas cargadas para este mapa.</p>';
        return;
    }

    // Dibujar los resultados con la técnica Lazy Load (imagen + botón)
    filtrados.forEach(lata => {
        const card = document.createElement('div');
        card.className = "bg-gray-800 p-4 rounded-lg shadow";
        card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold uppercase px-2 py-0.5 rounded ${lata.bando === 'T' ? 'bg-yellow-600' : 'bg-blue-600'}">${lata.bando}</span>
                <span class="text-xs text-gray-400 uppercase">${lata.tipo}</span>
            </div>
            <h3 class="font-medium text-sm mb-3">${lata.nombre}</h3>
            
            <!-- Contenedor del video diferido -->
            <div id="video-container-${lata.nombre.replace(/\s+/g, '')}" class="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                <img src="https://img.youtube.com/vi/${lata.video_id}/hqdefault.jpg" class="absolute w-full h-full object-cover opacity-60">
                <button onclick="cargarVideo('${lata.video_id}', 'video-container-${lata.nombre.replace(/\s+/g, '')}')" class="relative z-10 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    ▶ Ver Lineup
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 3. Reemplazar la miniatura por el iframe real al hacer clic
function cargarVideo(id, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <iframe class="w-full h-full" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}