import { useState } from 'react';
// import './App.css'; // Import your custom CSS file if needed
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
// import Hariom from './components/Hariom/Hariom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="bg-green-600 p-4">Hariom</h1>
      <Header />
      <Navbar/>
      {/* <Hariom/> */}
    </>
  );
}

export default App;
