"use client";
import { useState } from "react";
import { updateChequeStatus } from "@/lib/api/api";
import ChequeDetails from "./ChequeDetails";
import ChequeStatus from "./ChequeStatus";
import ChequeExpiry from "./ChequeExpiry";
import StatusButtons from "./StatusButtons";

export default function ChequeCard({ cheque, onStatusChange }: any) {
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status: string) => {
    setLoading(true);
    await updateChequeStatus(cheque.id, status);
    setLoading(false);
    onStatusChange();
  };

  const isFinalStatus =
    cheque.status === "Bounced" || cheque.status === "Cleared";

  return (
    <div className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
      <div>
        <ChequeDetails cheque={cheque} />
        <ChequeStatus cheque={cheque} />
        {!isFinalStatus && <ChequeExpiry dueDate={cheque.due_date} />}
      </div>

      <StatusButtons
        status={cheque.status}
        isFinalStatus={isFinalStatus}
        loading={loading}
        onClick={handleStatus}
      />
    </div>
  );
}
