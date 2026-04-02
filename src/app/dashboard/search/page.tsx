"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { calculateRiskScore, formatCurrency } from "@/lib/score";
import { Search } from "lucide-react";
import clsx from "clsx";

export default function SearchPage() {
  const [ci, setCi] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const getRecordsByCI = useStore((state) => state.getRecordsByCI);
  
  // Results
  const records = getRecordsByCI(ci);
  const totalDebt = records.reduce((acc, curr) => acc + curr.debtAmount, 0);
  const { score, level } = calculateRiskScore(records.length, totalDebt);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Buscar Cliente
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Busca a un cliente utilizando su número de identificación (CI).
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:ring-slate-700 dark:text-white"
            placeholder="Ingresar CI (ej. 1234567)"
            value={ci}
            onChange={(e) => {
              setCi(e.target.value);
              setHasSearched(false);
            }}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Buscar
        </button>
      </form>

      {/* Results */}
      {hasSearched && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10 p-6">
            <h2 className="text-lg font-semibold leading-7 text-slate-900 dark:text-white mb-4">
              Perfil de Riesgo
            </h2>
            <div className="flex flex-col items-center justify-center p-6 border border-slate-100 dark:border-slate-700 rounded-xl mb-6">
              <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-slate-50 dark:border-slate-900 shadow-sm">
                <span className={clsx(
                  "text-3xl font-bold",
                  level === "Low" ? "text-emerald-500" : level === "Medium" ? "text-amber-500" : "text-rose-500"
                )}>
                  {score}
                </span>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    strokeWidth="8%"
                    className="text-slate-100 dark:text-slate-700"
                    stroke="currentColor"
                  />
                  <circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    strokeWidth="8%"
                    strokeDasharray="290"
                    strokeDashoffset={290 - (290 * (score / 1000))}
                    className={clsx(
                      "transition-all duration-1000 ease-out",
                      level === "Low" ? "text-emerald-500" : level === "Medium" ? "text-amber-500" : "text-rose-500"
                    )}
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Nivel de Riesgo</p>
              <div className={clsx(
                "mt-1 rounded-full px-3 py-1 text-sm font-semibold",
                level === "Low" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : 
                level === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : 
                "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
              )}>
                Riesgo {level === "Low" ? "Bajo" : level === "Medium" ? "Medio" : "Alto"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Deuda Total</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Registros Activos</span>
                <span className="font-semibold text-slate-900 dark:text-white">{records.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Coincidencia de Nombre Principal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{records[0]?.customerName}</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10 p-6">
            <h2 className="text-lg font-semibold leading-7 text-slate-900 dark:text-white mb-4">
              Historial de Deudas
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {records.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(r.debtAmount)}</span>
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded-full font-medium capitalize",
                      r.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {r.status === "paid" ? "Pagado" : "Pendiente"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Registrado el: {new Date(r.date).toLocaleDateString()}
                    {(r.department || r.city) && (
                      <span className="ml-2 border-l border-slate-300 dark:border-slate-600 pl-2">
                        Ubicación: {[r.city, r.department, "Paraguay"].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <div className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-xs text-slate-500 dark:text-slate-400 mb-1">Descripción</p>
                      {r.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasSearched && records.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
          <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No se encontraron registros</h3>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            No hay deudas registradas que coincidan con el CI {ci}.
          </p>
        </div>
      )}
    </div>
  );
}
