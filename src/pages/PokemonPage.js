import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocalStorage} from '../helper/LocalStorage'
import '../styling/PokemonPage.css'

const BASE_URL = "https://pokeapi.co/api/v2/pokemon"

export default function PokemonPage() {
    const [pokemon, setPokemon] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [favorites, setFavorites] = useLocalStorage('pokemons', []);
    const [error, setError] = useState(null);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    function getPokemon() {
        axios.get(`${BASE_URL}/${searchText.toLowerCase()}`)
        .then((response) => {
            setPokemon(response.data)
            console.log("this is the saved pokemon: ", pokemon)
            setSearchText('')
        }).catch((err) => {
            console.log('we have an error: ', err, "this is the url", process.env.POKEMON_BASE_URL)
            setError(err)
            setPokemon(null)
            setSearchText('')
        })
        
    }

    function savePokemon() {
        setFavorites(prev => [...prev, pokemon]);
        
    }

    function removePokemon() {

    }

    function displayFavorites() {
        let views = [];
        for (let i = 0; i < favorites.length; i++) {
            views.push(
                <div className="favorites">
                    {capitalizeFirstLetter(favorites[i].forms[0].name)}
                    <img src={favorites[i].sprites.front_shiny} alt={''} />
                    <button class="removePokemon" id={i} onClick={removePokemon}>Remove Pokemon</button>
                </div>
            )
        }

        return (views)
    }

    function alreadySaved() {
        if (favorites.some(fav => fav.forms[0].name === pokemon.forms[0].name)) {
            return (<h4>Saved</h4>)
        } else {
            return (<button onClick={savePokemon}>Save Pokemon to Favorites</button>)
        }
    }

    function handleChange(event) {
        setSearchText(event.target.value)
        

    }

    function handleSubmit(event) {
        event.preventDefault()
        getPokemon()

    }
 

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Search Pokemon by name:
                    <input type="text" value={searchText} onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {pokemon ? 
                <div>
                    <img src={pokemon.sprites.front_shiny} alt="" />
                    <h3>{capitalizeFirstLetter(pokemon.forms[0].name)}</h3>
                    {alreadySaved()}
                </div>
                :
                <div>Pokemon Not Found</div>
            }

            <div>
                <h1> Your Favorites </h1>
                <div className="favoritesContainter">
                    {displayFavorites()}
                </div>
            </div>





        </div>
    )

}


