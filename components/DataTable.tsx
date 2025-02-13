"use client";
import { useEffect, useState } from "react";
type Trip = {
    vendor_id: string;
    pickup_datetime: string;
    dropoff_datetime: string;
    trip_distance: number;
    fare_amount: number;
    payment_type: string;
  };
  


export default function DataTable() {
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<string>("desc");
  const [sortBy, setSortBy] = useState<string>("fare_amount");
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const sortOptions = [
    "pickup_datetime",
    "fare_amount",
    "trip_distance",
    "payment_type",
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const response = await fetch(
          `https://yellow-taxi-delta.vercel.app/api/yellow-taxi/sorted?sortBy=${sortBy}&order=${order}&limit=${limit}&offset=${offset}`
        );
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setTotalRecords(result.totalRecords);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, sortBy, order]);

  const totalPages = Math.ceil(totalRecords / limit);

  // Format waktu agar lebih mudah dibaca
  const formatDate = (datetime: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(datetime));
  };

  // Ubah underscore menjadi spasi
  const formatSortByLabel = (text: string) => text.replace(/_/g, " ");

  return (
    <div className="min-h-screen p-8 sm:p-20">
      
      <h1 className="text-2xl font-bold mb-6 text-center">Yellow Taxi Trips</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {formatSortByLabel(option)}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {order === "asc" ? "Ascending ⬆️" : "Descending ⬇️"}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Vendor</th>
                  <th className="border p-2">Pickup Time</th>
                  <th className="border p-2">Dropoff Time</th>
                  <th className="border p-2">Distance (miles)</th>
                  <th className="border p-2">Fare ($)</th>
                  <th className="border p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {data.map((trip, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="border p-2 text-center">{trip.vendor_id}</td>
                    <td className="border p-2 text-center">
                      {formatDate(trip.pickup_datetime)}
                    </td>
                    <td className="border p-2 text-center">
                      {formatDate(trip.dropoff_datetime)}
                    </td>
                    <td className="border p-2 text-center">
                    {Number(trip.trip_distance).toFixed(2)}


                    </td>
                    <td className="border p-2 text-center">${trip.fare_amount}</td>
                    <td className="border p-2 text-center">{trip.payment_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
