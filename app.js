let todosLosLineups = [];

// El "estado" actual de lo que eligió el usuario
let filtroActual = {
    mapa: '',
    bando: '',
    zona: '',
    tipo: ''
};

// 1. Cargamos el JSON al principio
fetch('lineups.json')
    .then(response => response.json())
    .then(data => {
        todosLosLineups = data;
    });

// 2. Funciones de selección (Manejan las pantallas)
function seleccionarMapa(mapa) {
    filtroActual.mapa = mapa;
    
    // Cambiamos de pantalla: ocultamos mapas, mostramos bandos
    document.getElementById('seccion-mapas').classList.add('hidden');
    document.getElementById('seccion-bandos').classList.remove('hidden');
    
    actualizarPantalla();
}

function seleccionarBando(bando) {
    filtroActual.bando = bando;
    
    // Cambiamos de pantalla: ocultamos bandos, mostramos zonas
    document.getElementById('seccion-bandos').classList.add('hidden');
    document.getElementById('seccion-zonas').classList.remove('hidden');
    
    actualizarPantalla();
}

function seleccionarZona(zona) {
    filtroActual.zona = zona;
    
    // Cambiamos de pantalla: ocultamos zonas, mostramos tipos de lata
    document.getElementById('seccion-zonas').classList.add('hidden');
    document.getElementById('seccion-tipos').classList.remove('hidden');
    
    actualizarPantalla();
}

function seleccionarTipo(tipo) {
    filtroActual.tipo = tipo;
    actualizarPantalla();
}

// 3. El filtro lógico
function actualizarPantalla() {
    // Filtramos el array gigante usando el estado actual
    const filtrados = todosLosLineups.filter(lata => {
        return (!filtroActual.mapa || lata.mapa === filtroActual.mapa) &&
               (!filtroActual.bando || lata.bando === filtroActual.bando) &&
               (!filtroActual.zona || lata.zona === filtroActual.zona) &&
               (!filtroActual.tipo || lata.tipo === filtroActual.tipo);
    });

    renderizarTarjetas(filtrados);
}

// 4. Dibuja las latas en el HTML
function renderizarTarjetas(lineupsFiltrados) {
    const contenedor = document.getElementById('lista-lineups');
    contenedor.innerHTML = ''; // Limpiamos lo que haya antes

    if (lineupsFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500 text-sm italic">No hay latas que coincidan con estos filtros...</p>';
        return;
    }

    // Recorremos las latas que pasaron el filtro y creamos el HTML dinámico
    lineupsFiltrados.forEach(lata => {
        const card = document.createElement('div');
        card.className = "bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700";
        
        // Creamos un ID único para el contenedor de video sin espacios raros
        const idContenedorVideo = `video-${lata.mapa}-${lata.bando}-${lata.tipo}-${lata.video_id}`;

        let plantillaMiniatura = '';
        if (lata.plataforma === 'tiktok') {
            // Fondo oscuro con estética TikTok para el formato vertical
            plantillaMiniatura = `<div class="absolute w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest">📱 TikTok Clip</div>`;
            } else {
            // Miniatura clásica de YouTube
            plantillaMiniatura = `<img src="https://img.youtube.com/vi/${lata.video_id}/hqdefault.jpg" class="absolute w-full h-full object-cover opacity-50">`;
        }

        card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold uppercase px-2 py-0.5 rounded ${lata.bando === 'T' ? 'bg-yellow-600' : 'bg-blue-600'}">${lata.bando}</span>
                <span class="text-xs text-gray-400 uppercase font-semibold">${lata.zona} - ${lata.tipo}</span>
            </div>
            <h3 class="font-bold text-sm mb-3 text-orange-400">${lata.nombre}</h3>
            
            <div id="${idContenedorVideo}" class="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                ${plantillaMiniatura}
                <button onclick="cargarVideo('${lata.video_id}', '${idContenedorVideo}', '${lata.plataforma}')" class="relative z-10 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md transition">
                    ▶ Ver Lineup
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function cargarVideo(id, containerId, plataforma) {
    const container = document.getElementById(containerId);
    
    if (plataforma === 'tiktok') {
        // Iframe oficial para reproducir un video de TikTok embebido
        container.innerHTML = `
            <iframe class="w-full h-full" src="https://www.tiktok.com/embed/v2/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    } else {
        // Iframe clásico de YouTube
        container.innerHTML = `
            <iframe class="w-full h-full" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    }
}

// Función extra por si quieren volver a empezar desde cero
function reiniciarFiltros() {
    filtroActual = { mapa: '', bando: '', zona: '', tipo: '' };
    document.getElementById('seccion-mapas').classList.remove('hidden');
    document.getElementById('seccion-bandos').classList.add('hidden');
    document.getElementById('seccion-zonas').classList.add('hidden');
    document.getElementById('seccion-tipos').classList.add('hidden');
    actualizarPantalla();
}