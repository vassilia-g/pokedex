const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

console.log(BASE_URL);

function onloadFunc() {
    loadData();
}

async function loadData() {
    let response = await fetch(BASE_URL);
    let responseToJson = await response.json();
    console.log(responseToJson);

    nameData(responseToJson.results);
}

function nameData(pokemonList) {
    let contentElement = document.getElementById('content');
    let html = '';
    
    pokemonList.forEach(pokemon => {
        html += pokemonTemplate(pokemon.name);
    });

    contentElement.innerHTML = html;
} 

function pokemonTemplate(pokemonName) {
    return `
        <h3 style="font-size: 20px;">${pokemonName}</h3>
    `;
}
