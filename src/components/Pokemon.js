import React, {useState, useEffect} from 'react';
import '../styling/Pokemon.css'

export default function Pokemon({pokemon, removePokemon, id, favorites, setFavorites, pokeString}) {

    const [imageString, setImageString] = useState(pokeString);
    const [allImageStrings, setAllImageStrings] = useState([]);
    const [fallback, setFallback] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
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
                    console.log("in else, name =", name)
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
                <img className="pokemonImage" key={id} src={imageString} alt={''} onError={reloadSrc} />
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