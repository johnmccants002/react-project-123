import { click } from '@testing-library/user-event/dist/click';
import React, {useState, useEffect} from 'react';
import '../styling/Pokemon.css'
import { Icon } from '@iconify/react';


export default function Pokemon({pokemon, removePokemon, id, favorites, setFavorites, pokeString}) {

    const [imageString, setImageString] = useState(pokeString);
    const [allImageStrings, setAllImageStrings] = useState([]);
    const [fallback, setFallback] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    let imagePokes = [];
    const iterate = (obj) => {  
        Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
            var str = obj[key]
            if (str.indexOf("https://") == 0 && imagePokes.length <= 40) {
                imagePokes.push(str)     
            }
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
                iterate(obj[key])
            }
        })   
    }

    const reloadSrc = (e) => { 
        if(fallback){
          e.target.src = "";
        }else{
          e.target.src = imageString
          setFallback(true)
        }
      }

    useEffect( () => {
        fillAllImageStrings()
        if(pokeString){
          setImageString(pokeString);
        }
      },[pokeString])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    function fillAllImageStrings() {
        iterate(pokemon.sprites)
        setImageUrls(imagePokes)  
    }

    function nextImage() {
        const index = imageUrls.indexOf(imageString)
        const sliceArray = imageUrls.slice(index + 1)
        const newArray = sliceArray.concat(imageUrls)
        let stop = false;
        for (let i =0; i < newArray.length; i++) {
            if (stop == false) {
                let name = newArray[i];
                    setImageString(name)
                    stop = true        
            } 
        }       
    }

    function displayMoves() {
        let views = [];
        if (pokemon.moves.length > 4) {
            for(let i = 0; i < 5; i++) {
                views.push(
                    <p>- {pokemon.moves[i].move.name}</p>
                )
            }
       }
       return (views)
    }

    function displayBaseStats() {
        let views =[];
        for (let i = 0; i < pokemon.stats.length; i++) {
            views.push(
                <>
                    <p>{pokemon.stats[i].stat.name}: {pokemon.stats[i].base_stat}</p>
                </>
            )
        }
        return (views)
    }

    function clickDetails() {
        setShowDetails(!showDetails)
    }


    return (
        <div className="pokemonContainer">
            <h3>{capitalizeFirstLetter(pokemon.forms[0].name)}</h3>
            <div className="nextbutton">
                <img className="pokemonImage" key={id} src={imageString} alt={''} onError={reloadSrc} />
                <div>
                    <button onClick={nextImage}>Next Image</button>
                </div>
            </div>
            <div className="about">
                
                {showDetails == true ? 
                    <div>
                        <div>Type: {pokemon.types[0].type['name']}</div>
                        <div>Moves: {displayMoves()}</div>
                        <div>Stats: {displayBaseStats()}</div>
                        <button onClick={clickDetails}>Hide Details</button>
                    </div>
                    :
                    <div>
                        <button onClick={clickDetails}>Show Details</button>
                    </div>
                }

                {favorites ? <button class="removePokemon" id={id} onClick={removePokemon}>Unfavorite</button> : <></>}
            </div>   
        </div>
    )

}