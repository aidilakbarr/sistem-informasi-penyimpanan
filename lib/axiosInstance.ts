import axios from "axios";

const db = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
});

// db.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

db.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Api error: ", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default db;
