import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import About from './About'
import Testimonial from './Testimonial'

const Home = () => {
  return (
    <div>
        <Hero/>
        <LatestCollection/>
        <BestSeller/>
        <Testimonial/>
        <OurPolicy/>
        <About/>
        
    </div>
  )
}

export default Home