import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://agatha-christie-a4077-default-rtdb.firebaseio.com/db2.json",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getNovels() {
    return apiClient.get("");
  }
};
