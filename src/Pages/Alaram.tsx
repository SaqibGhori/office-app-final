// AlarmPage.tsx (Refactored to use DataContext)
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useData } from "../context/DataContext";

interface AlarmItem {
  _id?: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Medium" | "Low";
}

export default function AlarmPage() {
  const { gatewayId, alarmSettings, fetchAlarmSettings } = useData();
  const { search } = useLocation();
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const socket = useSocket(); // assuming it returns the socket object

  // 1) Load saved alarms from DB (paginated)
  useEffect(() => {
    if (!gatewayId) return;
    setLoading(true);

    fetch(`http://localhost:3000/api/alarm-records?gatewayId=${gatewayId}&page=${page}&limit=${perPage}`)
      .then(res => res.json())
      .then(data => {
        setAlarms(data.data);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gatewayId, page]);

  // 2) Load alarm settings
  useEffect(() => {
    if (gatewayId) fetchAlarmSettings();
  }, [gatewayId]);

  // ✅ 3) Listen for new alarms
  useEffect(() => {
    if (!gatewayId || !socket) return;

    const handler = (newAlarms: AlarmItem[]) => {
      setAlarms(prev => [...newAlarms, ...prev].slice(0, perPage));
    };

    socket.on("new-alarms", handler);
    return () => {
      socket.off("new-alarms", handler);
    };
  }, [gatewayId, socket]);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alarm Page for {gatewayId}</h1>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(perPage)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md" />
          ))}
        </div>
      ) : alarms.length === 0 ? (
        <p>No alarms detected.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="w-1/5 px-3 py-2 text-left">Time</th>
                  <th className="w-1/5 px-3 py-2 text-left">Category</th>
                  <th className="w-1/5 px-3 py-2 text-left">Subcategory</th>
                  <th className="w-1/5 px-3 py-2 text-left">Value</th>
                  <th className="w-1/5 px-3 py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alarms.map((a, i) => (
                  <tr key={a._id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="px-3 py-2">{a.category}</td>
                    <td className="px-3 py-2">{a.subcategory}</td>
                    <td className={`px-3 py-2 font-mono ${
                      a.priority === "High" ? "text-red-600" :
                      a.priority === "Medium" ? "text-orange-500" :
                      "text-green-600"
                    }`}>
                      {a.value}
                    </td>
                    <td className={`px-3 py-2 font-semibold ${
                      a.priority === "High" ? "text-red-600" :
                      a.priority === "Medium" ? "text-orange-500" :
                      "text-green-600"
                    }`}>
                      {a.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
