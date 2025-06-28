// LatestCollection.js
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'

const LatestCollection = () => {
  const { products } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 5))
  }, [products])

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className='text-center mb-10'>
        <h2 className='text-2xl md:text-3xl font-serif font-light text-amber-800 mb-2'>
          Just Dropped
        </h2>
        <p className='text-sm md:text-base text-amber-600 max-w-2xl mx-auto'>
          Discover our newest handcrafted designs that blend tradition with contemporary elegance
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {latestProducts.map((item) => (
          <ProductItem 
            key={item._id}
            id={item._id} 
            image={item.image} 
            name={item.name} 
            price={item.price}
          />
        ))}
      </div>

      {latestProducts.length > 0 && (
        <div className="text-center mt-12">
          <Link to={'/collection'}>
          <button className="px-8 py-3 border border-amber-700 text-amber-700 rounded-full hover:bg-amber-50 transition-all duration-300">
            View All Collections
          </button>
          </Link>
          
        </div>
      )}
    </section>
  )
}

export default LatestCollection