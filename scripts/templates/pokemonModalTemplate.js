function pokemonModalTemplate(pokemon) {
    let mainType = pokemon.types[0].type.name;
    let modalId = `pokemonModal-${pokemon.id}`;

    return `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="modalLabel-${pokemon.id}" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalLabel-${pokemon.id}">#${pokemon.id.toString().padStart(4, '0')} ${pokemon.name}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body ${mainType}">
                    <div class="pokemon-modal-img">
                        <img src="${pokemon.sprites.other["official-artwork"].front_default}" class="img-fluid pokemon-img-fluid pokemon-artwork" alt="${pokemon.name}">
                    </div>
                    <div class="pokemon-types-modal">
                        ${pokemon.types.map(typeInfo => pokemonIconTemplate(typeInfo)).join('')}
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
                            ${progressBarsTemplate(pokemon, mainType)}
                        </div>

                        <div class="container tab-pane fade" id="contact-tab-pane-${pokemon.id}" role="tabpanel" aria-labelledby="contact-tab-${pokemon.id}" tabindex="0">   
                            <div id="evo-chain-${pokemon.id}">Loading evolution chain...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}