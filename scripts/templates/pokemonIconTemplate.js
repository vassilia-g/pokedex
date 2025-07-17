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