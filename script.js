document.addEventListener("DOMContentLoaded", function () {
    const pokeList = document.getElementById('pokeList');
    const pokemonDetailsElement = document.getElementById('pokeSprite');
    let pokemons;
    
    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', next);

    const previousButton = document.getElementById('previousButton');
    previousButton.addEventListener('click', previous);

    let currentPage = 1;

    function next() {
        currentPage++;
        const offset = (currentPage - 1) * 20;
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
    
        RequestHttp(url)
            .then((data) => {
                pokemons = data;
                pokeList.innerHTML = ''; 
                fillPokeList(data);
            })
            .catch((error) => {
                console.error('Erreur lors du chargement de la page suivante :', error);
            });
            if(currentPage > 64) {
                currentPage = 0;
                return;
            }
            
        console.log(currentPage);
    }
        
    function previous() {
        if (currentPage > 1) {
            currentPage--;
            const offset = (currentPage - 1) * 20;
            const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;

            RequestHttp(url)
                .then((data) => {
                    pokemons = data;
                    pokeList.innerHTML = ''; 
                    fillPokeList(data);
                })
                .catch((error) => {
                    console.error('Erreur lors du chargement de la page précédente :', error);
                });
        }
    }

    function RequestHttp(url) {
        return fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erreur de requête HTTP');
                }
            });
    }

    function fillPokeList(pokemons) {
        for (let i = 0; i < 20; i++) {
            const listItem = document.createElement('li');
            listItem.textContent =
                "N°" +
                pokemons.results[i].url.substring(34, pokemons.results[i].url.length - 1) + 
                " " +
                pokemons.results[i].name.substring(0,1).toUpperCase() +
                pokemons.results[i].name.substring(1);

            
            listItem.addEventListener('click', () => {
                displayPokemonDetails(pokemons.results[i].url);
            });
            pokeList.appendChild(listItem);
        }
    }

    function displayPokemonDetails(url) {
        RequestHttp(url)
            .then((data) => {
                const name = 
                    data.name.substring(0,1).toUpperCase() +
                    data.name.substring(1);
                const sprite = data.sprites.front_default;
                const height = data.height;
                const weight = data.weight;

                const detailsHTML = `
                    <h2 class="pokeName">${name}</h2>
                    <img src="${sprite}" alt="${name}" class="pokeSprite">
                    <p>Hauteur : ${height / 10} m</p>
                    <p>Poids : ${weight / 10} kg</p>
                `;

                pokemonDetailsElement.innerHTML = detailsHTML;
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des détails du Pokémon :', error);
            });
    }

    function initList() {
        RequestHttp('https://pokeapi.co/api/v2/pokemon/')
            .then((data) => {
                pokemons = data;
                fillPokeList(data);
            })
            .catch((error) => {
                console.error('Erreur lors de l\'initialisation de la liste :', error);
            });
    }




    initList();
});