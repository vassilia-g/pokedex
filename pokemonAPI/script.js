// const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// console.log(BASE_URL);
let pokemonList;
let currentOffset = 0;
const limit = 9;


async function onloadFunc() {
    pokemonList = [];
    currentOffset = 0;
    await loadData(currentOffset);
    renderPokemonList();
}

async function loadData(offset) {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    let responseToJson = await response.json();
    let results = responseToJson.results;

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
                <h5 class="card-title title">#${pokemon.id.toString().padStart(4, '0')} ${pokemon.name}</h5>
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
                    <div class="pokemon-modal-img">
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="img-fluid pokemon-img-fluid pokemon-artwork" alt="${pokemon.name}">
                    </div>
                    <ul class="nav nav-tabs" id="myTab-${pokemon.id}" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active nav-link-button" id="home-tab-${pokemon.id}" data-bs-toggle="tab" data-bs-target="#home-tab-pane-${pokemon.id}" type="button" role="tab" aria-controls="home-tab-pane-${pokemon.id}" aria-selected="true">Main</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link nav-link-button" id="profile-tab-${pokemon.id}" data-bs-toggle="tab" data-bs-target="#profile-tab-pane-${pokemon.id}" type="button" role="tab" aria-controls="profile-tab-pane-${pokemon.id}" aria-selected="false">Stats</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link nav-link-button" id="contact-tab-${pokemon.id}" data-bs-toggle="tab" data-bs-target="#contact-tab-pane-${pokemon.id}" type="button" role="tab" aria-controls="contact-tab-pane-${pokemon.id}" aria-selected="false">Evo Chain</button>
                        </li>
                    </ul>
                    <div class="tab-content pokemon-tab-content" id="myTabContent-${pokemon.id}">
                        <div class="container tab-pane fade show active" id="home-tab-pane-${pokemon.id}" role="tabpanel" aria-labelledby="home-tab-${pokemon.id}" tabindex="0">
                            ${pokemonStatsTemplate(pokemon)}
                        </div>

                        <div class="container tab-pane fade" id="profile-tab-pane-${pokemon.id}" role="tabpanel" aria-labelledby="profile-tab-${pokemon.id}" tabindex="0">   
                            ${progressBars(pokemon, mainType)}
                        </div>

                        <div class="container tab-pane fade" id="contact-tab-pane-${pokemon.id}" role="tabpanel" aria-labelledby="contact-tab-${pokemon.id}" tabindex="0">   
                            Evo Chain content here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}

function pokemonStatsTemplate(pokemon) {
    let mainType = pokemon.types[0].type.name;
    return `
        <div class="row">
            <div class="col-6">
                Base Experience
            </div>
            <div class="col-6">
                <span class="badge ${mainType}-progress">${pokemon.base_experience}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                Height
            </div>
            <div class="col-6">
                <span class="badge ${mainType}-progress">${pokemon.height / 10} m</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                Weight
            </div>
            <div class="col-6">
                <span class="badge ${mainType}-progress">${pokemon.weight / 10} kg</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                Abilities
            </div>
            <div class="col-6">
                ${pokemon.abilities.map(ability => `
                    <span class="badge ${mainType}-progress" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-html="true" data-bs-content="<span class='ability-text'>${ability.ability.name}</span>">
                        ${ability.ability.name}
                    </span>
                `).join(' ')}
            </div>
        </div>
    `;
}
function progressBars(pokemon) {
    let mainType = pokemon.types[0].type.name;

    return pokemon.stats.map(stat => `
        <div class="mb-3">
            <div class="row">
                <div class="col-6 col-6-modal">
                    ${stat.stat.name}
                </div>
                <div class="col-6">
                    : ${stat.base_stat} xp
                </div>
            </div>    
            <div class="progress progress-bar-modal" role="progressbar" aria-label="${stat.stat.name}" aria-valuenow="${stat.base_stat}" aria-valuemin="0" aria-valuemax="200">
                <div class="progress-bar ${mainType}-progress" style="width: ${stat.base_stat}%"></div>
            </div>
        </div>
    `).join('');
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