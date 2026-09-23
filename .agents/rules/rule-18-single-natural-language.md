# Rule: Single Natural Language

## Scope
All user-facing strings in the frontend codebase

## Rule Statement
All user-facing strings in the codebase must use the same natural language.

## Rationale
Mixed-language interfaces confuse users and signal inconsistency in the product. The current codebase is predominantly English, but `App.tsx` contains a Spanish error message: `"No se pudo cargar la información financiera. Revisa la API de backend."` This creates a jarring experience for English-speaking users and implies incomplete localization. If internationalization is needed, it should use a proper i18n library, not ad-hoc mixing.

## Application Guidance
- All strings visible to users must be in the project's primary language (English).
- For multi-language support, adopt an i18n library (e.g. `react-i18next`) with locale files — never mix languages in source code.
- Error messages, labels, tooltips, and empty-state text are all user-facing strings.
- Internal-only strings (console logs, comments, variable names) are exempt.

## Supporting References
- `docs/operational-blockers.md` – Issue #9: Error message in Spanish in `App.tsx`