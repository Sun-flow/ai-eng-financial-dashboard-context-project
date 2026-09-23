# Project Map — Financial Dashboard

> **Last updated**: 2026-09-23  
> **Scope**: Full-stack financial dashboard with React+TypeScript frontend and FastAPI/Python backend.

---

## 1. Repository Structure

```
ai-eng-financial-dashboard-context-project/
├── AGENTS.md                    # Agent instructions / onboarding
├── docker-compose.yml           # Orchestrates backend + frontend services
├── README.md                    # Project overview (English)
├── README.es.md                 # Project overview (Spanish)
│
├── backend/
│   ├── Dockerfile               # FastAPI container (Python 3.13-slim, debugpy + uvicorn)
│   ├── requirements.txt         # Python deps (fastapi, uvicorn, debugpy, pytest, httpx)
│   ├── app/
│   │   ├── __init__.py          # Package init (empty)
│   │   ├── main.py              # FastAPI app (module-level), CORS, router inclusion
│   │   └── routes.py            # API route handlers + mock data + business logic
│   └── tests/
│       ├── conftest.py          # Pytest path setup for imports
│       └── test_routes.py       # API tests (15 tests)
│
├── frontend/
│   ├── Dockerfile               # Node 24-alpine dev image
│   ├── components.json          # shadcn/ui components config
│   ├── eslint.config.js         # ESLint flat config
│   ├── index.html               # Vite HTML entry point
│   ├── package.json             # Node dependencies & scripts
│   ├── tsconfig.json            # Root TS config (references)
│   ├── tsconfig.app.json        # App TS config
│   ├── tsconfig.node.json       # Node TS config
│   ├── vite.config.ts           # Vite bundler config (+ React, Tailwind, proxy)
│   ├── .env.example             # VITE_API_BASE_URL override
│   ├── public/
│   │   └── favicon.svg          # ✅ Exists — browser tab icon
│   └── src/
│       ├── App.tsx              # Root React component (fetching, state, rendering)
│       ├── index.css            # Global styles / Tailwind CSS 4 + oklch theming
│       ├── main.tsx             # React entry point
│       ├── assets/              # Static assets (empty)
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── dashboard-header.tsx
│       │   │   ├── income-outcome-chart.tsx
│       │   │   ├── kpi-card.tsx
│       │   │   ├── kpi-row.tsx
│       │   │   └── profit-percent-chart.tsx
│       │   └── ui/
│       │       ├── card.tsx     # shadcn/ui Card primitive
│       │       └── skeleton.tsx # shadcn/ui Skeleton primitive
│       └── lib/
│           ├── financial-types.ts       # TypeScript interfaces (FinancialMovement, etc.)
│           ├── financial-utils.test.ts  # Vitest: 3 cases, 2 describe blocks
│           ├── financial-utils.ts       # computeKPIs, computeMonthlyData, formatCurrency, etc.
│           ├── mock-data.ts             # 57 hardcoded mock movements (⚠️ dead code — unused)
│           └── utils.ts                 # cn() helper (clsx + tailwind-merge)
```

---

## 2. Architecture Overview

```
┌──────────────┐       HTTP/JSON        ┌──────────────┐
│   Frontend   │  ◄──────────────────►  │   Backend    │
│  React + Vite│    Vite proxy /api     │  FastAPI      │
│  TypeScript  │    → backend:8000      │  Python 3.13  │
│  Tailwind 4  │                        │  Uvicorn      │
│  Recharts    │                        │  Debugpy      │
│  shadcn/ui   │                        │               │
└──────┬───────┘                        └──────┬────────┘
       │                                       │
       │  Port 5173                             │  Port 8000 (API)
       │  Docker / dev                          │  Port 5678 (debugger)
       └──────────────────┬────────────────────┘
                          │
                    docker-compose.yml
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React + Vite | Fast dev server, TS-native, modern tooling |
| Styling | Tailwind CSS 4 | Utility-first, composable, low specificity |
| UI components | shadcn/ui | Copy-paste primitives, full control |
| Charts | Recharts | Declarative, React-native charting |
| Backend framework | FastAPI | Async-capable, auto-docs, Pydantic validation |
| Containerization | Docker Compose | Single-command dev & prod parity |
| Dev frontend | Vite dev server (hot-reload) | Fast iteration |

### Data Flow

1. **`App.tsx`** mounts → calls `fetchFinancialData()` → `GET /api/metrics` (via Vite proxy)
2. **Backend** (`routes.py`) returns `FinancialMovement[]` from `generate_mock_movements(seed=42)` (360 items)
3. **Frontend** transforms via `financial-utils.ts`: `computeKPIs()` + `computeMonthlyData()`
4. **Dashboard components** render KPIs, income/outcome chart, profit chart

---

## 3. Backend Details

### `backend/app/main.py`
- FastAPI app created at **module level** (`app = FastAPI()`), no factory/`create_app()` function
- No lifespan handler — router inclusion and CORS middleware are configured at module scope
- CORS: `allow_origins=["*"]` (permissive, for development)

### `backend/app/routes.py`
**Endpoints (9 total: 1 health + 8 data):**

| Method | Path | Description | Query Params |
|--------|------|-------------|--------------|
| GET | `/health` | Health check → `{"status": "ok"}` | — |
| GET | `/api/metrics` | Full list of movements | `start_date`, `end_date`, `category`, `operation_type` |
| GET | `/api/metrics/facets` | Available filter facets | — |
| GET | `/api/metrics/summary` | Aggregated income/outcome/net per period | `group_by`, dates, filters |
| GET | `/api/metrics/categories/top` | Top categories by operation type | `operation_type`, `limit`, dates, filters |
| GET | `/api/metrics/comparison` | Compare net between two periods | `strat_date`, `end_date`, `business_type` |
| GET | `/api/metrics/alerts` | Spending alerts (outcome spikes) | `threshold`, `group_by`, dates, filters |
| GET | `/api/metrics/b2b` | Movements filtered to B2B only | dates, `category`, `operation_type` |
| GET | `/api/metrics/b2c` | Movements filtered to B2C only | dates, `category`, `operation_type` |

**Key business logic:**
- `generate_mock_movements(seed=42)` — 360 random movements (30/month × 12 months), seeded for reproducibility
- `filter_movements()` — Filters by date, category, operation type
- `summarize_movements()` — Groups by day/week/month, sums income/outcome/net
- `build_top_categories()` — Top N categories by amount for an operation type
- `calculate_net_value()` — Income minus outcome
- `detect_outcome_alerts()` — Flags periods where outcome exceeds historical average + threshold
- `build_metrics_facets()` — Extracts available filter values from data

**Data Models (Pydantic):**
| Model | Fields |
|-------|--------|
| `FinancialMovement` | create_date, amount, operation_type, category, business_type |
| `MetricsFacets` | operation_types, business_types, categories, min_date, max_date |
| `MetricsSummaryItem` | period, income, outcome, net |
| `TopCategoryItem` | category, operation_type, total_amount |
| `MetricsComparison` | current_period, previous_period, delta_abs, delta_pct |
| `MetricsAlert` | period, outcome_total, baseline_average, increase_ratio |

### Backend Tests (15 tests in `test_routes.py`)
- Fixtures via `conftest.py` (path configuration only; TestClient is module-level in test file)
- Uses `pytest` + `fastapi.testclient.TestClient` (synchronous)
- Coverage includes: mock generation, filter combinations, health endpoint, date ranges, B2B/B2C filtering, operation type filtering, category filtering

---

## 4. Frontend Details

### Component Tree

```
<App>
  <DashboardHeader period="2024 - Full Year" />
  <KPIRow>                            ← receives KPIMetrics | null
    <KPICard variant="income" />      ← Total Income
    <KPICard variant="outcome" />     ← Total Outcome
    <KPICard variant="profit" />      ← Profit
    <KPICard variant="profitPercent" />  ← Profit Margin %
  </KPIRow>
  <div (2-column grid)>
    <IncomeOutcomeChart />            ← Recharts LineChart (income & outcome lines)
    <ProfitPercentChart />            ← Recharts LineChart (profit % + reference line)
  </div>
</App>
```

### Type System (`financial-types.ts`)
```typescript
type OperationType = 'income' | 'outcome';
type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others';
type BusinessType = 'B2B' | 'B2C';

interface FinancialMovement {
  create_date: string;
  amount: number;
  operation_type: OperationType;
  category: Category;
  business_type: BusinessType;
}

interface KPIMetrics {
  income: number; outcome: number; profit: number; profitPercent: number;
}

interface MonthlyData {
  month: string; income: number; outcome: number; profit: number; profitPercent: number;
}
```

### Utilities (`financial-utils.ts`)
| Function | Input | Output |
|----------|-------|--------|
| `computeKPIs` | movements: FinancialMovement[] | KPIMetrics |
| `computeMonthlyData` | movements: FinancialMovement[] | MonthlyData[] |
| `formatCurrency` | value: number | string (`"$X,XXX.XX"`) |
| `formatPercent` | value: number | string (`"X.XX%"`) |

### Unit Tests (`financial-utils.test.ts`)
- **3 test cases** in **2 describe blocks**:
  - `computeKPIs` describe: `calculates totals and profit values`, `returns 0 profitPercent when there is no income`
  - `computeMonthlyData` describe: `returns chronological year-month points with aggregated totals`

### Dashboard Components

| Component | Responsibility |
|-----------|----------------|
| `dashboard-header.tsx` | Title + period badge |
| `kpi-card.tsx` | Single KPI metric with loading skeleton |
| `kpi-row.tsx` | Grid of 4 KPI cards (income, outcome, profit, profitPercent) |
| `income-outcome-chart.tsx` | Recharts LineChart: income vs outcome by month |
| `profit-percent-chart.tsx` | Recharts LineChart: profit % over time + reference line at 0 |

### UI Primitives (shadcn/ui)
- `card.tsx`: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`
- `skeleton.tsx`: `Skeleton` loading placeholder

### State Management (in `App.tsx`)
- `const [loading, setLoading] = useState(true);`
- `const [error, setError] = useState<string | null>(null);`
- `const [data, setData] = useState<FinancialMovement[]>([]);`
- **Loading state:** Skeleton placeholders
- **Error state:** Red error banner with Spanish message
- **Empty state:** "No data available" text in charts

---

## 5. Configuration Files

### `vite.config.ts`
- React plugin enabled
- Tailwind plugin
- Path alias `@/` → `src/`
- Proxy: `/api` → `http://backend:8000`

### `tsconfig.app.json`
- Target: ES2020, JSX: react-jsx, Strict mode
- Paths: `@/*` → `./src/*`

### `package.json` Scripts
| Script | Command |
|--------|---------|
| `dev` | `vite` (port 5173) |
| `build` | `tsc -b && vite build` |
| `preview` | `vite preview` |
| `lint` | `eslint .` |

### Key Dependencies (frontend)
- react 19, react-dom 19
- recharts 2.x
- lucide-react (icons)
- tailwindcss 4, tailwindcss/vite
- clsx, tailwind-merge
- vitest, @testing-library/react (dev)

---

## 6. Containerization

### `docker-compose.yml`
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    volumes: ["./frontend:/app", "/app/node_modules"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000", "5678:5678"]
    volumes: ["./backend:/app"]
```

### `backend/Dockerfile`
- Base: `python:3.13-slim`
- `pip install -r requirements.txt`
- CMD: `debugpy --listen 0.0.0.0:5678 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

### `frontend/Dockerfile`
- Multi-stage: `node:24-alpine` build → dev server
- `npm ci` then `npm run dev -- --host`

---

## 7. Shared Domain Model (Conceptual)

Both sides share the same domain concepts but **types are duplicated manually** — no shared schema or code generation:

| Concept | Backend (Pydantic) | Frontend (TypeScript) |
|---------|-------------------|----------------------|
| Operation Types | `income`, `outcome` | `'income' \| 'outcome'` |
| Categories | `suppliers`, `sales`, `operational`, `administrative`, `others` | Same 5 values |
| Business Types | `B2B`, `B2C` | `'B2B' \| 'B2C'` |
| Movement | `FinancialMovement` | `FinancialMovement` |

---

## 8. Running the Application

| Method | Backend | Frontend | URL |
|--------|---------|----------|-----|
| Docker | `docker compose up --build` | (same) | http://localhost:5173 |
| Local | `cd backend && pip install -r reqs.txt && uvicorn app.main:app --reload --port 8000` | `cd frontend && npm install && npm run dev` | http://localhost:5173 (frontend), http://localhost:8000 (API), http://localhost:8000/docs (Swagger) |

---

## 9. Key Observations

1. **Mock data regenerated on every request** — seeded generator is deterministic, but uncached; could be memoized.
2. **`mock-data.ts` is dead code** — 52 hand-written movements, never imported.
3. **No shared API contract** — Python Pydantic + TypeScript types are duplicated manually.
4. **No database** — All data is in-memory mock. Not production-ready.
5. **Frontend only uses `/api/metrics`** — 8 other API endpoints exist but have no UI consumer.
6. **Memory-bank exists at `/memories/repo/`** — 4 files for persistent project context.
7. **Page title is `"frontend"`** — Vite default, not customized.
8. **No CI/CD** — No GitHub Actions or pipeline config.
9. **Modern stack (2026)** — React 19, TypeScript 6, Vite 8, Python 3.13.
10. **9 operational blockers** documented in `docs/operational-blockers.md`.
| http://localhost:8000/redoc  | ReDoc API docs                  |

---

## 11. Project Structure (Full Tree)

```
.
├── AGENTS.md
├── docker-compse.yml
├── README.md
├── README.es.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── routes.py
│   └── tests/
│       ├── conftest.py
│       └── test_routes.py
├── docs/                         ← Newly created
├── frontend/
│   ├── .env.example
│   ├── components.json
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── assets/
│       ├── components/
│       │   ├── dashboard/
│       │   │   ├── dashboard-header.tsx
│       │   │   ├── income-outcome-chart.tsx
│       │   │   ├── kpi-card.tsx
│       │   │   ├── kpi-row.tsx
│       │   │   └── profit-percent-chart.tsx
│       │   └── ui/
│       │       ├── card.tsx
│       │       └── skeleton.tsx
│       └── lib/
│           ├── financial-types.ts
│           ├── financial-utils.test.ts
│           ├── financial-utils.ts
│           ├── mock-data.ts
│           └── utils.ts
```