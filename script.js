const pokedex = document.getElementById('pokedex');
const pokemonDetails = document.getElementById('pokemon-details');
const pokemonNameMap = {};


const fetchPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=150`;
    const res = await fetch(url);
    const data = await res.json();
    const promises = data.results.map(async (result, index) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index + 1}`);
        const pokemonSpeciesData = await res.json();
        const frenchName = pokemonSpeciesData.names.find(name => name.language.name === "fr").name;

        pokemonNameMap[frenchName] = result.name;

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
        <li class="card" onclick="displayDetails(${pokeman.id})"> <!-- use pokeman.id instead of pokeman.name -->
            <img class="pokemon-image" src="${pokeman.image}"/>
            <h2 class="pokemon-name">${pokeman.name}</h2>
            <p class="pokemon-number">N°${pokeman.id}</p>
        </li>`
    ).join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const displayDetails = async (pokemonId) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokeman = await res.json();
    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const pokemanSpecies = await resSpecies.json();
    const frenchName = pokemanSpecies.names.find(name => name.language.name === "fr").name;
    pokemonDetails.innerHTML = `
        <h2>${frenchName}</h2>
        <img src="${pokeman.sprites.front_default}"/>
        <p>Type: ${pokeman.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p>Hauteur: ${pokeman.height / 10} m</p>
        <p>Poids: ${pokeman.weight / 10} kg</p>
        
    `
};

fetchPokemon();

function searchFunction() {
    let input, filter, ul, li, i, txtValueName, txtValueNumber;
    input = document.getElementById('searchBar');
    filter = input.value.toUpperCase();
    ul = document.getElementById('pokedex');
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        txtValueName = li[i].getElementsByClassName('pokemon-name')[0].innerText;
        txtValueNumber = li[i].getElementsByClassName('pokemon-number')[0].innerText;
        if (txtValueName.toUpperCase().indexOf(filter) > -1 || txtValueNumber.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}