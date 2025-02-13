import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TaxiTrip {
  payment_type: string;
  total_amount: string;
  pickup_datetime: string;
  vendor_id: string;
}

export default function TaxiChart() {
  const [revenueChartData, setRevenueChartData] = useState<any>(null);
  const [tripsByMonthChartData, setTripsByMonthChartData] = useState<any>(null);
  const [vendorChartData, setVendorChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://yellow-taxi-delta.vercel.app/api/yellow-taxi/"
        );
        const data = await response.json();

        if (data.success) {
          const trips: TaxiTrip[] = data.data;

          /** 🔥 1. Revenue by Payment Type */
          const totalsByPayment = trips.reduce((acc, trip) => {
            const paymentType = trip.payment_type;
            const total = parseFloat(trip.total_amount);

            acc[paymentType] = (acc[paymentType] || 0) + total;
            return acc;
          }, {} as Record<string, number>);

          setRevenueChartData({
            labels: Object.keys(totalsByPayment),
            datasets: [
              {
                label: "Total Revenue by Payment Type",
                data: Object.values(totalsByPayment),
                backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#F44336"],
                borderColor: "#333",
                borderWidth: 1,
              },
            ],
          });

          /** 🔥 2. Trips by Month */
          const tripsByMonth = trips.reduce((acc, trip) => {
            const month = new Date(trip.pickup_datetime).toLocaleString(
              "default",
              { month: "short" }
            );

            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          setTripsByMonthChartData({
            labels: Object.keys(tripsByMonth),
            datasets: [
              {
                label: "Number of Trips",
                data: Object.values(tripsByMonth),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4CAF50",
                  "#FF9800",
                  "#9C27B0",
                ],
                borderColor: "#333",
                borderWidth: 1,
              },
            ],
          });

          /** 🔥 3. Vendor Distribution */
          const vendorCount = trips.reduce((acc, trip) => {
            acc[trip.vendor_id] = (acc[trip.vendor_id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          setVendorChartData({
            labels: Object.keys(vendorCount),
            datasets: [
              {
                data: Object.values(vendorCount),
                backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
                borderColor: "#333",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching taxi data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Chart 1: Revenue by Payment Type */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-center mb-4">
            Taxi Revenue by Payment Type
          </h2>
          {revenueChartData ? (
            <Bar
              data={{
                ...revenueChartData,
                datasets: [
                  {
                    ...revenueChartData.datasets[0],
                    backgroundColor: ["#A8E6CF", "#FFD3B6", "#FFAAA5", "#D4A5A5"],
                    borderColor: "#ddd",
                  },
                ],
              }}
            />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
  
        {/* Chart 2: Trips by Month */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-center mb-4">
            Taxi Trips by Month in 2024
          </h2>
          {tripsByMonthChartData ? (
            <Bar
              data={{
                ...tripsByMonthChartData,
                datasets: [
                  {
                    ...tripsByMonthChartData.datasets[0],
                    backgroundColor: [
                      "#FFB6C1",
                      "#FFD700",
                      "#87CEFA",
                      "#90EE90",
                      "#FF69B4",
                      "#DDA0DD",
                    ],
                    borderColor: "#ddd",
                  },
                ],
              }}
            />
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
      </div>
  
      {/* Pie Chart: Vendor Distribution */}
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md">
        <h2 className="text-lg font-bold text-center mb-4">Vendor Distribution</h2>
        {vendorChartData ? (
          <Pie
            data={{
              ...vendorChartData,
              datasets: [
                {
                  ...vendorChartData.datasets[0],
                  backgroundColor: ["#FFDDC1", "#FFABAB", "#FFC3A0"],
                  borderColor: "#ddd",
                },
              ],
            }}
          />
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
  
  
}
