import { useGameStore } from './store/gameStore';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';

function App() {
  const page = useGameStore((s) => s.page);
  return page === 'home' ? <HomePage /> : <GamePage />;
}

export default App;
