import './App.css';
import {Route, Routes} from "react-router-dom"
import Game from './pages/Game/Game';
import Landing from './pages/Landing/Landing';
import End from './pages/End/End';
import About from './pages/About/About';
import Multiplayer from './pages/Multiplayer/Multiplayer';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/game" element={<Game />} />
      <Route path="/end" element={<End />} />
      <Route path="/about" element={<About />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
      <Route path="/leaderBoard" element={<LeaderBoard />} />
    </Routes>
  );
}

export default App;
