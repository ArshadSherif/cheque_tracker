interface Props {
  status: string;
  isFinalStatus: boolean;
  loading: boolean;
  onClick: (status: string) => void;
}

export default function StatusButtons({
  status,
  isFinalStatus,
  loading,
  onClick,
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onClick("Cleared")}
        disabled={loading || isFinalStatus}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        Mark Cleared
      </button>

      <button
        onClick={() => onClick("Pending")}
        disabled={loading || isFinalStatus}
        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
      >
        Pending
      </button>

      <button
        onClick={() => onClick("Bounced")}
        disabled={loading || isFinalStatus}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        Bounced
      </button>
    </div>
  );
}
