function progressBarsTemplate(pokemon) {
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