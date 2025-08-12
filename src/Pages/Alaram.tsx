import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useData } from "../context/DataContext";
import axios from "axios";

interface AlarmItem {
  _id?: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Normal" | "Low";
}

export default function AlarmPage() {
  const { gatewayId, alarmSettings, fetchAlarmSettings , gateways } = useData();
  const { search } = useLocation();
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const [isFilterActive, setIsFilterActive] = useState(false);

  const selectedGateway = gateways?.find((g) => g.gatewayId === gatewayId);
  const gatewayName = selectedGateway?.name || "Unknown";
  const gatewayLocation = selectedGateway?.location || "";

  // 🚀 Fetch Alarms Function
  const fetchAlarms = () => {
    if (!gatewayId) return;
    setLoading(true);

    const params: any = {
      gatewayId,
      page,
      limit: perPage,
    };

    if (startDate) params.startDate = new Date(startDate).toISOString();
    if (endDate) params.endDate = new Date(endDate).toISOString();

    axios
      .get("http://localhost:3000/api/alarm-records", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAlarms(res.data.data);
        setTotalPages(res.data.totalPages || 1); // fallback in case undefined
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }


  // 🔁 Load alarm settings once on gateway change
  useEffect(() => {
    if (gatewayId) fetchAlarmSettings();
  }, [gatewayId]);

  // 🔁 Listen to real-time socket alarms (only if no filters applied)
  const handler = useCallback((newAlarms: AlarmItem[]) => {
    if (!isFilterActive) {
      setAlarms((prev) => {
        const merged = [...newAlarms, ...prev];
        merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return merged.slice(0, perPage);
      });
    }
  }, [isFilterActive, perPage]);

  useEffect(() => {
    if (gatewayId && socket) {
      socket.on("new-alarms", handler);

      return () => {
        socket.off("new-alarms", handler);
      };
    }
  }, [gatewayId, socket, handler]);



  // 🔁 Refetch alarms when gatewayId or page changes
  useEffect(() => {
    if (gatewayId) fetchAlarms();
  }, [gatewayId, page]);

  // 🎯 Apply filter handler
  const handleApplyFilters = () => {
    setIsFilterActive(true); // 👈 disable socket push
    setPage(1);
    fetchAlarms();
  };

  // 🔁 Clear filter and return to default paginated+socket
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setIsFilterActive(false);
    setPage(1);
    fetchAlarms();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <div>
          <h1 className="text-2xl font-bold">
            {gatewayName}
            <span className="text-sm text-gray-500 ml-2">({gatewayId})</span>
          </h1>
          {gatewayLocation && (
            <p className="text-sm text-gray-600">{gatewayLocation}</p>
          )}
        </div>
      <Link to={`/settings${gatewayId ? `?gateway=${gatewayId}` : ""}`}  className="px-4 py-2  bg-gray-500 text-white rounded">
        Alarm Settings
      </Link>
      </div>
      {/* Filters Section */}
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-1 rounded"
          />
        </div>

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Apply
        </button>

        <button
          onClick={handleClearFilter}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Clear Filter
        </button>

        <button
          onClick={() => {
            const start = startDate ? new Date(startDate).toISOString() : "";
            const end = endDate ? new Date(endDate).toISOString() : "";
            navigate(
              `/alarm-download?gatewayId=${gatewayId}&startDate=${start}&endDate=${end}`
            );
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export Data
        </button>
      </div>

      {/* Loader */}
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
          {/* Table */}
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
                    <td
                      className={`px-3 py-2 font-mono ${a.priority === "High"
                          ? "text-red-600"
                          : a.priority === "Normal"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                    >
                      {a.value}
                    </td>
                    <td
                      className={`px-3 py-2 font-semibold ${a.priority === "High"
                          ? "text-red-600"
                          : a.priority === "Normal"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                    >
                      {a.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
