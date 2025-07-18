function generateEvoChainHTML(evoList) {
    let html = `<div class="evo-chain">`;

    evoList.forEach((evo, index) => {
        html += `
            <div class="evo-stage">
                <img src="${evo.img}" alt="${evo.name}">
                <p>${evo.name}</p>
            </div>`;

        if (index < evoList.length - 1) {
            html += `<div class="evo-arrow">&#8667;</div>`;
        }
    });

    html += `</div>`;
    return html;
}
