async function evoChainTemplate(pokemon) {
    let speciesResponse = await fetch(pokemon.species.url);
    let speciesElement = await speciesResponse.json();
    let evoChainResponse = await fetch(speciesElement.evolution_chain.url);
    let evoChainElement = await evoChainResponse.json();
    let chainElement = evoChainElement.chain, evoNames = [];

    while (chainElement) {
        evoNames.push(chainElement.species.name);
        chainElement = chainElement.evolves_to[0];
    }

    let evoChainHtml = `<div class="evo-chain">`;

    for (let i = 0; i < evoNames.length; i++) {
        const evoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoNames[i]}`);
        const evoElement = await evoResponse.json();
        evoChainHtml += `<div class="evo-stage">
                        <img src="${evoElement.sprites.other['official-artwork'].front_default}" alt="${evoNames[i]}">
                        <p>${evoNames[i]}</p>
                    </div>`;
        if (i < evoNames.length - 1) evoChainHtml += `<div class="evo-arrow">&#8667;</div>`;
    }

    evoChainHtml += `</div>`;
    return evoChainHtml;
}