"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { extractChequeData } from "@/lib/utils/ocr";
import { addCheque } from "@/lib/api/api";
import { useRouter } from "next/navigation";

export default function AddChequePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payer_name: "",
      bank_name: "",
      cheque_no: "",
      amount: "",
      due_date: "",
      image: null as File | null,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setValue("image", file);
    setLoading(true);

    try {
      const result = await extractChequeData(file);
      console.log("OCR Text:", result.text);
      setOcrText(result.text);

      if (result.amount) setValue("amount", result.amount);
      if (result.due_date) setValue("due_date", result.due_date);
    } catch (err) {
      console.error("OCR failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const { payer_name, bank_name, cheque_no, amount, due_date, image } = data;
    const formData = new FormData();
    formData.append("payer_name", payer_name);
    formData.append("bank_name", bank_name);
    formData.append("cheque_no", cheque_no);
    formData.append("amount", amount);
    formData.append("due_date", due_date);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await addCheque(formData);
      router.push("/");
    } catch (error) {
      alert("Error adding cheque");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5 border"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Add Cheque
        </h1>

        {/* Payer Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Payer Name</label>
          <input
            {...register("payer_name", { required: "Payer name is required" })}
            placeholder="Enter payer name"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.payer_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.payer_name.message as string}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            {...register("bank_name", { required: "Bank name is required" })}
            placeholder="Enter bank name"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.bank_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bank_name.message as string}
            </p>
          )}
        </div>

        {/* Cheque Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cheque Number
          </label>
          <input
            {...register("cheque_no", {
              required: "Cheque number is required",
            })}
            placeholder="Enter cheque number"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.cheque_no && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cheque_no.message as string}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { required: "Amount is required" })}
            placeholder="Enter amount"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.amount.message as string}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            {...register("due_date", { required: "Due date is required" })}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors.due_date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.due_date.message as string}
            </p>
          )}
        </div>

        {/* Cheque Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Cheque Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded-md p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-auto object-cover rounded mt-2 border"
            />
          )}
          {ocrText && (
            <p className="text-xs text-gray-500 mt-1">
              Parsed Text: {ocrText.substring(0, 80)}...
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Submit Cheque"}
        </button>
      </form>
    </div>
  );
}
