export default function ChequeStatus({ cheque }: any) {
  const isFinalStatus =
    cheque.status === "Bounced" || cheque.status === "Cleared";

  const color =
    cheque.status === "Cleared"
      ? "text-green-600"
      : cheque.status === "Bounced"
      ? "text-red-600"
      : "text-orange-500";

  const statusDate = cheque.updated_at
    ? new Date(cheque.updated_at).toLocaleDateString()
    : new Date(cheque.created_at).toLocaleDateString();

  return (
    <div className="mt-1">
      <p className="text-sm">
        Status: <span className={`font-medium ${color}`}>{cheque.status}</span>
      </p>
      {isFinalStatus && (
        <p className="text-xs text-gray-500 mt-1">
          {cheque.status === "Cleared"
            ? `Cleared on ${statusDate}`
            : `Bounced on ${statusDate}`}
        </p>
      )}
    </div>
  );
}
