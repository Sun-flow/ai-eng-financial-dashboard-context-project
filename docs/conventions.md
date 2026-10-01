# Development Conventions — Financial Dashboard

> **Last updated**: 2026-10-01  
> **Purpose**: Catalog established patterns, conventions, and anti-patterns found in the codebase.

---

## 1. Architecture Conventions

### 1.1 Frontend Component Architecture

**Pattern: Composition with presentational components**

Components receive data via props and are purely presentational. State management lives in the parent (`App.tsx`).

```tsx
// ✅ Good — App.tsx owns state, passes down as props
<KPIRow kpiData={kpiData} loading={loading} />
<IncomeOutcomeChart data={monthlyData} />
```

**Evidence:** `App.tsx` defines all state (`loading`, `error`, `data`) and passes to children. No child component manages its own fetch or state.

### 1.2 Backend Architecture

**Pattern: Module-level app + APIRouter**

The FastAPI app is created at **module level** in `main.py`. Routes are registered on a separate `APIRouter` in `routes.py`, which is included at module scope. CORS origins are driven by the `CORS_ORIGINS` environment variable (comma-separated, default `"*"`).

```python
# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

origins_str = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in origins_str.split(",")]

app = FastAPI(title="Financial Metrics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
```

**Evidence:** `main.py` uses module-level `app = FastAPI()`, env-driven CORS, and `app.include_router(router)`. There is no factory function or lifespan handler.

### 1.3 Data Flow Pattern

**Pattern: Fetch → Transform → Render**

1. Fetch raw data from API (`GET /api/metrics`)
2. Transform via pure utility functions (`computeKPIs`, `computeMonthlyData`)
3. Pass transformed data to presentational components

**Evidence:** `App.tsx` calls both compute functions between fetch and render.

---

## 2. Naming Conventions

### 2.1 Files & Folders

| Convention | Examples | Evidence |
|------------|----------|----------|
| kebab-case for component files | `kpi-card.tsx`, `kpi-row.tsx`, `dashboard-header.tsx` | ✅ |
| kebab-case for lib files | `financial-types.ts`, `financial-utils.ts`, `utils.ts` | ✅ |
| PascalCase for component exports | `KPICard`, `KPIRow`, `DashboardHeader` | ✅ |
| PascalCase for interfaces/types | `FinancialMovement`, `KPIMetrics`, `MonthlyData` | ✅ |
| camelCase for functions/variables | `computeKPIs`, `formatCurrency`, `fetchFinancialData` | ✅ |
| snake_case for Python | `generate_mock_movements`, `operation_type`, `create_date` | ✅ |

### 2.2 API Route Naming

**Pattern: `/api/metrics/...` with descriptive paths**

| Route | Convention |
|-------|------------|
| `/api/metrics` | Plural, resource-based |
| `/api/metrics/summary` | Sub-resource |
| `/api/metrics/categories/top` | Nested resource with action |
| `/api/metrics/comparison` | Named operation |
| `/api/metrics/alerts` | Named feature |

**Evidence:** All routes in `routes.py` follow this pattern.

---

## 3. Testing Conventions

### 3.1 Backend Tests

**Pattern: pytest + TestClient + synchronous fixtures**

```python
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client() -> TestClient:
    """Isolated TestClient instance per test to prevent state leakage."""
    return TestClient(app)

def test_health_endpoint_returns_ok(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

**Evidence:** `conftest.py` imports the module-level `app` directly and returns a synchronous `TestClient`. All test functions are plain `def` (no async, no `@pytest.mark.anyio`). The fixture is function-scoped for isolation.

### 3.2 Frontend Tests

**Pattern: Vitest + describe/it blocks**

```typescript
describe('computeKPIs', () => {
  it('calculates totals and profit values', () => {
    // test body
  });
});
```

**Evidence:** `financial-utils.test.ts` uses Vitest with `describe` and `it`.

---

## 4. UX Conventions

### 4.1 Loading States

**Pattern: Skeleton placeholders during data fetch**

```tsx
{loading ? (
  <Skeleton className="h-8 w-24" />
) : (
  <span>{formatCurrency(kpiData?.income ?? 0)}</span>
)}
```

**Evidence:** `kpi-card.tsx` renders `<Skeleton>` when `loading` prop is true.

### 4.2 Error States

**Pattern: Inline error banner**

```tsx
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

**Evidence:** `App.tsx` renders a red error banner when `error` state is non-null.

### 4.3 Empty States

**Pattern: "No data available" fallback in charts**

```tsx
{data.every(d => d.income === 0 && d.outcome === 0) ? (
  <p className="text-gray-500">No data available</p>
) : (
  <Chart />
)}
```

**Evidence:** Both `income-outcome-chart.tsx` and `profit-percent-chart.tsx` check for all-zero data.

### 4.4 Styling

**Pattern: Tailwind CSS utility classes + shadcn/ui primitives**

- No CSS modules or styled-components
- All styling uses Tailwind classes inline
- shadcn/ui components use `cn()` utility for class merging

```tsx
<Card className="bg-white shadow-md rounded-lg p-6">
  <CardTitle className="text-lg font-semibold text-gray-700">
    {title}
  </CardTitle>
</Card>
```

**Evidence:** All component files exclusively use Tailwind classes.

---

## 5. UI Component Patterns

### 5.1 shadcn/ui Usage

**Pattern: Copy-paste primitives with `cn()` utility**

```typescript
// card.tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
  )
);
```

**Evidence:** `card.tsx` and `skeleton.tsx` follow the standard shadcn/ui pattern with `cn()` and `forwardRef`.

### 5.2 Chart Components

**Pattern: Recharts with consistent styling**

- Use `LineChart` as primary chart type
- Colors defined via CSS variables: `--chart-income` (blue), `--chart-outcome` (orange), `--chart-profit` (green) — see `index.css`
- Tooltips and legends enabled
- Responsive containers

**Evidence:** `income-outcome-chart.tsx` uses `var(--chart-income)`/`var(--chart-outcome)` for its two series; `profit-percent-chart.tsx` uses `var(--chart-profit)` for the profit line and a dashed `ReferenceLine` at y=0.

---

## 6. Anti-Patterns Identified (Resolved)

> The following anti-patterns were found during the initial audit and have since been fixed. They are kept here as historical reference and to prevent regression.

### ✅ Hardcoded Values (Fixed)

```
// Was: <DashboardHeader period="2024 - Full Year" />
// Now: <DashboardHeader period={periodLabel ?? undefined} />
```
The period label was hardcoded; `App.tsx` now passes a dynamically derived label from `computePeriodLabel(movements)` in `financial-utils.ts`.

### ✅ Logic in Components / No Hook (Fixed)

```
// Was: inline useCallback in App.tsx
// Now: encapsulated in use-financial-data.ts custom hook
```
Data fetching was extracted into `useFinancialData()` in `hooks/use-financial-data.ts`.

### ✅ Mixed Language Error Messages (Fixed)

```
// Was: "No se pudo cargar la información financiera. Revisa la API de backend."
// Now: "Could not load financial data. Check the backend API."
```
The Spanish error message was replaced with English, consistent with the rest of the codebase.

### ✅ Dead Code — mock-data.ts (Removed)

The unused `mock-data.ts` file (52 hardcoded movements, never imported) has been deleted.

### ✅ Mock Data Regenerated Per Request (Fixed)

```python
# Was: called fresh in every handler
# Now: @lru_cache(maxsize=1) caches the result per (seed, today) tuple
```
`generate_mock_movements` was decorated with `@lru_cache(maxsize=1)`, so the 360 movements are generated once and served from cache on all subsequent requests.

### ✅ Typo in Query Parameter Name (Not Found)

The claimed `strat_date` typo was investigated and does not exist in the current codebase — all 9 route handlers consistently use `start_date` in both the decorator query and function parameter name.

---

## 7. Git & Workflow Conventions

| Convention | Current Status |
|------------|---------------|
| Branch naming | Not established (no CONTRIBUTING.md) |
| Commit style | Not established (no conventional commits) |
| PR template | Not present |
| Code review | Not established |
| CI/CD | CI workflow present locally (`.github/workflows/ci.yml`) but not yet pushed to GitHub |

These are not fully implemented and would need to be established for collaboration.

---

## 8. Summary

### Established Strengths
- ✅ Clean component separation (container/presentational)
- ✅ Consistent naming conventions
- ✅ Tailwind-first styling approach
- ✅ shadcn/ui primitives with proper patterns
- ✅ Backend router + module-level app pattern
- ✅ Loading/error/empty state handling
- ✅ Dynamic period label derived from data
- ✅ Error boundary wrapping the dashboard
- ✅ Data fetching extracted into custom hook
- ✅ English-only user-facing strings
- ✅ Pytest + Vitest for testing
- ✅ Render tests for components
- ✅ Multi-stage Docker builds (dev/prod separation)
- ✅ Healthcheck in Docker Compose
- ✅ .dockerignore files for both services
- ✅ CORS driven by environment variable
- ✅ Vite proxy target parameterized via env var
- ✅ Mock data cached via lru_cache
- ✅ Pinned Python dependency versions

### Areas for Improvement
- ⚠️ Chart colors use blue/orange (oklch) instead of green/red semantic — violates Rule 8
- ⚠️ `utils.ts` has no dedicated utility test — violates Rule 16
- ⚠️ `KPIRow`, `Card`, and `Skeleton` have no render tests
- ⚠️ `frontend/src/assets/hero.png` appears unreferenced — needs intentional-use decision (Rule 19)
- ⚠️ No lockfile for Python dependencies (Rule 14)
- ⚠️ Docker bridge networking (#10) times out in both directions (paused)