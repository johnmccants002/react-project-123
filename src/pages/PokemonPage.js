import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocalStorage} from '../helper/LocalStorage'
import '../Styling/PokemonPage.css'

export default function PokemonPage() {
    const [pokemon, setPokemon] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [favorites, setFavorites] = useLocalStorage('pokemons', []);
    const [error, setError] = useState(null);


    return (
        <></>
    )

}


