function pokemonStatsTemplate(pokemon) {
    let mainType = pokemon.types[0].type.name;
    return `
        <div class="row">
            <div class="col-6 col-6-stats">
                Base Experience
            </div>
            <div class="col-6 col-6-stats">
                <span class="badge ${mainType}-progress">${pokemon.base_experience}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-6-stats">
                Height
            </div>
            <div class="col-6 col-6-stats">
                <span class="badge ${mainType}-progress">${pokemon.height / 10} m</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-6-stats">
                Weight
            </div>
            <div class="col-6 col-6-stats">
                <span class="badge ${mainType}-progress">${pokemon.weight / 10} kg</span>
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-6-stats">
                Abilities
            </div>
            <div class="col-6 col-6-stats">
                ${pokemon.abilities.map(ability => `
                    <span class="badge ${mainType}-progress" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-html="true" data-bs-content="<span class='ability-text'>${ability.ability.name}</span>">
                        ${ability.ability.name}
                    </span>
                `).join(' ')}
            </div>
        </div>
    `;
}