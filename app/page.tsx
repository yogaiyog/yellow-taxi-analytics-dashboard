"use client";
import TaxiChart from "@/components/Chart";
import DataTable from "@/components/DataTable";
import { Trip } from "@/types/type";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div>
      <div className="min-h-[90vh] p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Yellow Taxi Trips
        </h1>
        <div className="flex gap-4 justify-center">
          {/* Kirim selectedTrip ke DynamicMap */}
          <DynamicMap selectedTrip={selectedTrip} />
          <DataTable
            onTripSelect={(trip) =>
              setSelectedTrip({
                ...trip,
                trip_distance: Number(trip.trip_distance),
                fare_amount: Number(trip.fare_amount),
                tip_amount: Number(trip.tip_amount),
                total_amount: Number(trip.total_amount),
                pickup_latitude: Number(trip.pickup_latitude),
                pickup_longitude: Number(trip.pickup_longitude),
                dropoff_latitude: Number(trip.dropoff_latitude),
                dropoff_longitude: Number(trip.dropoff_longitude),
              })
            }
          />
        </div>
        <div className="mt-4 p-4 border rounded shadow m-auto w-1/2">
          <h2 className="text-lg font-semibold">Selected Trip Details</h2>
          <div className="flex gap-4">
            <div>
              <p>Vendor: {selectedTrip?.vendor_id ?? "-"}</p>
              <p>
                Pickup:{" "}
                {selectedTrip?.pickup_datetime
                  ? new Date(selectedTrip.pickup_datetime).toLocaleString()
                  : "-"}
              </p>
              <p>
                Dropoff:{" "}
                {selectedTrip?.dropoff_datetime
                  ? new Date(selectedTrip.dropoff_datetime).toLocaleString()
                  : "-"}
              </p>
              <p>Passenger Count: {selectedTrip?.passenger_count ?? "-"}</p>
              <p>
                Distance:{" "}
                {selectedTrip?.trip_distance != null
                  ? `${selectedTrip.trip_distance.toFixed(2)} miles`
                  : "-"}
              </p>
              <p>
                Fare:{" "}
                {selectedTrip?.fare_amount != null
                  ? `$${selectedTrip.fare_amount.toFixed(2)}`
                  : "-"}
              </p>
            </div>
            <div>
              <p>Payment Type: {selectedTrip?.payment_type ?? "-"}</p>
              <p>
                Tip Amount:{" "}
                {selectedTrip?.tip_amount != null
                  ? `$${selectedTrip.tip_amount.toFixed(2)}`
                  : "-"}
              </p>
              <p>
                Total Amount:{" "}
                {selectedTrip?.total_amount != null
                  ? `$${selectedTrip.total_amount.toFixed(2)}`
                  : "-"}
              </p>
              <p>
                Pickup Location: ({selectedTrip?.pickup_latitude ?? "-"},{" "}
                {selectedTrip?.pickup_longitude ?? "-"})
              </p>
              <p>
                Dropoff Location: ({selectedTrip?.dropoff_latitude ?? "-"},{" "}
                {selectedTrip?.dropoff_longitude ?? "-"})
              </p>
              <p>Rate Code: {selectedTrip?.rate_code ?? "-"}</p>
            </div>
          </div>
        </div>
      </div>
      <TaxiChart />
    </div>
  );
}
