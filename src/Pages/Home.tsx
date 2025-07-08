import React from 'react'
import PieChartHome from '../Components/PieChartHome'
import MixChartHome from '../Components/MixChartHome'

const Home = () => {
  return (
    <>
    <div className='mx-auto w-[90%] flex gap-5'>
       <div className='w-96 bg-white shadow-2xl flex justify-center items-center '>
        <PieChartHome/>
       </div>
       <div className='w-[100%] bg-white shadow-2xl '>
        <MixChartHome/>
       </div>
    </div>
    
    </>
  )
}

export default Home