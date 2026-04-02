"use client";

import { useStore } from "@/store/useStore";
import { calculateRiskScore, formatCurrency } from "@/lib/score";
import { clsx } from "clsx";
import { 
  Users, 
  Activity,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const records = useStore((state) => state.records);

  // Calculate metrics
  const totalRecords = records.length;
  const totalDebt = records.reduce((acc, curr) => acc + curr.debtAmount, 0);

  // Group by customer for average risk
  const customerDebts = records.reduce((acc, curr) => {
    if (!acc[curr.ci]) {
      acc[curr.ci] = { count: 0, total: 0 };
    }
    acc[curr.ci].count += 1;
    acc[curr.ci].total += curr.debtAmount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  let totalRiskScore = 0;
  const uniqueCustomers = Object.keys(customerDebts).length;

  Object.values(customerDebts).forEach((cust) => {
    const { score } = calculateRiskScore(cust.count, cust.total);
    totalRiskScore += score;
  });

  const avgRiskScore = uniqueCustomers > 0 ? Math.round(totalRiskScore / uniqueCustomers) : 0;

  // Chart data simulation (Group by date)
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r, i) => {
      return {
        name: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        debt: records.slice(0, i + 1).reduce((acc, curr) => acc + curr.debtAmount, 0)
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Resumen
        </h1>
        <Link
          href="/dashboard/register"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          Añadir Registro
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Clientes Morosos"
          value={uniqueCustomers}
          subtitle={`Total de registros: ${totalRecords}`}
          icon={Users}
          color="bg-blue-600 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Monto Total de Deuda"
          value={formatCurrency(totalDebt)}
          subtitle="Todos los registros pendientes y pagados"
          icon={Activity}
          color="bg-red-600 text-red-600 dark:text-red-400"
        />
        <StatCard
          title="Puntuación de Riesgo Promedio"
          value={avgRiskScore}
          subtitle={avgRiskScore >= 700 ? "Riesgo Bajo" : avgRiskScore >= 400 ? "Riesgo Medio" : "Riesgo Alto"}
          icon={AlertTriangle}
          color="bg-amber-600 text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
          <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white mb-6">
            Tendencia de Deuda Acumulada
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Gs ${(value / 1000000).toFixed(1)}M`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), "Deuda Total"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="debt" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDebt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Records */}
        <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10 overflow-hidden flex flex-col">
          <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white mb-4">
            Registros Recientes
          </h2>
          <div className="flex-1 overflow-auto -mx-6 px-6">
            <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {records.slice(0, 5).map((record) => (
                <li key={record.id} className="flex justify-between gap-x-6 py-4">
                  <div className="flex min-w-0 gap-x-4 items-center">
                    <div className="h-10 w-10 flex-none rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-medium">
                      {record.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                        {record.customerName}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-slate-500 dark:text-slate-400">
                        CI: {record.ci}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-slate-900 dark:text-white font-medium">
                      {formatCurrency(record.debtAmount)}
                    </p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <div className={clsx(
                        "flex-none rounded-full p-1",
                        record.status === "paid" ? "bg-emerald-500/20" : "bg-rose-500/20"
                      )}>
                        <div className={clsx(
                          "h-1.5 w-1.5 rounded-full",
                          record.status === "paid" ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                      </div>
                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 capitalize">
                        {record.status === "paid" ? "Pagado" : "Pendiente"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {records.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No se encontraron registros.</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
