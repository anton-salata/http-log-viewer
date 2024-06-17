import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<HomePage />} />
        </Routes>
    );
}

export default App;
