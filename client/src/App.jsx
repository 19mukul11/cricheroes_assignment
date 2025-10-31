import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Error from './pages/Error';

function App() {

  return (
    <div className='container-fluid' id='outermost_container'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App
