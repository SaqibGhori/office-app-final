// AlarmDownloadPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";



interface AlarmItem {
  _id?: string;
  timestamp: string;
  category: string;
  subcategory: string;
  value: number;
  priority: "High" | "Normal" | "Low";
}

export default function AlarmDownloadPage() {
  const [data, setData] = useState<AlarmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [fileType, setFileType] = useState<"pdf" | "csv">("pdf");
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const gatewayId = params.get("gatewayId");
  const startDate = params.get("startDate") || "";
  const endDate = params.get("endDate") || "";
  const interval = params.get("interval") || "0";

  useEffect(() => {
    if (!gatewayId) return;

    axios
      .get("http://localhost:3000/api/alarm-records/export", {
        params: { gatewayId, startDate, endDate, interval },
      })
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gatewayId, startDate, endDate, interval]);

  const handleDownload = async () => {
    setDownloading(true);

    if (fileType === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["Time", "Category", "Subcategory", "Value", "Priority"]],
        body: data.map((rec) => [
          new Date(rec.timestamp).toLocaleString(),
          rec.category,
          rec.subcategory,
          rec.value,
          rec.priority,
        ]),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: [0, 0, 0],
        },
        didParseCell: function (data: any) {
          if (data.section === 'body') {
            const priority = data.row.raw[4]; // Priority is column index 4
            if (data.column.index === 3 || data.column.index === 4) {
              if (priority === 'High') {
                data.cell.styles.textColor = [255, 0, 0]; // Red
              } else if (priority === 'Normal') {
                data.cell.styles.textColor = [0, 128, 0]; // Green
              } else if (priority === 'Low') {
                data.cell.styles.textColor = [0, 0, 255]; // Blue
              }
            }
          }
        },
      });


      doc.save("alarm-data.pdf");
    } else {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "alarm-data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      alert("Download completed!");
      navigate(`/alaram?gateway=${gatewayId}`);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Download Filtered Alarms</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="mr-2 font-medium">File Type:</label>
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
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
          >
            {downloading ? "Downloading..." : "Download Now"}
          </button>

          <div className="overflow-x-auto border rounded">
            <table className="min-w-full table-fixed text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="w-1/5 px-3 py-2 text-left">Time</th>
                  <th className="w-1/5 px-3 py-2 text-left">Category</th>
                  <th className="w-1/5 px-3 py-2 text-left">Subcategory</th>
                  <th className="w-1/5 px-3 py-2 text-left">Value</th>
                  <th className="w-1/5 px-3 py-2 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((a, i) => (
                  <tr key={a._id || i}>
                    <td className="px-3 py-2">{new Date(a.timestamp).toLocaleString()}</td>
                    <td className="px-3 py-2">{a.category}</td>
                    <td className="px-3 py-2">{a.subcategory}</td>
                    <td className={`px-3 py-2 font-mono ${a.priority === "High" ? "text-red-600" :
                      a.priority === "Normal" ? "text-green-600" :
                        "text-blue-600"
                      }`}>
                      {a.value}
                    </td>
                    <td className={`px-3 py-2 font-semibold ${a.priority === "High" ? "text-red-600" :
                      a.priority === "Normal" ? "text-green-600" :
                        "text-blue-600"
                      }`}>
                      {a.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
