import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:container 2xl:mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </main>
      
      {/* If you have a footer, add it here */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;