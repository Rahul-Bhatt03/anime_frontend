import React from 'react'
import ResponsiveAppBar from '../../components/Appbar'
import AnimeHeroCarousel from '../../components/HeroSection'
import AnimeHomePage from './AnimeHomePage'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
      <ResponsiveAppBar/>
    <AnimeHeroCarousel/>
    <AnimeHomePage/>
    <Footer/>
    </div>
  )
}

export default Home
