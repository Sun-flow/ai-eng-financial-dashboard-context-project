# Rule: snake_case in Python

## Scope
All Python identifiers in the backend

## Rule Statement
Backend code must use snake_case for functions, variables, and API parameter names.

## Rationale
snake_case is the PEP 8 standard for Python. The current codebase already follows this convention uniformly — `generate_mock_movements`, `operation_type`, `business_type` — and consistency with Python ecosystem conventions reduces cognitive friction for contributors.

## Application Guidance
- Functions: `def function_name():` not `def functionName():`.
- API query parameters: `operation_type` not `operationType`.
- Pydantic model fields: `create_date` not `createDate`.
- Classes and types (Pydantic models, etc.) use PascalCase: `FinancialMovement`, `MetricsSummaryItem`.

## Supporting References
- `docs/project-map.md` – Backend Details: function names `generate_mock_movements`, `filter_movements`, `summarize_movements`
- `docs/conventions.md` – §2.1: snake_case for Python evidence