import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import PokemonPage from '../src/pages/PokemonPage';


const BASE_URL = process.env.REACT_APP_POKEMON_BASE_URL;

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PokemonPage />}/>

        </Routes>
      </Router>

    </div>
  );
}

export default App;
