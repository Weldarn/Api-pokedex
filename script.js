const pokedex = document.getElementById('pokedex');
const pokemonDetails = document.getElementById('pokemon-details');
const pokemonNameMap = {};
/* Déclarations des variables globales :
- pokedex et pokemonDetails sont les conteneurs HTML où seront affichés les Pokémon.
- pokemonNameMap est un objet qui va stocker la correspondance entre le nom français et le nom anglais de chaque Pokémon. */

const fetchPokemon = async () => {
    /* Fonction pour récupérer les données des Pokémon depuis l'API. */
    const url = `https://pokeapi.co/api/v2/pokemon?limit=150`;
    const res = await fetch(url);
    /* Appel de l'API pour récupérer la liste de Pokémon. */
    const data = await res.json();
    /* Conversion de la réponse en JSON. */
    const promises = data.results.map(async (result, index) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index + 1}`);
        /* Pour chaque Pokémon, appel de l'API pour récupérer les données spécifiques de l'espèce. */
        const pokemonSpeciesData = await res.json();
        const frenchName = pokemonSpeciesData.names.find(name => name.language.name === "fr").name;
        /* Récupération du nom français du Pokémon. */
        pokemonNameMap[frenchName] = result.name;
        /* Ajout du nom français et du nom anglais à l'objet pokemonNameMap. */
        return {
            ...result,
            id: index + 1,
            name: frenchName,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
            /* Création d'un objet pour chaque Pokémon avec toutes ses données, y compris l'URL de l'image. */
        };
    });
    const pokemon = await Promise.all(promises);
    /* Attente que toutes les promesses soient résolues. */
    displayPokemon(pokemon);
    /* Appel de la fonction displayPokemon pour afficher les Pokémon. */
};

const displayPokemon = (pokemon) => {
    /* Fonction pour afficher les Pokémon. */
    const pokemonHTMLString = pokemon.map(
        (pokeman) => `
        <li class="card" onclick="displayDetails(${pokeman.id})">
            <img class="pokemon-image" src="${pokeman.image}"/>
            <h2 class="pokemon-name">${pokeman.name}</h2>
            <p class="pokemon-number">N°${pokeman.id}</p>
        </li>`
    ).join('');
    pokedex.innerHTML = pokemonHTMLString;
    /* Création d'une chaîne de caractères HTML pour chaque Pokémon, puis affectation de cette chaîne au conteneur pokedex. */
};

const displayDetails = async (pokemonId) => {
    /* Fonction pour afficher les détails d'un Pokémon spécifique. */
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    /* Appel de l'API pour récupérer les données du Pokémon spécifique. */
    const pokeman = await res.json();
    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const pokemanSpecies = await resSpecies.json();
    const frenchName = pokemanSpecies.names.find(name => name.language.name === "fr").name;
    /* Récupération du nom français du Pokémon. */
    pokemonDetails.innerHTML = `
        <h2>${frenchName}</h2>
        <img src="${pokeman.sprites.front_default}"/>
        <p>Type: ${pokeman.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p>Hauteur: ${pokeman.height / 10} m</p>
        <p>Poids: ${pokeman.weight / 10} kg</p>
    `
    /* Création d'une chaîne de caractères HTML pour le Pokémon spécifique, puis affectation de cette chaîne au conteneur pokemonDetails. */
};

fetchPokemon();
/* Appel de la fonction fetchPokemon au chargement du script. */

function searchFunction() {
    /* Fonction pour rechercher des Pokémon en fonction du nom ou du numéro. */
    let input, filter, ul, li, i, txtValueName, txtValueNumber;
    input = document.getElementById('searchBar');
    filter = input.value.toUpperCase();
    ul = document.getElementById('pokedex');
    li = ul.getElementsByTagName('li');
    /* Récupération de la valeur de la barre de recherche, de la liste de Pokémon et de chaque élément de la liste. */

    for (i = 0; i < li.length; i++) {
        txtValueName = li[i].getElementsByClassName('pokemon-name')[0].innerText;
        txtValueNumber = li[i].getElementsByClassName('pokemon-number')[0].innerText;
        /* Récupération du nom et du numéro du Pokémon. */
        if (txtValueName.toUpperCase().indexOf(filter) > -1 || txtValueNumber.toUpperCase().indexOf(filter) > -1) {
            /* Si le nom ou le numéro du Pokémon contient le texte recherché, afficher l'élément de la liste. */
            li[i].style.display = '';
        } else {
            /* Sinon, masquer l'élément de la liste. */
            li[i].style.display = 'none';
        }
    }
}