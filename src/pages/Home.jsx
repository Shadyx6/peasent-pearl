import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import About from './About'
import Testimonial from './Testimonial'
import ShopByCollection from '../components/ShopByCollection'

const Home = () => {
  return (
    <div>
        <Hero/>
        <ShopByCollection/>
        <LatestCollection/>
        <BestSeller/>
        <Testimonial/>
        <OurPolicy/>
        <About/> 
        
    </div>
  )
}

export default Home