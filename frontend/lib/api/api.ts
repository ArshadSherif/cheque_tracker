import axios from "axios";


export const getCheques = async () => {
  console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cheques`);
  return res.data;
};

export const addCheque = async (data: FormData) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cheques`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateChequeStatus = async (id: number, status: string) => {
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/cheques/${id}/status`, {
    status,
  });
  return res.data;
};
