# Development Conventions — Financial Dashboard

> **Last updated**: 2026-09-23  
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

**Pattern: Router + app factory**

The FastAPI app is created via a factory function (`create_app()` in `main.py`) and routes are registered via an `APIRouter` in `routes.py`.

```python
# main.py
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.include_router(routes.router)
    yield

def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
    return app
```

**Evidence:** `main.py` uses `create_app()` factory; `routes.py` uses `APIRouter()`.

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
| kebab-case for lib files | `financial-types.ts`, `financial-utils.ts`, `mock-data.ts` | ✅ |
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

**Pattern: pytest + httpx TestClient + fixtures**

```python
@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)

@pytest.mark.anyio
async def test_health_endpoint_returns_ok(client):
    response = await client.get("/health")
    assert response.status_code == 200
```

**Evidence:** `conftest.py` defines `client()` fixture; `test_routes.py` uses `@pytest.mark.anyio` and `async/await`.

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
- Custom colors: green (`#10b981`) for income, red (`#ef4444`) for outcome
- Tooltips and legends enabled
- Responsive containers

**Evidence:** `income-outcome-chart.tsx` uses green/red lines; `profit-percent-chart.tsx` adds a dashed reference line.

---

## 6. Anti-Patterns Identified

### ❌ Hardcoded Values

```tsx
// Anti-pattern in dashboard-header.tsx
<DashboardHeader period="2024 - Full Year" />
```
The period label is hardcoded instead of being derived from actual data.

### ❌ Logic in Components (No Abstraction)

```tsx
// Anti-pattern in App.tsx — fetch lives inline, not in a hook or service
const fetchFinancialData = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/metrics');
    // ...
  }
}, []);
```
Should be extracted to a custom hook (`useFinancialData`).

### ❌ Mixed Language Error Messages

```tsx
// Anti-pattern in App.tsx
setError("No se pudo cargar la información financiera. Revisa la API de backend.");
```
Error message is in Spanish while the rest of the codebase is in English.

### ❌ Dead Code

`mock-data.ts` is never imported by any component — it exists but is unused.

### ❌ Mock Data Generated Per Request (Backend)

```python
# Anti-pattern in routes.py — called in every handler
movements = generate_mock_movements(seed=42)
```
Should be cached/initialized once at startup.

### ❌ Typo in Query Parameter Name

```python
# Anti-pattern in routes.py
async def comparison(start_date: date, end_date: date, ...):
    ...
```
Named `strat_date` in the route decorator but the parameter name is `start_date` elsewhere.

---

## 7. Git & Workflow Conventions

| Convention | Current Status |
|------------|---------------|
| Branch naming | Not established (no CONTRIBUTING.md) |
| Commit style | Not established (no conventional commits) |
| PR template | Not present |
| Code review | Not established |
| CI/CD | Not configured |

These are not implemented and would need to be established for collaboration.

---

## 8. Summary

### Established Strengths
- ✅ Clean component separation (container/presentational)
- ✅ Consistent naming conventions
- ✅ Tailwind-first styling approach
- ✅ shadcn/ui primitives with proper patterns
- ✅ Backend router + app factory pattern
- ✅ Loading/error/empty state handling
- ✅ Pytest + Vitest for testing

### Areas for Improvement
- ⚠️ Extract data fetching into custom hooks
- ⚠️ Make period label dynamic
- ⚠️ Remove dead code (`mock-data.ts`)
- ⚠️ Standardize language (Spanish → English)
- ⚠️ Cache mock data at startup instead of per-request
- ⚠️ Fix `strat_date` typo