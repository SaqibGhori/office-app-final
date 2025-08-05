import { useEffect, useState } from 'react';
import MixChartHome from '../Components/MixChartHome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

interface GlobalAlarm {
  _id?: string;
  gatewayId: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: 'High' | 'Normal' | 'Low';
}

const Home = () => {
  const [gateways, setGateways] = useState<string[]>([]);
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<GlobalAlarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  // ✅ Fetch alarms from DB (paginated)
  useEffect(() => {
    const fetchAlarms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/alarm-records?page=${page}&limit=${perPage}`);
        setAlarms(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('❌ Failed to fetch alarms:', err);
      } finally {
        setLoading(false);
      }
    };
    console.log(loading)

    fetchAlarms();
  }, [page]);

  useEffect(() => {
  if (!socket) return undefined; // 👈 Add explicit undefined to avoid type error

  const handler = (alarm: GlobalAlarm) => {
    setAlarms(prev => [alarm, ...prev.slice(0, perPage - 1)]);
  };

  socket.on('global-alarms', handler);

  // Cleanup function
  return () => {
    socket.off('global-alarms', handler);
  };
}, [socket]);
  

  // ✅ Fetch gateways
  useEffect(() => {
    axios
      .get<string[]>('http://localhost:3000/api/gateways')
      .then((res) => setGateways(res.data))
      .catch(console.error);
  }, []);

  const handleSelectGateway = (gateway: string) => {
    const params = new URLSearchParams();
    params.set('gateway', gateway);
    navigate(`/maindashboard?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-[95%] flex gap-5">
      {/* LEFT Side */}
      <div className="w-[80%]">
        <div className="bg-white  mb-4">
          <MixChartHome />
        </div>

        <div className="bg-white">
          <h2 className="text-xl font-bold p-3">Live + Saved Alarms</h2>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto p-4">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Gateway</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Subcategory</th>
                  <th className="px-3 py-2 text-left">Value</th>
                  <th className="px-3 py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alarms.map((alarm, i) => (
                  <tr
                    key={alarm._id || i}
                    className={
                      alarm.priority === 'High'
                        ? 'bg-red-200'
                        : alarm.priority === 'Normal'
                        ? 'bg-green-200'
                        : 'bg-blue-200'
                    }
                  >
                    <td className="px-3 py-2 font-semibold">{alarm.gatewayId}</td>
                    <td className="px-3 py-2">
                      {new Date(alarm.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-2">{alarm.category}</td>
                    <td className="px-3 py-2">{alarm.subcategory}</td>
                    <td className="px-3 py-2">{alarm.value}</td>
                    <td
                      className={`px-3 py-2 font-semibold ${
                        alarm.priority === 'High'
                          ? 'text-red-600'
                          : alarm.priority === 'Normal'
                          ? 'text-green-700'
                          : 'text-blue-600'
                      }`}
                    >
                      {alarm.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT Sidebar */}
      <div className="w-[20%] pb-5 overflow-y-scroll bg-white  text-center">
        <h2 className="text-2xl mb-5 font-bold ml-5">Gateways</h2>
        {gateways.map((gateway) => (
          <button
            key={gateway}
            onClick={() => handleSelectGateway(gateway)}
            className="py-4 px-12 mx-auto border rounded-lg bg-gray-800 text-white hover:bg-gray-600 my-2 block"
          >
            {gateway}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;