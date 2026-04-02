export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskProfile {
  score: number;
  level: RiskLevel;
}

export function calculateRiskScore(
  numberOfDebts: number,
  totalDebtAmount: number
): RiskProfile {
  // score = 1000 - (number_of_debts * 120) - (total_debt * 0.05)
  const scoreRaw = 1000 - numberOfDebts * 120 - totalDebtAmount * 0.05;
  const score = Math.max(0, Math.round(scoreRaw)); // cap at 0 minimum

  let level: RiskLevel = "High";
  if (score >= 700) {
    level = "Low";
  } else if (score >= 400) {
    level = "Medium";
  }

  return { score, level };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  }).format(amount);
}
