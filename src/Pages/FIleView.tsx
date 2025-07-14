import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FileViewChart from "../Components/FileViewChart";

interface ReadingData {
  [category: string]: { [subcategory: string]: number };
}

interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

export default function App() {
  const [allData, setAllData] = useState<Reading[]>([]);
  const [gatewayIds, setGatewayIds] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Reading[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { gatewayId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedGateway = searchParams.get("gateway") || "";
  const selectedCategory = searchParams.get("category");
  const selectedSubcategories = searchParams.get("subs")?.split(",") || [];
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const switchToChart = searchParams.get("view") || "table";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 50;

  // Update URL params
  const updateParams = (changes: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (!value) updated.delete(key);
      else updated.set(key, value);
    });
    setSearchParams(updated);
  };

  // Initialize gateway from route param
  useEffect(() => {
    if (gatewayId && !selectedGateway) {
      updateParams({ gateway: gatewayId });
    }
  }, [gatewayId, selectedGateway]);

  // Load gateways list
  useEffect(() => {
    axios
      .get<string[]>("http://localhost:3000/api/gateways")
      .then((res) => setGatewayIds(res.data))
      .catch(console.error);
  }, []);

  // Fetch readings whenever gateway, date/time, or page changes
  useEffect(() => {
    if (!selectedGateway) return;

    const params: any = {
      gatewayId: selectedGateway,
      page,
      limit,
    };
    if (startDate) params.startDate = new Date(startDate).toISOString();
    if (endDate)   params.endDate   = new Date(endDate).toISOString();

    axios
      .get("http://localhost:3000/api/readingsdynamic", { params })
      .then((res) => {
        const data = res.data.data as Reading[];
        setAllData(data);
        setFilteredData(data);
        setTotalCount(res.data.total as number);

        if (!selectedCategory && data.length > 0) {
          const firstCat = Object.keys(data[0].data)[0];
          updateParams({
            category: firstCat,
            subs: Object.keys(data[0].data[firstCat]).join(","),
          });
        }
      })
      .catch((err) => console.error("Error fetching readings:", err));
  }, [selectedGateway, startDate, endDate, page]);

  const handleDateFilter = () => {
    updateParams({ startDate, endDate, page: "1" });
  };

  const handleGatewayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateParams({ gateway: value, page: "1", category: "", subs: "" });
    navigate(`/fileview${value ? `?gateway=${value}` : ""}`);
  };

  const toggleSubcategory = (sub: string) => {
    const updated = selectedSubcategories.includes(sub)
      ? selectedSubcategories.filter((s) => s !== sub)
      : [...selectedSubcategories, sub];
    updateParams({ subs: updated.join(",") });
  };

  const getAllSubcategories = (): string[] => {
    const subs = new Set<string>();
    filteredData.forEach((entry) => {
      const catData = entry.data[selectedCategory!];
      if (catData) Object.keys(catData).forEach((s) => subs.add(s));
    });
    return Array.from(subs);
  };

  return (
    <div className="mx-3">
      <h1 className="text-2xl font-bold ml-5">File View</h1>

      {/* Date-Time Range Picker */}
      <div className="flex items-center mx-10 justify-between my-4 mt-10">
        <span className="font-semibold">Select Range</span>
        <label className="flex items-center gap-2">
          From
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => updateParams({ startDate: e.target.value })}
            className="p-1 border rounded"
          />
        </label>
        <label className="flex items-center gap-2">
          To
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => updateParams({ endDate: e.target.value })}
            className="p-1 border rounded"
          />
        </label>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleDateFilter}
        >
          Apply
        </button>
      </div>

      <div className="flex mt-10">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4">
          <select
            className="w-full mb-4 p-2 text-black rounded"
            value={selectedGateway}
            onChange={handleGatewayChange}
          >
            <option value="" disabled>
              Select Gateway
            </option>
            {gatewayIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <h2 className="text-xl font-bold mb-4">Categories</h2>
          {filteredData[0]?.data &&
            Object.keys(filteredData[0].data).map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: cat, subs: "" })}
                className={`block w-full text-left px-2 py-1 mb-1 rounded ${
                  selectedCategory === cat ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}

          {selectedCategory && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Subcategories</h3>
              {getAllSubcategories().map((sub) => (
                <label key={sub} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedSubcategories.includes(sub)}
                    onChange={() => toggleSubcategory(sub)}
                  />
                  {sub}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        {selectedGateway ? (
          switchToChart === "table" ? (
            <div className="w-full mx-3">
              <div className="flex items-center justify-between mx-2">
                <h2 className="text-2xl font-bold mb-4">Data Table</h2>
                <button onClick={() => updateParams({ view: "chart" })}>
                  Switch To Chart
                </button>
              </div>
              <table className="w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    {selectedSubcategories.map((sub) => (
                      <th key={sub} className="px-4 py-2 text-left">
                        {sub}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, idx) => {
                    const d = new Date(entry.timestamp);
                    return (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{d.toLocaleDateString()}</td>
                        <td className="px-4 py-2">{d.toLocaleTimeString()}</td>
                        {selectedSubcategories.map((sub) => (
                          <td key={sub} className="px-4 py-2">
                            {entry.data[selectedCategory!]?.[sub] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-end items-center gap-2 mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => updateParams({ page: String(page - 1) })}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {Math.ceil(totalCount / limit)}
                </span>
                <button
                  disabled={page * limit >= totalCount}
                  onClick={() => updateParams({ page: String(page + 1) })}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[90%] mx-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Data Chart</h2>
                <button onClick={() => updateParams({ view: "table" })}>
                  Switch To Table
                </button>
              </div>
              {selectedCategory && selectedSubcategories.length > 0 ? (
                <FileViewChart
                  data={filteredData}
                  category={selectedCategory}
                  subcategories={selectedSubcategories}
                />
              ) : (
                <p className="text-gray-600">
                  No data to display. Select a category and subcategories.
                </p>
              )}
            </div>
          )
        ) : (
          <div className="text-gray-500">Please select a gateway to view data.</div>
        )}
      </div>
    </div>
  );
}
