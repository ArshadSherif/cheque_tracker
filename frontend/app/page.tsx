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

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Payments</h1>

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
