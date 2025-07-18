function generateSearchHTML(list) {
    if (list.length === 0) {
        return `
            <div class="no-pokemon-found">
                <img src="imgs/sad-pokemon.png">
                <p style="color: white !important;">No Pokémon found</p>
            </div>`;
    }

    return list.map(pokemon => mainTemplate(pokemon)).join('');
}