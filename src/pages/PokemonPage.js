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


    function getPokemon() {
        axios.get(`${BASE_URL}/${searchText}`)
        .then((response) => {
            setPokemon(response.data)
            console.log("this is the saved pokemon: ", pokemon)
        }).catch((err) => {
            console.log('we have an error: ', err, "this is the url", process.env.POKEMON_BASE_URL)
            setError(err)
            setPokemon(null)
        })
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
                    <h3>{pokemon.forms[0].name}</h3>
                </div>
                :
                <div>Pokemon Not Found</div>
            }





        </div>
    )

}


