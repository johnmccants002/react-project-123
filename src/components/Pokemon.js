import React, {useState, useEffect} from 'react';
import '../styling/Pokemon.css'

export default function Pokemon({pokemon, removePokemon, id, favorites, setFavorites, pokeString}) {

    const [imageString, setImageString] = useState(pokeString);
    const [fallback, setFallback] = useState(false);

    useEffect( () => {
        if(pokeString){
          setImageString(pokeString);
        }
      },[pokeString])

    function capitalizeFirstLetter(string) {
        
        return string.charAt(0).toUpperCase() + string.slice(1);
      }


    function nextImage() {
       
        const imageKeys = Object.keys(pokemon.sprites)
        const values = Object.values(pokemon.sprites)
        const index = values.indexOf(imageString)
        const sliceArray = imageKeys.slice(index + 1)
        const newArray = sliceArray.concat(imageKeys)
        
        let stop = false;
        for (let i =0; i < newArray.length; i++) {
            if (newArray[i] !== 'other' && newArray[i] !== 'versions' && stop == false) {
                let name = newArray[i];
                if (pokemon.sprites[`${name}`] == undefined) {
         
                } else {
                    setImageString(pokemon.sprites[`${name}`])
                    stop = true
                }        
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

    const reloadSrc = (e) => { 
        if(fallback){
          e.target.src = "";
        }else{
          e.target.src = imageString
          setFallback(true)
        }
      }

    return (
        <div className="pokemonContainer">
            <h3>{capitalizeFirstLetter(pokemon.forms[0].name)}</h3>
            <div className="nextbutton">
                <img key={id} src={imageString} alt={''} onError={reloadSrc} />
                <div>
                    <button onClick={nextImage}>Next Image</button>
                </div>
            </div>
            <div className="about">
                <p>Type: {pokemon.types[0].type['name']}</p>
                <p>Moves: {displayMoves()}</p>
                {favorites ? <button class="removePokemon" id={id} onClick={removePokemon}>Remove Pokemon</button> : <></>}
            </div>   
        </div>
    )

}