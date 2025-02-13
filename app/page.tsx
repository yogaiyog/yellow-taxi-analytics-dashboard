"use client";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      <DynamicMap />
      <DataTable/>
    </div>
  );
}
