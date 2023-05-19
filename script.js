const pokedex = document.getElementById('pokedex');
const pokemonDetails = document.getElementById('pokemon-details'); // Modification ici

const fetchPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=150`;
    const res = await fetch(url);
    const data = await res.json();
    const promises = data.results.map(async (result, index) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index + 1}`);
        const pokemonSpeciesData = await res.json();
        const frenchName = pokemonSpeciesData.names.find(name => name.language.name === "fr").name;
        return {
            ...result,
            id: index + 1,
            name: frenchName,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        };
    });
    const pokemon = await Promise.all(promises);
    displayPokemon(pokemon);
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map(
        (pokeman) => `
        <li class="card" onclick="displayDetails('${pokeman.name}')">
            <img class="pokemon-image" src="${pokeman.image}"/>
            <h2 class="pokemon-name">${pokeman.name}</h2>
            <p class="pokemon-number">N°${pokeman.id}</p>
        </li>`
    ).join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const displayDetails = async (pokemonName) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokeman = await res.json();
    pokemonDetails.innerHTML = `  // Modification ici
        <h2>${pokeman.name}</h2>
        <img src="${pokeman.sprites.front_default}"/>
        <p>Hauteur: ${pokeman.height}</p>
        <p>Poids: ${pokeman.weight}</p>
        <p>Type: ${pokeman.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
    `;
}

fetchPokemon();

function searchFunction() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchBar');
    filter = input.value.toUpperCase();
    ul = document.getElementById('pokedex');
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('h2')[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}