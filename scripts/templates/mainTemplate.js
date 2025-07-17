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
                <h5 class="card-title title">#${pokemon.id.toString().padStart(4, '0')} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h5>
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