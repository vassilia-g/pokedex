let pokemonList = [];
let activePokemonList = [];
let currentOffset = 0;
let isLoading = false;
const limit = 40;

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
    activePokemonList = pokemonList.slice(currentOffset, currentOffset + limit);
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
    isLoading = true;
    currentOffset += limit;
    await loadData(currentOffset);
    renderPokemonList();
    isLoading = false;
}

async function renderAllLoadedPokemon() {
    activePokemonList = pokemonList;
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

    let filteredPokemonList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(input));
    activePokemonList = filteredPokemonList;

    let html = '';
    filteredPokemonList.forEach(pokemon => {
        html += mainTemplate(pokemon);
    });

    if (html == '') {
        html += `
            <div class="no-pokemon-found">
                <img src="imgs/sad-pokemon.png">
                <p style="color: white !important;">No Pokémon found</p>
            </div>`;
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

document.addEventListener('show.bs.modal', function (event) {
    if (isLoading) {
        event.preventDefault();
    }
});

document.addEventListener('shown.bs.modal', function (event) {
    const modal = event.target;
    const pokemonId = parseInt(modal.id.split('-')[1]);

    const index = activePokemonList.findIndex(p => p.id === pokemonId);
    const leftArrow = document.getElementById(`left-arrow-${pokemonId}`);
    const rightArrow = document.getElementById(`right-arrow-${pokemonId}`);

    if (leftArrow) leftArrow.classList.remove('d-none');
    if (rightArrow) rightArrow.classList.remove('d-none');

    if (index === 0 && leftArrow) {
        leftArrow.classList.add('d-none');
    }

    if (index === activePokemonList.length - 1 && rightArrow) {
        rightArrow.classList.add('d-none');
    }
});
