export default function ChequeDetails({ cheque }: any) {
  return (
    <>
      <h2 className="font-semibold text-lg">{cheque.payer_name}</h2>
      <p className="text-gray-600">₹{cheque.amount}</p>
      <p className="text-sm text-gray-500">Due: {cheque.due_date}</p>
    </>
  );
}
