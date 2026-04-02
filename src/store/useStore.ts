import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecordStatus = "pending" | "paid";

export interface DelinquentRecord {
  id: string;
  customerName: string;
  ci: string;
  debtAmount: number;
  date: string; // ISO string
  status: RecordStatus;
  description?: string;
  department?: string;
  city?: string;
}

interface User {
  email: string;
}

interface AppState {
  // Auth state
  user: User | null;
  login: (email: string) => void;
  logout: () => void;

  // Records state
  records: DelinquentRecord[];
  addRecord: (record: Omit<DelinquentRecord, "id">) => void;
  updateRecordStatus: (id: string, status: RecordStatus) => void;
  getRecordsByCI: (ci: string) => DelinquentRecord[];
}

// Initial mock data to populate the dashboard
const initialRecords: DelinquentRecord[] = [
  {
    id: "1",
    customerName: "Juan Perez",
    ci: "1234567",
    debtAmount: 1500000,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    customerName: "Maria Gonzalez",
    ci: "7654321",
    debtAmount: 5000000,
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    customerName: "Carlos Lopez",
    ci: "4445556",
    debtAmount: 320000,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "paid",
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email) => set({ user: { email } }),
      logout: () => set({ user: null }),

      records: initialRecords,
      addRecord: (record) =>
        set((state) => ({
          records: [{ id: crypto.randomUUID(), ...record }, ...state.records],
        })),
        
      updateRecordStatus: (id, status) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      getRecordsByCI: (ci) => {
        return get().records.filter((r) => r.ci === ci);
      },
    }),
    {
      name: "credit-risk-storage",
    }
  )
);
