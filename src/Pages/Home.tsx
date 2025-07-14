import React from 'react'
import MixChartHome from '../Components/MixChartHome'

const Home = () => {
  return (
    <>
    <div className='mx-auto w-[90%] flex gap-5'>
       <div className='w-[80%] bg-white shadow-2xl '>
        <MixChartHome/>
       </div>
    </div>
    
    </>
  )
}

export default Home