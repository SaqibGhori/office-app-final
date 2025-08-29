import { useEffect, useState } from "react";
// import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FileViewChart from "../Components/FileViewChart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useData } from "../context/DataContext";
import { api } from "../api";

interface ReadingData {
  [category: string]: { [subcategory: string]: number };
}
interface Reading {
  gatewayId: string;
  timestamp: string;
  data: ReadingData;
}

export default function FileView() {
  const [allData, setAllData] = useState<Reading[]>([]);
  const [filteredData, setFilteredData] = useState<Reading[]>([]);
  const { gateways } = useData();
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { gatewayId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedGateway = searchParams.get("gateway") || "";
  const selectedCategory = searchParams.get("category");
  const selectedSubcategories = searchParams.get("subs")?.split(",") || [];
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const secInterval = parseInt(searchParams.get("secInterval") || "0", 10);
  const switchToChart = searchParams.get("view") || "table";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 50;

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localInterval, setLocalInterval] = useState(secInterval);

  const isFilterValid = (localStartDate && localEndDate) || localInterval > 0;

  const updateParams = (changes: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([k, v]) => {
      if (!v) updated.delete(k);
      else updated.set(k, v);
    });
    setSearchParams(updated);
  };

  useEffect(() => {
    if (gatewayId && !selectedGateway) {
      updateParams({ gateway: gatewayId });
    }
  }, [gatewayId, selectedGateway]);

  console.log(allData);

  const fetchData = (showLoader: boolean) => {
    if (!selectedGateway) return;

    const params: any = { gatewayId: selectedGateway, page, limit };
    if (startDate) params.startDate = new Date(startDate).toISOString();
    if (endDate) params.endDate = new Date(endDate).toISOString();
    if (secInterval > 0) params.interval = secInterval;

    if (showLoader) setIsLoading(true);

    api
      .get("/api/readingsdynamic", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
      .then((res) => {
        const data = res.data?.data || [];
        const total = res.data?.total || 0;

        setAllData(data);
        setTotalCount(total);
        setFilteredData(data);

        if (!selectedCategory && data.length) {
          const firstCat = Object.keys(data[0].data || {})[0];
          if (!firstCat) return;

          const uniqueSubs = new Set<string>();
          data.forEach((item: Reading) => {
            const subs = item.data?.[firstCat];
            if (subs) {
              Object.keys(subs).forEach((key) => uniqueSubs.add(key));
            }
          });

          updateParams({
            category: firstCat,
            subs: Array.from(uniqueSubs).join(","),
          });
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching readings:", err);
        toast.error("Failed to load data. Please check your token or server.");
      })
      .finally(() => {
        if (showLoader) {
          setTimeout(() => setIsLoading(false), 300);
        }
      });
  };

  useEffect(() => {
    if (selectedGateway && (startDate || endDate || secInterval > 0)) {
      fetchData(false);
    }
  }, [selectedGateway, startDate, endDate, secInterval, page]);

  useEffect(() => {
    if (selectedGateway && !startDate && !endDate && secInterval === 0) {
      fetchData(false);
    }
  }, [selectedGateway, page]);

  const handleFilter = () => {
    if (localStartDate && !localEndDate) {
      toast.error("Please select an End Date.");
      return;
    }
    if (localEndDate && !localStartDate) {
      toast.error("Please select a Start Date.");
      return;
    }
    if (!localStartDate && !localEndDate && localInterval <= 0) {
      toast.error("Please provide a date range or an interval.");
      return;
    }

    updateParams({
      startDate: localStartDate || null,
      endDate: localEndDate || null,
      secInterval: localInterval > 0 ? String(localInterval) : null,
      page: "1",
    });
    fetchData(true);
  };

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    setLocalInterval(secInterval || 0);
  }, [startDate, endDate, secInterval]);

  const handleGatewayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updateParams({ gateway: val, page: "1", category: "", subs: "" });
    navigate(`/fileview${val ? `?gateway=${val}` : ""}`);
  };

  const toggleSub = (sub: string) => {
    const upd = selectedSubcategories.includes(sub)
      ? selectedSubcategories.filter((s) => s !== sub)
      : [...selectedSubcategories, sub];
    updateParams({ subs: upd.join(",") });
  };

  const getSubs = (): string[] => {
    const s = new Set<string>();
    filteredData.forEach((e) => {
      const cat = e.data[selectedCategory!];
      if (cat) Object.keys(cat).forEach((sub) => s.add(sub));
    });
    return Array.from(s);
  };

  const getCategories = (): string[] => {
    const categories = new Set<string>();
    filteredData.forEach((entry) => {
      Object.keys(entry.data).forEach((cat) => categories.add(cat));
    });
    return Array.from(categories);
  };

  const getSubcategoriesByCategory = (cat: string): string[] => {
    const subSet = new Set<string>();
    filteredData.forEach((entry) => {
      const subData = entry.data[cat];
      if (subData) {
        Object.keys(subData).forEach((sub) => subSet.add(sub));
      }
    });
    return Array.from(subSet);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4">
      <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-bold">File View</h1>

      {/* Filters */}
      <div className="mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-white rounded-xl shadow p-3 sm:p-4">
          <div className="font-semibold text-gray-700">Select Range</div>

          <label className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
            <span className="sm:w-14">From</span>
            <input
              type="datetime-local"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </label>

          <label className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
            <span className="sm:w-14">To</span>
            <input
              type="datetime-local"
              value={localEndDate}
              min={localStartDate || undefined}
              onChange={(e) => setLocalEndDate(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </label>

          <label className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
            <span className="sm:whitespace-nowrap">Seconds interval</span>
            <input
              type="number"
              min="1"
              max="59"
              value={localInterval || ""}
              onChange={(e) => setLocalInterval(parseInt(e.target.value) || 0)}
              className="w-full sm:w-24 p-2 border rounded"
            />
          </label>

          <div className="flex items-end sm:items-center sm:justify-end">
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded text-white ${isFilterValid ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleFilter}
              disabled={!isFilterValid}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-800 text-white p-4 rounded-xl md:rounded-none md:sticky md:top-0 md:h-screen md:self-start overflow-y-auto">
          <select
            className="w-full mb-4 p-2 text-black rounded"
            value={selectedGateway}
            onChange={handleGatewayChange}
          >
            <option value="" disabled>
              Select Gateway
            </option>
            {gateways.map((g) => (
              <option key={g.gatewayId} value={g.gatewayId}>
                {g.name} ({g.gatewayId})
              </option>
            ))}
          </select>

          <h2 className="text-lg sm:text-xl font-bold mb-3">Categories</h2>
          <div className="max-h-48 overflow-y-auto pr-1">
            {getCategories().map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const subs = getSubcategoriesByCategory(cat);
                  updateParams({ category: cat, subs: subs.join(",") });
                }}
                className={`block w-full text-left px-2 py-1 mb-1 rounded ${selectedCategory === cat ? "bg-gray-700" : "hover:bg-gray-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Subcategories</h3>
              <div className="max-h-40 overflow-y-auto pr-1">
                {getSubs().map((sub) => (
                  <label key={sub} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub)}
                      onChange={() => toggleSub(sub)}
                    />
                    {sub}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1">
          {isLoading ? (
            <div className="text-center text-gray-500 text-lg py-10">
              Loading data...
            </div>
          ) : selectedGateway ? (
            switchToChart === "table" ? (
              <div className="bg-white rounded-xl shadow p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold">Data Table</h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <button
                      className=" text-primary"
                      onClick={() => updateParams({ view: "chart" })}
                    >
                      Switch To Chart
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/fileview/export?${searchParams.toString()}`)
                      }
                      className="bg-green-600 text-white px-3 py-2 rounded"
                    >
                      Export File
                    </button>
                  </div>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full bg-white rounded">
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
                      {filteredData.map((entry, i) => {
                        const d = new Date(entry.timestamp);
                        return (
                          <tr key={i} className="border-t">
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
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mt-4 text-sm">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {Math.ceil(totalCount / limit)}
                  </span>
                  <button
                    className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                    disabled={page * limit >= totalCount}
                    onClick={() => updateParams({ page: String(page + 1) })}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-3 sm:p-4">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold">Data Chart</h2>
                  <button
                    className=" text-primary"
                    onClick={() => updateParams({ view: "table" })}
                  >
                    Switch To Table
                  </button>
                </div>

                <div className="mt-3">
                  {selectedCategory && selectedSubcategories.length ? (
                    <FileViewChart
                      data={filteredData}
                      category={selectedCategory}
                      subcategories={selectedSubcategories}
                    />
                  ) : (
                    <p className="text-gray-600">
                      No data to display. Select a category/subcategories.
                    </p>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow p-4 text-gray-600">
              Please select a gateway to view data.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
