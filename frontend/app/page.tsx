"use client";
import { useEffect, useState } from "react";
import { getCheques } from "@/lib/api/api";
import ChequeCard from "@/components/ChequeCard/index";
import { exportToExcel } from "@/lib/utils/exportToExcel";

export default function DashboardPage() {
  const [cheques, setCheques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCheques = async () => {
    setLoading(true);
    const data = await getCheques();
    setCheques(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCheques();
  }, []);

  const filteredCheques = cheques.filter((chq) => {
    const matchesSearch =
      chq.payer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chq.cheque_no?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "All" || chq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const total = cheques.length;
  const cleared = cheques.filter((c) => c.status === "Cleared").length;
  const pending = cheques.filter((c) => c.status === "Pending").length;
  const bounced = cheques.filter((c) => c.status === "Bounced").length;

   if (loading)
     return (
       <div className="space-y-4 animate-pulse">
         {[...Array(4)].map((_, i) => (
           <div
             key={i}
             className="p-4 border border-gray-200 rounded-xl bg-gray-50"
           >
             <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
             <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
             <div className="h-3 bg-gray-200 rounded w-1/2"></div>
           </div>
         ))}
       </div>
     );


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cheque Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700">Total Cheques</p>
          <p className="text-xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
          <p className="text-sm text-green-700">Cleared</p>
          <p className="text-xl font-bold">{cleared}</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-xl font-bold">{pending}</p>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-sm text-red-700">Bounced</p>
          <p className="text-xl font-bold">{bounced}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by payer or cheque number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Cleared">Cleared</option>
          <option value="Bounced">Bounced</option>
        </select>
      </div>

      <div className="flex gap-3 mb-6 justify-end">
        <button
          onClick={() => exportToExcel(filteredCheques)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
      </div>

      <div className="space-y-4">
        {filteredCheques.length > 0 ? (
          filteredCheques.map((chq) => (
            <ChequeCard
              key={chq.id}
              cheque={chq}
              onStatusChange={fetchCheques}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No cheques found.</p>
        )}
      </div>
    </div>
  );
}
