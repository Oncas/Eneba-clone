import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Gallery } from './pages/Gallery';
import { CreateGame } from './pages/CreateGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/create" element={<CreateGame />} />
      </Routes>
    </Router>
  );
}

export default App;
