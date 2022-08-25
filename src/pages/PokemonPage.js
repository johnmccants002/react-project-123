import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocalStorage} from '../helper/LocalStorage'
import '../styling/PokemonPage.css'
import Pokemon from '../components/Pokemon'

const POKEDB_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000"

export default function PokemonPage() {
    const [pokemon, setPokemon] = useState(null);
    const [allPokemon, setAllPokemon] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [favorites, setFavorites] = useLocalStorage('pokemons', []);
    const [error, setError] = useState(null);
    const [pokeIndex, setPokeIndex] = useLocalStorage('allPokemons', []);


    useEffect(() => {
       startUp()
    }, [])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    function savePokemon(event) {
        setFavorites(prev => [...prev, allPokemon[event.target.id]]);
        
    }

    function removePokemon(event) {
        const reducedArr = [...favorites]
        reducedArr.splice(event.target.id, 1)
        setFavorites(reducedArr)
    }

    function startUp() {
        if(pokeIndex.length === 0) {
            axios.get(`${POKEDB_URL}`)
            .then((response) => {
                setPokeIndex(response.data.results)
                console.log("This is the PokeDB: ", response.data)

            }).catch((err) => {
                console.log("Unable to set the PokeDB: ", err)
            })
        }
    }

    async function filteringPokemon(results) {
        let finalResults = [];
            for (let i = 0; i < results.length; i++){
                console.log(results[i].url, "URL")
                if (finalResults.length < 10) {
                    await axios.get(results[i].url)
                    .then((response) => {
                        finalResults.push(response.data)
                    }).catch((err) => {
                    
                    })
                }        
        }
        setAllPokemon(finalResults)
    }   

    function displayResults() {
        let views = [];
        for (let i =0; i < allPokemon.length; i++) {
            views.push(
                <div className="results">
                    <Pokemon pokemon={allPokemon[i]}/>
                    {alreadySaved(allPokemon[i].forms[0].name, i)}
                </div>
            )
        }
        return (views)
    }


    function displayFavorites() {
        let views = [];
        for (let i = 0; i < favorites.length; i++) {
            views.push(
                <div className="favorites">
                    <Pokemon pokemon={favorites[i]} />
                    <button class="removePokemon" id={i} onClick={removePokemon}>Remove Pokemon</button>
                </div>
            )
        }
        return (views)
    }

    function alreadySaved(name, i) {
        if (favorites.some(fav => fav.forms[0].name === name)) {
            return (<h4>Saved</h4>)
        } else {
            return (<button id={i} onClick={savePokemon}>Save Pokemon to Favorites</button>)
        }
    }

    function handleChange(event) {
        setSearchText(event.target.value)
        

    }

    function handleSubmit(event) {
        event.preventDefault()
        setAllPokemon([]);
        if (searchText == '') {
            setAllPokemon([]);
            return
        }
        if(!pokeIndex.length) {
            startUp()
        } else {
            const filteredResults = pokeIndex.filter(p => p['name'].includes(searchText))
            console.log(filteredResults[0], "<-- Filtered results")
            
            filteringPokemon(filteredResults)

        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Search Pokemon by name:
                    <input type="text" value={searchText} onChange={handleChange} />
                </label>
                <input type="submit" value="Search" />
            </form>
            { allPokemon.length > 0 ?
                <div>
                    <h1>Results: </h1>
                    <div className="resultsContainer"> 
                        {displayResults()} 
                    </div>
                </div> 
                : 
                <h3>Pokemon Not Found</h3>    
            }

            <div>
                <h1> Your Favorites </h1>
                <div className="favoritesContainer">
                    {displayFavorites()}
                </div>
            </div>





        </div>
    )

}


