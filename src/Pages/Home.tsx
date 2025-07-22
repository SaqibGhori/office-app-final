import { useEffect, useState } from 'react'
import MixChartHome from '../Components/MixChartHome'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GatewayLabel } from '../Components/GatewayLabel';

const Home = () => {
  const [gateways, setGateways] = useState<string[]>([]);
  const navigate = useNavigate();
  // Fetch gateways from API
  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const res = await axios.get<string[]>("http://localhost:3000/api/gateways");
        setGateways(res.data);
      } catch (error) {
        console.error("Failed to fetch gateways:", error);
      }
    };

    fetchGateways();
  }, []);
  const handleSelectGateway = (gateway: string) => {
    const params = new URLSearchParams();
    params.set('gateway', gateway);
    navigate(`/maindashboard?${params.toString()}`);
  };
  return (
    <>
      <div className='mx-auto w-[90%] flex gap-5'>
        <div className='w-[80%] bg-white shadow-2xl '>
          <MixChartHome />
        </div>
        <div className='w-[20%] h-96 pb-5  overflow-y-scroll bg-white shadow-2xl text-center '>
          <h2 className='text-2xl mb-5 font-bold ml-5'>Gateways</h2>
          {gateways.map((gateway) => {
            return (
              // <div className=''>
              // <li className=' ' key={gateway}>
                <button
                  onClick={() => handleSelectGateway(gateway)}
                  className="py-4 px-12 mx-auto   bg-slate-300 hover:bg-gray-300 my-2 block "
                >
                  {gateway}
                  <GatewayLabel id = {gateway} />
                </button>
              // </li>
              // </div>
            )
          })}
        </div>
      </div>

    </>
  )
}

export default Home