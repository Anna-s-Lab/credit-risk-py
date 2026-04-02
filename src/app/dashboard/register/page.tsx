"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PARAGUAY_DEPARTMENTS } from "@/lib/locationData";

export default function RegisterPage() {
  const [customerName, setCustomerName] = useState("");
  const [ci, setCi] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<"pending" | "paid">("pending");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");

  const availableCities = department ? PARAGUAY_DEPARTMENTS[department] || [] : [];

  const addRecord = useStore((state) => state.addRecord);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !ci || !debtAmount) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    addRecord({
      customerName,
      ci,
      debtAmount: Number(debtAmount),
      date: new Date(date).toISOString(),
      status,
      description,
      department,
      city,
    });

    toast.success("¡Registro añadido exitosamente!");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Registrar Cliente Moroso
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Añade un nuevo registro de deuda al sistema.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 sm:rounded-xl">
        <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Nombre del Cliente
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                  placeholder="Juan Perez"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ci" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Cédula de Identidad (CI)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="ci"
                  id="ci"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                  placeholder="1234567"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="debt" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Monto de la Deuda (PYG)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="debt"
                  id="debt"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Fecha
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Estado
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "pending" | "paid")}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                >
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Departamento (Paraguay)
              </label>
              <div className="mt-2">
                <select
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setCity(""); // Reset city when department changes
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                >
                  <option value="">Seleccione...</option>
                  {Object.keys(PARAGUAY_DEPARTMENTS).map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Ciudad
              </label>
              <div className="mt-2">
                <select
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!department}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{department ? "Seleccione..." : "Primero seleccione un departamento"}</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                Descripción / Detalles Adicionales
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:ring-slate-700 dark:text-white"
                  placeholder="Añade más detalles sobre la deuda o el moroso..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
