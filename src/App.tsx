import { useGameStore } from './store/gameStore';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';
import { WaitingRoomPage } from './pages/WaitingRoomPage';
import { MultiGamePage } from './pages/MultiGamePage';

const PAGES = {
  home: HomePage,
  game: GamePage,
  lobby: LobbyPage,
  waiting: WaitingRoomPage,
  'multi-game': MultiGamePage,
} as const;

function App() {
  const page = useGameStore((s) => s.page);
  const Page = PAGES[page];
  return <Page />;
}

export default App;
