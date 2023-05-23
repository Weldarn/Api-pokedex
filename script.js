// Déclarations des variables globales :
// pokedex et pokemonDetails sont les conteneurs HTML où seront affichés les Pokémon.
// pokemonNameMap est un objet qui va stocker la correspondance entre le nom français et le nom anglais de chaque Pokémon.
const pokedex = document.getElementById('pokedex');
const pokemonDetails = document.getElementById('pokemon-details');
const pokemonNameMap = {};

// Fonction pour récupérer les données des Pokémon depuis l'API.
const fetchPokemon = async () => {
    // Appel de l'API pour récupérer la liste de Pokémon.
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1008`;
    const res = await fetch(url);
    // Conversion de la réponse en JSON.
    const data = await res.json();
    const promises = data.results.map(async (result, index) => {
        // Pour chaque Pokémon, appel de l'API pour récupérer les données spécifiques de l'espèce.
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index + 1}`);
        const pokemonSpeciesData = await res.json();
        // Récupération du nom français du Pokémon.
        const frenchName = pokemonSpeciesData.names.find(name => name.language.name === "fr").name;
        // Ajout du nom français et du nom anglais à l'objet pokemonNameMap.
        pokemonNameMap[frenchName] = result.name;

        return {
            // Création d'un objet pour chaque Pokémon avec toutes ses données, y compris l'URL de l'image.
            ...result,
            id: index + 1,
            name: frenchName,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        };
    });
    const pokemon = await Promise.all(promises);
    // Appel de la fonction displayPokemon pour afficher les Pokémon.
    displayPokemon(pokemon);
};

// Fonction pour afficher les Pokémon.
const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map(
        (pokeman) => `
        <li class="card" onclick="displayDetails(${pokeman.id})">
            <img class="pokemon-image" src="${pokeman.image}"/>
            <h2 class="pokemon-name">${pokeman.name}</h2>
            <p class="pokemon-number">N°${pokeman.id}</p>
        </li>`
    ).join('');
    // Création d'une chaîne de caractères HTML pour chaque Pokémon, puis affectation de cette chaîne au conteneur pokedex.
    pokedex.innerHTML = pokemonHTMLString;
};

// Fonction pour afficher les détails d'un Pokémon spécifique.
const displayDetails = async (pokemonId) => {
    // Appel de l'API pour récupérer les données du Pokémon spécifique.
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokeman = await res.json();
    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const pokemanSpecies = await resSpecies.json();
    // Récupération du nom français du Pokémon.
    const frenchName = pokemanSpecies.names.find(name => name.language.name === "fr").name;

    // Récupération des statistiques du Pokémon
    const stats = pokeman.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('<br>');

    // Création d'une chaîne de caractères HTML pour le Pokémon spécifique, puis affectation de cette chaîne au conteneur pokemonDetails.
    pokemonDetails.innerHTML = `
        <h2>${frenchName}</h2>
        <img src="${pokeman.sprites.front_default}"/>
        <p>${stats}</p>
    `;
};

// Appel de la fonction fetchPokemon au chargement du script.
fetchPokemon();

// Fonction pour rechercher des Pokémon en fonction du nom ou du numéro.
function searchFunction() {
    // Récupération de la valeur de la barre de recherche, de la liste de Pokémon et de chaque élément de la liste.
    let input, filter, ul, li, i, txtValueName, txtValueNumber;
    input = document.getElementById('searchBar');
    filter = input.value.toUpperCase();
    ul = document.getElementById('pokedex');
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        // Récupération du nom et du numéro du Pokémon.
        txtValueName = li[i].getElementsByClassName('pokemon-name')[0].innerText;
        txtValueNumber = li[i].getElementsByClassName('pokemon-number')[0].innerText;

        // Si le nom ou le numéro du Pokémon contient le texte recherché, afficher l'élément de la liste.
        if (txtValueName.toUpperCase().indexOf(filter) > -1 || txtValueNumber.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}