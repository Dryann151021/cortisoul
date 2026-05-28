import axios from 'axios';

const predictServiceBaseUrl = process.env.PREDICT_SERVICE_URL;

const predictService = async (text) => {
  try {
    const response = await axios.post(`${predictServiceBaseUrl}/predict`, {
      text,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Gagal memanggil layanan prediksi';
    throw new Error(errorMessage, { cause: error });
  }
};

export default predictService;
