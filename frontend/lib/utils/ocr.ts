import Tesseract from "tesseract.js";

export interface OcrResult {
  text: string;
  amount?: string;
  due_date?: string;
}

export const extractChequeData = async (file: File): Promise<OcrResult> => {
  const { data } = await Tesseract.recognize(file, "eng");
  const text = data.text.trim();

  const amountMatch = text.match(/₹?\s?(\d{1,7}(\.\d{1,2})?)/);

  const dateMatch =
    text.match(/\b\d{4}[-/]\d{2}[-/]\d{2}\b/) ||
    text.match(/\b\d{2}[-/]\d{2}[-/]\d{4}\b/);

  let formattedDate: string | undefined = undefined;
  if (dateMatch) {
    formattedDate = dateMatch[0].replace(/\//g, "-");
  }

  return {
    text,
    amount: amountMatch ? amountMatch[1] : undefined,
    due_date: formattedDate,
  };
};
