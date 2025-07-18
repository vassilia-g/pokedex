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
