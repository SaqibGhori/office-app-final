import { useEffect, useState } from "react";
import MixChartHome from "../Components/MixChartHome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

interface GlobalAlarm {
  _id?: string;
  gatewayId: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Normal" | "Low";
}

interface Gateway {
  _id: string;
  gatewayId: string;
  name: string;
  location: string;
}

const Home = () => {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [alarms, setAlarms] = useState<GlobalAlarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

console.log(loading)

  // Socket Subscription with Token
  const socket = useSocket(undefined, undefined, token || undefined);

  // Listen to global-alarms
 useEffect(() => {
  if (!token || !socket) return;

  const handler = (newAlarms: GlobalAlarm[]) => {
    setAlarms((prev) => {
      const merged = [...newAlarms, ...prev];
      const unique = merged.filter(
        (alarm, index, self) =>
          index ===
          self.findIndex(
            (a) =>
              a.gatewayId === alarm.gatewayId &&
              a.timestamp === alarm.timestamp &&
              a.category === alarm.category &&
              a.subcategory === alarm.subcategory
          )
      );
      unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return unique.slice(0, 20);  // latest 20 alarms only
    });
  };

  socket.on("global-alarms", handler);

  return () => {
    socket.off("global-alarms", handler);
  };
}, [socket, token]);

  useEffect(() => {
  const fetchInitialAlarms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/alarm-records", {
        params: { page: 1, limit: 20 },  // ya jitni limit chahiye
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlarms(res.data.data);  // Initial DB alarms
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching alarms:", err);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchInitialAlarms();
  }
}, [token]);

  // Fetch Gateways
  useEffect(() => {
    axios
      .get<Gateway[]>("http://localhost:3000/api/gateway", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setGateways(res.data))
      .catch(console.error);
  }, [token]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [ gatewayIdInput, setGatewayIdInput] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (showModal) {
      setGatewayIdInput("gw-" + Math.floor(Math.random() * 100000));
    } 
  }, [showModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/gateway",
        { gatewayId: gatewayIdInput, name, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      fetchGateways();
      setTimeout(() => {
        setShowModal(false);
        setName("");
        setLocation("");
        setSuccess(false);
        console.log(gatewayIdInput , "moiz")
      }, 1500);
    } catch (err) {
      console.error("❌ Error creating gateway:", err);
    }
  };



  const fetchGateways = () => {
    axios
      .get<Gateway[]>("http://localhost:3000/api/gateway", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setGateways(res.data))
      .catch(console.error);
  };

  const handleSelectGateway = (gateway: string) => {
    const params = new URLSearchParams();
    params.set("gateway", gateway);
    navigate(`/maindashboard?${params.toString()}`);
  };

  if (!token) return <div className="p-6 text-lg">⏳ Loading user info...</div>;

  return (
    <div className="mx-auto flex bg-secondary">
      {/* RIGHT Sidebar */}
      <div className="w-[20%] pb-5  text-center">
        <h2 className="text-2xl font-bold mt-4">Gateways</h2>

        <button
          className="py-2 px-6 bg-primary text-white rounded hover:bg-blue-950 my-3"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Device
        </button>

        {gateways.map((gateway) => (
          <button
            key={gateway._id}
            onClick={() => handleSelectGateway(gateway.gatewayId)}
            className="py-3 px-6 mx-auto border w-40 rounded-lg bg-gray-800 text-white hover:bg-gray-600 my-2 block text-left"
          >
            <div className="font-bold">{gateway.name}</div>
            {/* <div className="text-sm">{gateway.location}</div>
            <div className="text-xs opacity-60">ID: {gateway.gatewayId}</div> */}
          </button>
        ))}
      </div>
      {/* LEFT Side */}
      <div className="w-[80%]">
        <div className="bg-white mb-4">
          <MixChartHome />
        </div>

        <div className="bg-white min-h-80">
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
                    key={`${alarm.timestamp}-${alarm.category}-${alarm.subcategory}-${i}`}
                    className={
                      alarm.priority === "High"
                        ? "bg-red-200"
                        : alarm.priority === "Normal"
                        ? "bg-green-200"
                        : "bg-blue-200"
                    }
                  >
                    <td className="px-3 py-2 font-semibold">{alarm.gatewayId}</td>
                    <td className="px-3 py-2">{new Date(alarm.timestamp).toLocaleTimeString()}</td>
                    <td className="px-3 py-2">{alarm.category}</td>
                    <td className="px-3 py-2">{alarm.subcategory}</td>
                    <td className="px-3 py-2">{alarm.value}</td>
                    <td
                      className={`px-3 py-2 font-semibold ${
                        alarm.priority === "High"
                          ? "text-red-600"
                          : alarm.priority === "Normal"
                          ? "text-green-700"
                          : "text-blue-600"
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

      

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Gateway</h3>

            {success ? (
              <div className="text-green-600 font-semibold">
                ✅ Gateway Added! ID: <strong>{gatewayIdInput}</strong>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Gateway ID</label>
                  <input
                    type="text"
                    value={gatewayIdInput}
                    readOnly
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
