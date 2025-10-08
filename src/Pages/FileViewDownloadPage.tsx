import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "../api";

interface ReadingData {
  [category: string]: { [subcategory: string]: number };
}

interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

interface Pair {
  cat: string;
  sub: string;
}

export default function FileExportPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileType, setFileType] = useState<"pdf" | "csv">("pdf");

  const navigate = useNavigate();

  const gatewayId = searchParams.get("gateway");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const interval = searchParams.get("secInterval");

  // ✅ parse pairs from URL
  const pairsParam = searchParams.get("pairs") || "";
  const pairs: Pair[] = pairsParam
    .split(",")
    .map((s) => {
      const [cat, sub] = s.split("|");
      return { cat, sub };
    })
    .filter((p) => p.cat && p.sub);

  useEffect(() => {
    const fetchAll = async () => {
      if (!gatewayId) return;

      setLoading(true);
      try {
        const params: any = { gatewayId, page: 1, limit: 100000 };
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();
        if (interval) params.interval = interval;

        const res = await api.get("/api/readingsdynamic", {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const downloadFile = async () => {
    setDownloading(true);

    try {
      if (fileType === "csv") {
        let headers =
          "Date,Time," + pairs.map((p) => `${p.sub} (${p.cat})`).join(",") + "\n";
        let csv = headers;

        data.forEach((entry) => {
          const d = new Date(entry.timestamp);
          const row = [
            d.toLocaleDateString(),
            d.toLocaleTimeString(),
            ...pairs.map((p) => entry.data[p.cat]?.[p.sub] ?? "-"),
          ];
          csv += row.join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "readings.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const doc = new jsPDF();
        const rows = data.map((entry) => {
          const d = new Date(entry.timestamp);
          return [
            d.toLocaleDateString(),
            d.toLocaleTimeString(),
            ...pairs.map((p) => entry.data[p.cat]?.[p.sub] ?? "-"),
          ];
        });

        autoTable(doc, {
          head: [["Date", "Time", ...pairs.map((p) => `${p.sub} (${p.cat})`)]],
          body: rows,
          styles: { fontSize: 8 },
        });

        doc.save("readings.pdf");
      }

      setTimeout(() => {
        navigate(`/fileview?gateway=${gatewayId}`);
      }, 1000);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Export Full Table</h1>

      {loading ? (
        <p className="text-gray-500">Loading full data...</p>
      ) : (
        <>
          {/* Dropdown & Download Button */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Select File Format:</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as any)}
              className="border px-2 py-1 rounded"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <button
            onClick={downloadFile}
            disabled={downloading}
            className={`px-4 py-2 rounded text-white ${
              downloading ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {downloading ? "Downloading..." : "Download"}
          </button>

          {/* Data Table */}
          <table className="w-full border mt-6 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Time</th>
                {pairs.map((p) => (
                  <th key={`${p.cat}|${p.sub}`} className="border px-2 py-1">
                    {p.sub} <span className="text-gray-500 text-xs">({p.cat})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => {
                const d = new Date(entry.timestamp);
                return (
                  <tr key={i}>
                    <td className="border px-2 py-1">{d.toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                              {d.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                            </td>
                    {pairs.map((p) => (
                      <td key={`${p.cat}|${p.sub}`} className="border px-2 py-1">
                        {entry.data[p.cat]?.[p.sub] ?? "-"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
