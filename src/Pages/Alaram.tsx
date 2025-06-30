import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface ReadingData {
  [category: string]: {
    [subcategory: string]: number;
  };
}

interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

interface AlarmItem {
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
}

export default function Alaram() {
  const { gatewayId } = useParams();
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAndFilter = async () => {
    if (!gatewayId) return;

    setLoading(true);

    try {
      const res = await axios.get("http://localhost:3000/api/readingsdynamic", {
        params: { gatewayId }
      });

      // ✅ yahan safe check karo
      const readings: Reading[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const result: AlarmItem[] = [];

      readings.forEach((entry) => {
        Object.entries(entry.data || {}).forEach(([category, subObj]) => {
          Object.entries(subObj).forEach(([sub, value]) => {
            if (value > 500) {
              result.push({
                timestamp: entry.timestamp,
                category,
                subcategory: sub,
                value
              });
            }
          });
        });
      });

      setAlarms(result);
    } catch (error) {
      console.error("Failed to fetch alarms:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAndFilter();
}, [gatewayId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alarm Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : alarms.length === 0 ? (
        <p>No alarms detected.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-2 px-3">Timestamp</th>
              <th className="text-left py-2 px-3">Category</th>
              <th className="text-left py-2 px-3">Subcategory</th>
              <th className="text-left py-2 px-3">Value</th>
              <th className="text-left py-2 px-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-1 px-3">{new Date(item.timestamp).toLocaleString()}</td>
                <td className="py-1 px-3">{item.category}</td>
                <td className="py-1 px-3">{item.subcategory}</td>
                <td className="py-1 px-3">{item.value}</td>
                <td className="py-1 px-3 text-red-600 font-semibold">Threshold Exceeded</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
