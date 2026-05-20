import api from "./api";

const SESSION_KEY = "session";
const TOKEN_KEY = "token";

const getSession = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const setSession = ({ user, token }) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

// -------------------- USERS / AUTH --------------------
export const auth = {
  async register(user) {
    const { data } = await api.post("/auth/register", user);
    setSession(data);
    return data.user;
  },

  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    setSession(data);
    return data.user;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local logout should still succeed if the token is already expired.
    } finally {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getUser() {
    return getSession();
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  async me() {
    const { data } = await api.get("/auth/me");
    setSession({ user: data.user });
    return data.user;
  },
};

// -------------------- TRANSACTIONS --------------------
export const transactionsDb = {
  async getAll() {
    const { data } = await api.get("/transactions");
    return data.transactions || [];
  },

  async add(tx) {
    const { data } = await api.post("/transactions", tx);
    return data.transaction;
  },

  async update(id, updates) {
    const { data } = await api.patch(`/transactions/${id}`, updates);
    return data.transaction;
  },

  async remove(id) {
    await api.delete(`/transactions/${id}`);
  },
};

// -------------------- CUSTOMERS --------------------
export const customersDb = {
  async getAll() {
    const { data } = await api.get("/customers");
    return data;
  },

  async add(customer) {
    const { data } = await api.post("/customers", customer);
    return data.customer;
  },
};

// -------------------- MILESTONES --------------------
export const milestonesDb = {
  async getAll() {
    const { data } = await api.get("/milestones");
    return data.milestones || [];
  },

  async add(m) {
    const { data } = await api.post("/milestones", {
      ...m,
      dueDate: m.dueDate || m.deadline,
    });
    return data.milestone;
  },

  async update(id, updates) {
    const { data } = await api.patch(`/milestones/${id}`, updates);
    return data.milestone;
  },

  async remove(id) {
    await api.delete(`/milestones/${id}`);
  },
};

// -------------------- ADMIN --------------------
export const adminDb = {
  async overview() {
    const { data } = await api.get("/admin/overview");
    return data;
  },
};

