import { useEffect, useMemo, useState } from "react";
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

// ---- Helpers for encoding/decoding selected pairs in URL ----
const makeKey = (cat: string, sub: string) => `${cat}|${sub}`;
const splitKey = (key: string): { cat: string; sub: string } | null => {
  if (!key) return null;
  const idx = key.indexOf("|");
  if (idx === -1) return null;
  const cat = key.slice(0, idx);
  const sub = key.slice(idx + 1);
  return { cat, sub };
};

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
  // NEW: multi-category subcategory selection via "pairs"
  const selectedPairsKeys = (searchParams.get("pairs") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Derived parsed pairs (stable memo)
  const selectedPairs = useMemo(
    () => selectedPairsKeys.map(splitKey).filter(Boolean) as { cat: string; sub: string }[],
    [selectedPairsKeys]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayId, selectedGateway]);

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

        // Default selection: first category -> all subs (keeps previous UX)
        if (selectedPairsKeys.length === 0 && data.length) {
          const firstCat = Object.keys(data[0].data || {})[0];
          if (firstCat) {
            const uniqueSubs = new Set<string>();
            data.forEach((item: Reading) => {
              const subs = item.data?.[firstCat];
              if (subs) Object.keys(subs).forEach((s) => uniqueSubs.add(s));
            });
            const defaults = Array.from(uniqueSubs).map((s) => makeKey(firstCat, s));
            if (defaults.length) {
              updateParams({ pairs: defaults.join(",") });
            }
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGateway, startDate, endDate, secInterval, page]);

  useEffect(() => {
    if (selectedGateway && !startDate && !endDate && secInterval === 0) {
      fetchData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // clear pairs on gateway change
    updateParams({ gateway: val, page: "1", pairs: "" });
    navigate(`/fileview${val ? `?gateway=${val}` : ""}`);
  };

  // ---- Category/Subcategory utilities ----
  const getCategories = (): string[] => {
    const categories = new Set<string>();
    const base = filteredData.length ? filteredData : allData;
    base.forEach((entry) => {
      Object.keys(entry.data || {}).forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  };

  const getSubcategoriesByCategory = (cat: string): string[] => {
    const subSet = new Set<string>();
    const base = filteredData.length ? filteredData : allData;
    base.forEach((entry) => {
      const subData = entry.data?.[cat];
      if (subData) Object.keys(subData).forEach((s) => subSet.add(s));
    });
    return Array.from(subSet).sort();
  };

  const isPairSelected = (cat: string, sub: string) =>
    selectedPairsKeys.includes(makeKey(cat, sub));

  const togglePair = (cat: string, sub: string) => {
    const key = makeKey(cat, sub);
    const next = isPairSelected(cat, sub)
      ? selectedPairsKeys.filter((k) => k !== key)
      : [...selectedPairsKeys, key];
    updateParams({ pairs: next.join(",") || null });
  };

  const selectAllSubsInCategory = (cat: string) => {
    const subs = getSubcategoriesByCategory(cat);
    const set = new Set(selectedPairsKeys);
    subs.forEach((s) => set.add(makeKey(cat, s)));
    updateParams({ pairs: Array.from(set).join(",") });
  };

  const clearAllSubsInCategory = (cat: string) => {
    const next = selectedPairsKeys.filter((k) => !k.startsWith(`${cat}|`));
    updateParams({ pairs: next.join(",") || null });
  };

  // ---- Chart support (only when all pairs belong to one category) ----
  const singleCategoryForChart = useMemo(() => {
    if (selectedPairs.length === 0) return null;
    const cats = new Set(selectedPairs.map((p) => p.cat));
    return cats.size === 1 ? selectedPairs[0].cat : null;
  }, [selectedPairs]);

  const subcategoriesForChart = useMemo(() => {
    if (!singleCategoryForChart) return [];
    return selectedPairs.filter((p) => p.cat === singleCategoryForChart).map((p) => p.sub);
  }, [selectedPairs, singleCategoryForChart]);

  return (
    <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
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
              className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
                isFilterValid ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleFilter}
              disabled={!isFilterValid}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Content (Equal-height layout on desktop) */}
      <div
        className="
          mt-6 md:mt-8
          grid grid-cols-1 md:grid-cols-[minmax(16rem,20rem)_1fr]
          gap-4 md:gap-6 items-stretch
        "
      >
        {/* Sidebar */}
        <aside
          className="
            bg-gray-800 text-white rounded-xl md:rounded-xl
            p-4 h-full
            flex flex-col
          "
        >
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

          <h2 className="text-lg sm:text-xl font-bold mb-3">Categories &amp; Subcategories</h2>

          {getCategories().length === 0 ? (
            <p className="text-gray-300 text-sm">No categories found.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {getCategories().map((cat) => {
                const subs = getSubcategoriesByCategory(cat);
                const anySelected = subs.some((s) => isPairSelected(cat, s));
                return (
                  <div key={cat} className="bg-gray-700/40 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold break-words">{cat}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                          onClick={() => selectAllSubsInCategory(cat)}
                        >
                          Select all
                        </button>
                        <button
                          className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded disabled:opacity-50"
                          onClick={() => clearAllSubsInCategory(cat)}
                          disabled={!anySelected}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto pr-1 mt-2 space-y-1">
                      {subs.length ? (
                        subs.map((sub) => (
                          <label key={sub} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isPairSelected(cat, sub)}
                              onChange={() => togglePair(cat, sub)}
                            />
                            <span className="text-sm break-words">{sub}</span>
                          </label>
                        ))
                      ) : (
                        <div className="text-xs text-gray-300">No subcategories.</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="h-full">
          {isLoading ? (
            <div className="text-center text-gray-500 text-lg py-10">Loading data...</div>
          ) : selectedGateway ? (
            switchToChart === "table" ? (
              <div className="bg-white rounded-xl shadow p-3 sm:p-4 h-full flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold">Data Table</h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                    <button
                      className="text-primary disabled:text-gray-400 disabled:cursor-not-allowed"
                      onClick={() => updateParams({ view: "chart" })}
                      disabled={selectedPairs.length === 0}
                      title={
                        selectedPairs.length === 0
                          ? "Select at least one subcategory to view chart"
                          : "Switch to Chart"
                      }
                    >
                      Switch To Chart
                    </button>
                    {/* <button
                      onClick={() => navigate(`/fileview/export?${searchParams.toString()}`)}
                      className="bg-green-600 text-white px-3 py-2 rounded"
                    >
                      Export File
                    </button> */}
                  </div>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full bg-white rounded">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
                        <th className="px-4 py-2 text-left whitespace-nowrap">Time</th>
                        {selectedPairs.map(({ cat, sub }) => (
                          <th
                            key={makeKey(cat, sub)}
                            className="px-4 py-2 text-left whitespace-nowrap"
                            title={`${sub} (${cat})`}
                          >
                            {sub} <span className="text-gray-600 text-xs">({cat})</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((entry, i) => {
                        const d = new Date(entry.timestamp);
                        return (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2 whitespace-nowrap">
                              {d.toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {d.toLocaleTimeString()}
                            </td>
                            {selectedPairs.map(({ cat, sub }) => (
                              <td key={makeKey(cat, sub)} className="px-4 py-2">
                                {entry.data?.[cat]?.[sub] ?? "-"}
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
                    Page {page} of {Math.ceil((totalCount || 0) / limit) || 1}
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
              <div className="bg-white rounded-xl shadow p-3 sm:p-4 h-full flex flex-col">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold">Data Chart</h2>
                  <button className="text-primary" onClick={() => updateParams({ view: "table" })}>
                    Switch To Table
                  </button>
                </div>

                <div className="mt-3">
                  {selectedPairs.length === 0 ? (
                    <p className="text-gray-600">Select subcategories to view a chart.</p>
                  ) : singleCategoryForChart ? (
                    <FileViewChart
                      data={filteredData}
                      category={singleCategoryForChart}
                      subcategories={subcategoriesForChart}
                    />
                  ) : (
                    <p className="text-gray-600">
                      Chart supports one category at a time. Please select subcategories from the
                      same category (or switch back to the table).
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
