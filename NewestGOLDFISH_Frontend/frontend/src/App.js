import './App.css';
import {Route, Routes} from "react-router-dom"
import Game from './pages/Game/Game';
import Landing from './pages/Landing/Landing';
import End from './pages/End/End';
import About from './pages/About/About';
import Lobby from './pages/Lobby/Lobby';
function App() {
  console.log("This place happended")
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/game" element={<Game />} />
      <Route path="/end" element={<End />} />
      <Route path="/about" element={<About />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

export default App;
