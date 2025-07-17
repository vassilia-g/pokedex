let pokemonList = [];
let currentOffset = 0;
const limit = 20;

async function onloadFunc() {
    await loadData(currentOffset);
    renderPokemonList();
}

async function loadData(offset) {
    showLoadingScreen();
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    let responseToJson = await response.json();
    let results = responseToJson.results;

    for (const pokemon of results) {
        let detailsResponse = await fetch(pokemon.url);
        let details = await detailsResponse.json();
        pokemonList.push(details);
    }

    pokemonList.sort((a, b) => a.id - b.id);
}

function renderPokemonList() {
    let contentElement = document.getElementById('content');
    let html = '';

    let newPokemonList = pokemonList.slice(currentOffset, currentOffset + limit);
    newPokemonList.forEach(pokemon => {
        html += mainTemplate(pokemon);
    });

    contentElement.innerHTML += html;
    activatePopovers();
    hideLoadingScreen();
}

function activatePopovers() {
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
}

async function loadingButton() {
    currentOffset += limit;
    await loadData(currentOffset);
    renderPokemonList();
}

async function renderAllLoadedPokemon() {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';
    showLoadingScreen();
    await new Promise(resolve => setTimeout(resolve, 100));

    pokemonList.forEach(pokemon => {
        contentElement.innerHTML += mainTemplate(pokemon);
    });

    activatePopovers();
    hideLoadingScreen();
}

async function searchPokemon() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    let contentElement = document.getElementById('content');
    let loadingButtonElement = document.getElementById('loading-button');

    if (input === '') {
        contentElement.innerHTML = '';
        renderAllLoadedPokemon();
        return;
    }

    if (input.length < 3) return;

    let html = '';
    let filteredPokemonList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(input));
    filteredPokemonList.forEach(pokemon => {
        html += mainTemplate(pokemon);
    });

    if (html == '') {
        html += ' <div class="no-pokemon-found"><img src="imgs/sad-pokemon.png"><p style="color: white !important;">No Pokémon found</p></div>';
    }

    contentElement.innerHTML = html;
    activatePopovers();

    if (loadingButtonElement) loadingButtonElement.classList.add('hidden');
}

async function showEvoChain(pokemon) {
    const evoChainHTML = await evoChainTemplate(pokemon);
    document.getElementById(`evo-chain-${pokemon.id}`).innerHTML = evoChainHTML;
}

function swipeImage(direction) {
    let currentIndex = parseInt(modalImageElement.getAttribute("index"));
    let total = images.length;

    if (direction === "left") {
        currentIndex = (currentIndex - 1 + total) % total;
    } else if (direction === "right") {
        currentIndex = (currentIndex + 1) % total;
    }

    let newImage = images[currentIndex];
    modalImageElement.setAttribute('src', 'img/' + newImage);
    modalImageElement.setAttribute('index', currentIndex);
    let imageCountElement = document.getElementById('imageCount');
    imageCountElement.innerText = `Bild ${currentIndex + 1} von ${total}`;
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingButton = document.getElementById("loading-button");
    loadingButton.classList.add("hidden");
    loadingScreen.classList.remove("d-none");
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingButton = document.getElementById("loading-button");
    loadingButton.classList.remove("hidden");
    loadingScreen.classList.add("d-none");
}

function showPrevPokemon(currentId) {
    const sorted = [...pokemonList].sort((a, b) => a.id - b.id);
    const currentIndex = sorted.findIndex(pokemon => pokemon.id === currentId);
    if (currentIndex > 0) {
        const prevPokemon = sorted[currentIndex - 1];
        openPokemonModal(prevPokemon.id);
    }
}

function showNextPokemon(currentId) {
    const sorted = [...pokemonList].sort((a, b) => a.id - b.id);
    const currentIndex = sorted.findIndex(pokemon => pokemon.id === currentId);
    if (currentIndex < sorted.length - 1) {
        const nextPokemon = sorted[currentIndex + 1];
        openPokemonModal(nextPokemon.id);
    }
}

function openPokemonModal(pokemonId) {
    // 1. Finde das aktuell offene Modal
    const openModals = document.querySelectorAll('.modal.show');

    if (openModals.length > 0) {
        const currentModal = bootstrap.Modal.getInstance(openModals[0]);

        // 2. Event listener hinzufügen – erst wenn geschlossen, dann das neue öffnen
        openModals[0].addEventListener('hidden.bs.modal', function handleClosed() {
            // Entferne den Event Listener, damit es nicht doppelt feuert
            openModals[0].removeEventListener('hidden.bs.modal', handleClosed);

            // Dann öffne das neue Modal
            const modalElement = document.getElementById(`pokemonModal-${pokemonId}`);
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        });

        // Modal schließen
        currentModal.hide();
    } else {
        // Falls kein Modal offen war
        const modalElement = document.getElementById(`pokemonModal-${pokemonId}`);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
}

// function openPokemonModal(pokemonId) {
//     // Schließe alle offenen Modals
//     document.querySelectorAll('.modal.show').forEach(modal => {
//         bootstrap.Modal.getInstance(modal).hide();
//     });
//     // Öffne das gewünschte Modal
//     let modalElement = document.getElementById(`pokemonModal-${pokemonId}`);
//     if (modalElement) {
//         let modal = new bootstrap.Modal(modalElement);
//         modal.show();
//     }
// }



// LISTENERS

document.addEventListener('shown.bs.tab', async function (event) {
    if (event.target.id.startsWith('contact-tab-')) {
        const pokemonId = event.target.id.replace('contact-tab-', '');
        const pokemon = pokemonList.find(p => p.id == pokemonId);
        if (pokemon) {
            await showEvoChain(pokemon);
        }
    }
});
