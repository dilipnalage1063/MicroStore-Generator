import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StoreView from './components/StoreView';
import './index.css';

/**
 * Main Application Component
 * Sets up routing for the MicroStore Generator.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for creating a store */}
        <Route path="/" element={<Home />} />

        {/* Route for viewing a public store page */}
        <Route path="/store/:id" element={<StoreView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
