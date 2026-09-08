import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL, timeout: 30000 });

function unwrap(promise) {
  return promise
    .then((res) => res.data.data)
    .catch((err) => {
      const message =
        err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      const details = err.response?.data?.details;
      const wrapped = new Error(message);
      wrapped.details = details;
      wrapped.status = err.response?.status;
      throw wrapped;
    });
}

export const getProblems = () => unwrap(api.get("/problems"));
export const getProblem = (id) => unwrap(api.get(`/problems/${id}`));

export const createAttempt = (problemId) => unwrap(api.post("/attempts", { problemId }));
export const getAttempts = () => unwrap(api.get("/attempts"));
export const getAttempt = (id) => unwrap(api.get(`/attempts/${id}`));
export const submitAttempt = (id, payload) => unwrap(api.post(`/attempts/${id}/submit`, payload));

export const getEvaluation = (attemptId) => unwrap(api.get(`/evaluations/${attemptId}`));

export default api;
