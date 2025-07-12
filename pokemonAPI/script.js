// const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// console.log(BASE_URL);
let pokemonList;

async function onloadFunc() {
    await loadData("https://pokeapi.co/api/v2/pokemon?limit=200&offset=0");
    // console.log(pokemonList);
    renderPokemonList();
}

async function loadData(url) {
    let response = await fetch(url);
    let responseToJson = await response.json();
    let results = responseToJson.results;

    // Fetch details for each Pokémon and store in pokemonList
    pokemonList = [];
    for (const pokemon of results) {
        let detailsResponse = await fetch(pokemon.url);
        let details = await detailsResponse.json();
        pokemonList.push(details);
    }
}

function renderPokemonList() {
    let contentElement = document.getElementById('content');
    let html = '';
    
    pokemonList.forEach(pokemon => {
        html += mainTemplate(pokemon);
        console.log(pokemon);
    });

    contentElement.innerHTML = html;

    activatePopovers()
} 

function mainTemplate(pokemon) {
    let typesHTML = '';
    let mainType = pokemon.types[0].type.name;
    let modalId = `pokemonModal-${pokemon.id}`;

    pokemon.types.forEach(typeInfo => {
        typesHTML += pokemonIconTemplate(typeInfo);
    });

    let pokemonsModal = pokemonModalTemplate(pokemon);

    return `
        <div class="card pockemon-card ${mainType}">
            <div class="card-body">
                <h5 class="card-title title">#${pokemon.id} ${pokemon.name}</h5>
                <hr>
                <img 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-target="#${modalId}" 
                    src="${pokemon.sprites.other["official-artwork"].front_default}" 
                    class="card-img-top pokemon-artwork"
                    alt="${pokemon.name}"
                >
                <hr>
                <div class="pokemon-types">
                    ${typesHTML.trim()}
                </div>
            </div>
        </div>
        ${pokemonsModal}
    `;
}

function pokemonIconTemplate(typeInfo) {
    return `
        <img 
            class="${typeInfo.type.name}-type" 
            src="imgs/icons/${typeInfo.type.name}.svg" 
            data-bs-toggle="popover" 
            data-bs-trigger="hover" 
            data-bs-placement="bottom" 
            data-bs-html="true"
            data-bs-content="<span class='${typeInfo.type.name}-text'>${typeInfo.type.name}</span>"
    /> `;
}

function pokemonModalTemplate(pokemon) {
    let mainType = pokemon.types[0].type.name;
    let modalId = `pokemonModal-${pokemon.id}`;

    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="modalLabel-${pokemon.id}" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="modalLabel-${pokemon.id}">#${pokemon.id} ${pokemon.name}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body ${mainType}">
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="img-fluid" alt="${pokemon.name}">
                        <!-- Hier kannst du weitere Infos anzeigen -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function activatePopovers() {
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
}