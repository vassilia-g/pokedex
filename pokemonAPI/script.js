// const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// console.log(BASE_URL);
let pokemonList;

async function onloadFunc() {
    await loadData("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
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
} 

function pokemonTemplate(pokemon) {
    return `
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">#${pokemon.id} ${pokemon.name}</h5>
                <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="card-img-top" alt="...">
            </div>
        </div>
    `;
}
