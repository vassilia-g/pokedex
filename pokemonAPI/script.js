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
        html += pokemonTemplate(pokemon);
        console.log(pokemon);
    });

    contentElement.innerHTML = html;

    activatePopovers()
} 

function pokemonTemplate(pokemon) {
    let typesHTML = '';
    let mainType = pokemon.types[0].type.name;
    
    pokemon.types.forEach(typeInfo => {
        typesHTML += `<img class="${typeInfo.type.name}-type" 
            src="imgs/icons/${typeInfo.type.name}.svg" 
            data-bs-toggle="popover" 
            data-bs-trigger="hover" 
            data-bs-placement="bottom" 
            data-bs-content="${typeInfo.type.name}" 
        /> `;
    });

    return `
        <div class="card ${mainType}" style="width: 23rem;">
            <div class="card-body">
                <h5 class="card-title title">#${pokemon.id} ${pokemon.name}</h5>
                <hr>
                <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="card-img-top pokemon-artwork" alt="...">
                <hr>
                <div class="pokemon-types">
                    ${typesHTML.trim()}
                </div>
            </div>
        </div>
    `;
}

function activatePopovers() {
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
}

document.addEventListener('DOMContentLoaded', function () {
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
  });
