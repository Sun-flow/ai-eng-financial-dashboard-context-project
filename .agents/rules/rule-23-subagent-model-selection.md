# Rule: Subagent Model Selection

## Scope
All subagent dispatches via the `task` tool (or equivalent agent-spawning mechanisms).

## Rule Statement
Every subagent or child agent dispatched **must** explicitly specify a model that belongs to the **4Geeks/downtown-miami OpenRouter provider**. No subagent may be dispatched without an explicit `model` parameter, and the model must be one from the following approved list:

- `4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash` (preferred)
- `4geeks/downtown-miami/openrouter/perplexity/pplx-embed-v1-0.6b`
- `4geeks/downtown-miami/z-ai/glm-5.3-flash`
- `4geeks/downtown-miami/openrouter/openai/gpt-6-luna`

## Rationale
Models outside the 4Geeks student subscription (e.g. direct Anthropic, OpenAI, or Google models) consume a separate credit pool that has very limited capacity. Using only the 4Geeks/downtown-miami OpenRouter models ensures subagent work stays within the student subscription's included usage, avoiding silent credit-limit failures mid-task.

## Application Guidance
- When calling the `task` tool, always include `model: "4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash"` (or another approved model from the list above) in the parameters.
- Do **not** rely on runtime default model resolution — explicitly pass the model every time.
- If dispatching a subagent with a lighter/heavier task, the `-flash` variant (`deepseek-v4-flash`) is the default; use `gpt-6-luna` or `glm-5.3-flash` when more capable reasoning is needed for a specific subtask.

## Supporting References
- Task tool `model` parameter documentation in the agent tool list.
- `.agents/rules/rule-18-single-natural-language.md` (prefer consistent terminology).