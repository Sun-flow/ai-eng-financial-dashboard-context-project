import { useEffect, useState } from "react";
import type {
  FinancialMovement,
  KPIMetrics,
  MonthlyDataPoint,
} from "@/lib/financial-types";
import {
  computeKPIs,
  computeMonthlyData,
  computePeriodLabel,
} from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

export interface UseFinancialDataResult {
  movements: FinancialMovement[];
  metrics: KPIMetrics | null;
  monthlyData: MonthlyDataPoint[];
  periodLabel: string | null;
  loading: boolean;
  error: string | null;
}

export function useFinancialData(): UseFinancialDataResult {
  const [movements, setMovements] = useState<FinancialMovement[]>([]);
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchFinancialData()
      .then((data) => {
        if (cancelled) return;
        setMovements(data);
        setMetrics(computeKPIs(data));
        setMonthlyData(computeMonthlyData(data));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load financial data. Check the backend API.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const periodLabel = computePeriodLabel(movements);

  return { movements, metrics, monthlyData, periodLabel, loading, error };
}