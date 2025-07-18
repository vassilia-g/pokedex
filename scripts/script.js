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
    const input = getSearchInput();
    const contentElement = document.getElementById('content');
    const loadingButtonElement = document.getElementById('loading-button');

    if (input === '') {
        resetSearchView(contentElement);
        return;
    }

    if (input.length < 3) return;

    const filteredList = filterPokemonList(input);
    activePokemonList = filteredList;

    const html = generateSearchHTML(filteredList);
    contentElement.innerHTML = html;

    activatePopovers();
    hideLoadingButton(loadingButtonElement);
}

function getSearchInput() {
    return document.getElementById('searchInput').value.trim().toLowerCase();
}

function resetSearchView(contentElement) {
    contentElement.innerHTML = '';
    renderAllLoadedPokemon();
}

function filterPokemonList(input) {
    return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(input));
}

function hideLoadingButton(button) {
    if (button) button.classList.add('hidden');
}

async function showEvoChain(pokemon) {
    const evoChainHTML = await evoChainTemplate(pokemon);
    document.getElementById(`evo-chain-${pokemon.id}`).innerHTML = evoChainHTML;
}

async function evoChainTemplate(pokemon) {
    const evoData = await fetchEvoChainData(pokemon);
    const evoChain = await buildEvoChainList(evoData);
    return generateEvoChainHTML(evoChain);
}

async function fetchEvoChainData(pokemon) {
    const speciesResponse = await fetch(pokemon.species.url);
    const species = await speciesResponse.json();
    const evoChainResponse = await fetch(species.evolution_chain.url);
    return await evoChainResponse.json();
}

async function buildEvoChainList(chainData) {
    let evoList = [];
    let chain = chainData.chain;

    while (chain) {
        const name = chain.species.name;
        const data = await fetchPokemonData(name);
        evoList.push({ name: name, img: data.sprites.other["official-artwork"].front_default });
        chain = chain.evolves_to[0];
    }

    return evoList;
}

async function fetchPokemonData(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return await response.json();
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
