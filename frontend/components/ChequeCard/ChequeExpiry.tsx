export default function ChequeExpiry({ dueDate }: { dueDate: string }) {
  if (!dueDate) return <p className="text-gray-500 text-sm">No due date</p>;

  const diffDays = (() => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const expiryText =
    diffDays < 0
      ? `Expired ${Math.abs(diffDays)} day${
          Math.abs(diffDays) !== 1 ? "s" : ""
        } ago`
      : `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;

  const color =
    diffDays < 0
      ? "text-red-600"
      : diffDays <= 2
      ? "text-orange-500"
      : "text-green-600";

  return <p className={`text-sm mt-1 font-medium ${color}`}>⏰ {expiryText}</p>;
}
