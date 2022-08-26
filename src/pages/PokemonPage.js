import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocalStorage} from '../helper/LocalStorage'
import '../styling/PokemonPage.css'
import Pokemon from '../components/Pokemon'
import SearchIcon from '@mui/icons-material/Search';
import { Icon } from '@iconify/react';


const POKEDB_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000"

export default function PokemonPage() {
    const [allPokemon, setAllPokemon] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [favorites, setFavorites] = useLocalStorage('pokemons', []);
    const [error, setError] = useState(null);
    const [pokeIndex, setPokeIndex] = useLocalStorage('allPokemons', []);
    
    useEffect(() => {
       startUp()
    }, [])

    // Local Storage Crud Functions

    function savePokemon(event) {
        setFavorites(prev => [...prev, allPokemon[event.target.id]]);
        
    }

    function removePokemon(event) {
        console.log("Button id = ", event.target.id)
        const newArray = favorites.filter(function(fav) {
            return fav.forms[0].name !== event.target.id
        })
        setFavorites(newArray)
      
    }

    // Setting Up LocalStorage Mini DB of Pokemon

    function startUp() {
        if(pokeIndex.length === 0) {
            axios.get(`${POKEDB_URL}`)
            .then((response) => {
                setPokeIndex(response.data.results)

            }).catch((err) => {
                console.log("Unable to set the PokeDB: ", err)
            })
        }
    }

    async function filteringPokemon(results) {
        let finalResults = [];
            for (let i = 0; i < results.length; i++){
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
                <div className="results" >
                    <Pokemon pokemon={allPokemon[i]} pokeString={allPokemon[i].sprites.front_shiny}/>
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
                    <Pokemon pokemon={favorites[i]} removePokemon={removePokemon} id={favorites[i].forms[0].name} favorites={favorites} setFavorites={setFavorites} pokeString={favorites[i].sprites.front_shiny} />
                </div>
            )
        }
        return (views)
    }

    function alreadySaved(name, i) {
        if (favorites.some(fav => fav.forms[0].name === name)) {
            return (<h4>Saved!</h4>)
        } else {
            return (<button className="favoriteButton" id={i} onClick={savePokemon}>Favorite
            </button>)
        }
    }

    function handleChange(event) {
        setSearchText(event.target.value.toLowerCase());
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
            filteringPokemon(filteredResults)
        }
    }

    return (
        <div>
            <div className="header">
                <h1>Pokemon Project</h1>
                <Icon icon="mdi:pokeball" width="50" height="50"/>
                <div className="headerSearch">
                    <form className="searchForm" onSubmit={handleSubmit}>
                        <input className="headerSearchInput" type="text" value={searchText} onChange={handleChange} />
                        <input type="submit" value="Search"></input>
                    </form>
                </div>
                <h3 className="favoriteCount">Favorited Pokemon: {favorites.length}</h3>
            </div>
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


