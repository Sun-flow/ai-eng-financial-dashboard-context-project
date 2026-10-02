# Rule: Subagent Model Selection

## Scope
All subagent dispatches via the `task` tool (or any other agent-spawning mechanism, e.g. direct `task()` calls, workflows, automated agents).

## Rule Statement
Every subagent **must** be dispatched with an **explicit `model` parameter** using a **full `4geeks/downtown-miami/...` provider path**. No subagent may be dispatched without the `model` parameter, and no short alias (e.g. `gpt-6-luna`) or non-4Geeks path is permitted.

✅ **Approved model strings** (and only these four):

| # | Full model string | Short identifier |
|---|-------------------|------------------|
| 1 | `4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash` | deepseek-v4-flash |
| 2 | `4geeks/downtown-miami/openrouter/openai/gpt-6-luna` | gpt-6-luna |
| 3 | `4geeks/downtown-miami/z-ai/glm-5.3-flash` | glm-5.3-flash |
| 4 | `4geeks/downtown-miami/openrouter/perplexity/pplx-embed-v1-0.6b` | pplx-embed-v1-0.6b |

## Rationale

### Why only full paths work
Empirical testing (Oct 2026) demonstrated that:
- **No model param** → subagents default to a non-4Geeks model (e.g. direct Anthropic/OpenAI) → **402 Quota Exceeded** from the separate credit pool.
- **Short alias only** (e.g. `model: "gpt-6-luna"`) → runtime resolves to a direct non-4Geeks model → **402 Quota Exceeded**.
- **Full 4Geeks path** (e.g. `model: "4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash"`) → ✅ routes through the student subscription → works reliably.

Only the complete `4geeks/downtown-miami/<provider>/<path>` string guarantees routing through the 4Geeks OpenRouter subscription that doesn't hit credit limits.

## Model Selection Guide — Which Model to Use When

> **📊 How these recommendations were determined (Oct 2026):** Each model was researched independently with exact, sourced benchmark numbers from official model cards, OpenRouter pricing pages, Vals AI, Artificial Analysis, and LLM-Stats. See the Supporting References for the complete set of sources.

### 1. `deepseek-v4-flash` — The Coding Champion ✅ (default for ~60% of work)

| Spec | Value | Source |
|------|-------|--------|
| Architecture | MoE, ~552B total / ~8–16B active | Official DeepSeek docs |
| Context | 1,048,576 tokens | Official DeepSeek docs |
| Max output | **384,000 tokens** (largest of all 4) | Official DeepSeek docs |
| Input cost | $0.22/M (off-peak) / $0.44/M (peak) | api-docs.deepseek.com |
| Output cost | $0.66/M (off-peak) / $1.32/M (peak) | api-docs.deepseek.com |
| Cached input | $0.007–0.014/M (extremely cheap) | api-docs.deepseek.com |

**Key Benchmarks (all ✅ confirmed with sources):**

| Benchmark | Score | vs GPT-6 Luna | vs GLM-5.3-Flash |
|-----------|-------|----------------|-------------------|
| **SWE-bench Verified** | **79.0%** | Luna: not on leaderboard | GLM: not published |
| **LiveCodeBench pass@1** | **91.6%** | Luna: ~67–69% (est) | GLM: not published |
| **Terminal-Bench 2.1** | **82.7%** | Luna: 73.0% | GLM: **84.3** ← GLM wins |
| **Vibe Code Bench** | **84.7%** | Luna: **81.7%** | GLM: not published |
| **Automation Bench 1.0.6** | **69%** | Luna: **53%** | GLM: 48.8 |
| **GPQA Diamond (reasoning)** | **88.1%** | Luna: **92.3%** ← Luna wins | GLM: unverified (suspicious 91.2 from 3rd party) |

**Strengths:**
- 🏆 **Best pure coding scores** in this set: leads on SWE-bench, LiveCodeBench, Vibe Code Bench.
- 🏆 **Largest output capacity**: 384K tokens — 3× more than GPT-6 Luna (128K). Essential for generating large codebases, full files, or long analyses in a single response.
- 🏆 **Cheapest cached input**: $0.007/M when cache hits — far cheaper than anything else in the set.
- Strong agentic performance (Automation Bench 69%).

**Best for:** ✅ Code generation, code review, large-file creation, architectural refactoring, API orchestration, structured coding tasks, batch processing with cache reuse.

**Verdict:** Default coding subagent. Use for any task where the primary output is **code** or the response needs to be **very long** (up to 384K tokens). Falls slightly behind GLM-5.3 on agentic-terminal tasks, but dominates on unit-test-verified coding (SWE-bench, LiveCodeBench).

---

### 2. `gpt-6-luna` — The Reasoning & Cost Champion ✅

| Spec | Value | Source |
|------|-------|--------|
| Architecture | OpenAI GPT-6 gen; adjustable reasoning effort | OpenAI docs |
| Context | 1,050,000 tokens | OpenAI docs |
| Max output | 128,000 tokens | OpenAI docs |
| Input cost | **$0.10/M** (CHEAPEST standard rate of all 4) | OpenAI docs |
| Output cost | **$0.50/M** (CHEAPEST standard rate of all 4) | OpenAI docs |
| Image input | ✅ Supported | OpenAI docs |
| Structured output (JSON) | ✅ Supported | OpenAI docs |

**Key Benchmarks (all ✅ confirmed with sources):**

| Benchmark | Score | vs DeepSeek | vs GLM-5.3 |
|-----------|-------|-------------|-------------|
| **GPQA Diamond (reasoning)** | **92.3%** 🏆 | DeepSeek: 88.1% | GLM: unverified |
| **Vibe Code Bench** | 81.7% | DeepSeek: **84.7%** | GLM: not published |
| **Terminal-Bench 2.1** | 73.0% | DeepSeek: 82.7% | GLM: **84.3%** |
| **Terminal-Bench 4.0** | 9.6% (harder version) | DeepSeek/GPT-6: weaker here | Not comparable |
| **Code Migration** | 42.55% | (No direct comparison) | (No direct comparison) |
| **Intelligence Index** | 37–38 | DeepSeek: 39–50 | GLM: 42 |

**Strengths:**
- 🏆 **Best reasoning** in this set: GPQA Diamond 92.3% — significantly ahead of DeepSeek (88.1%) and unverified GLM scores.
- 🏆 **Cheapest standard pricing**: $0.10/$0.50 per 1M tokens — beats DeepSeek on standard rates.
- **Image input** support (diagrams, screenshots, UI mockups).
- **Structured output** (JSON mode) for guaranteed parseable responses.
- Strong writing quality and instruction-following.

**Best for:** ✅ Reasoning-heavy tasks (multi-step logic, math, analysis), structured data extraction (JSON output), tasks requiring image understanding (diagrams, screenshots), summarization of very long documents, writing/rewriting polished text, classification/routing workflows.

**Verdict:** Use when the subagent is doing **reasoning, structured output, or image processing** rather than raw code generation. Its stronger GPQA score and lower cost make it ideal for tasks where correctness of logic matters more than output length, or where you need guaranteed JSON. For pure coding, DeepSeek beats it; for everything else, the value proposition is strong.

---

### 3. `glm-5.3-flash` — The Agentic Dark Horse ⚡

| Spec | Value | Source |
|------|-------|--------|
| Architecture | MoE, 320B total / 18B active; MIT licensed | HuggingFace model card |
| Context | 1,048,576 tokens | docs.z.ai |
| Max output | Not published, likely ~32–128K | — |
| Input cost | **$0.15/M** (in between DeepSeek & Luna) | docs.z.ai |
| Output cost | **$0.50/M** (tied with Luna for cheapest) | docs.z.ai |
| Cached input | **$0.03/M** (cheaper than DeepSeek standard) | docs.z.ai |
| Multimodal | Text + Image + Video | HuggingFace model card |
| License | **MIT** (open weights, free commercial use) | HuggingFace model card |

**Key Benchmarks (all ✅ confirmed from official Z.AI sources):**

| Benchmark | Score | Significance |
|-----------|-------|--------------|
| **Terminal-Bench 2.1** | **84.3** 🏆 | **Best agentic score in the set** — within 0.7 of Claude Opus 4.8 (85.0)! |
| **DeepSWE v1.1** | 63.4 | Strong software-engineering coding |
| **Toolathlon Verified** | **78.4** 🏆 | **Best tool-use score** in the set |
| **Z.ai Code Bench** (max) | 29.0 | Within 0.5 of Claude Opus 4.8 (29.5) |
| **AutomationBench** | 48.8 | 2× improvement over GLM-5.2 |
| **MVBench (video)** | **0.778** 🏆 | **#1 on leaderboard** (18 models) at launch |
| **Intelligence Index (AA v4.3.2)** | 42 | Close to DeepSeek (39–50 range) |
| **HLE w/ Tools** | 55.3 | Strong research-agent score |

> ⚠️ **What this model does NOT have published:** MMMU/MMMU-Pro, DocVQA, ChartQA, SWE-bench Verified, LiveCodeBench, HumanEval, MATH/AIME, Needle-in-a-Haystack, RULER — all absent from the official record. The multimodal capability is confirmed but most key image/video benchmarks are unsourced. Document generation (PPTX/PDF/DOCX/XLSX) is **claimed but has zero quality benchmarks**.

**Surprise finding:** Despite being marketed as "multimodal" and supporting Office file generation, **GLM-5.3-Flash is actually strongest at AGENTIC TASKS — real-world terminal use, tool calling, and automation.** It nearly matches Claude Opus 4.8 on Terminal-Bench and Code Bench at a tiny fraction of the cost.

**Best for:** ✅ Multi-step agentic workflows (tool orchestration, file manipulation, terminal interactions), automation pipelines, tasks requiring video understanding (only model with video support), lightweight software engineering, and any scenario where MIT licensing matters (free deployment/fine-tuning).

**Verdict:** Use when the subagent's task is **agentic/tool-driven** (calling APIs, running terminal commands, orchestration loops) or needs **video understanding**. For straight code-gen, DeepSeek is still stronger; for reasoning/writing, Luna is stronger. But for "go do a complex multi-step thing that involves tools," GLM-5.3 benchmarks best.

---

### 4. `pplx-embed-v1-0.6b` — Embeddings / Semantic Search / RAG

| Spec | Value | Source |
|------|-------|--------|
| Architecture | 600M param bidirectional encoder | HuggingFace model card |
| Embedding dims | 1024 (MRL: 128–1024) | HuggingFace model card |
| Context | 32,768 tokens | HuggingFace model card |
| Input cost | **$0.004/M** (cheapest of everything) | OpenRouter |
| Output cost | $0 — it **does not generate text** | Perplexity Embeddings API docs |
| Quantization | Native INT8 & Binary | Perplexity blog |

**Key Benchmarks (all ✅ confirmed with sources):**

| Benchmark | Score | Notes |
|-----------|-------|-------|
| **MTEB Retrieval nDCG@10** | 68.6 | Confirmed on Mixpeek Model Hub |
| **Open-Weight Retrieval nDCG@10** | **69.8** | Competitive with larger models |
| **PPLX Query2Query Recall@10** | 71.1 | Perplexity internal metric |
| **BERGEN RAG** | Outperforms Qwen3-Embedding-0.6B on 3/5 tasks | Perplexity blog |

**⚠️ CRITICAL LIMITATION:** pplx-embed-v1-0.6b is **strictly an embeddings model**. It uses a bidirectional encoder architecture — not a decoder-only generative backbone. The API returns vector embeddings, not text. It **cannot** converse, write code, answer questions, generate documents, or produce any textual output. Source: HuggingFace model card ("Not a generative/chat model"), Perplexity Embeddings API docs, arXiv 2602.11151.

**Best for:** ✅ Semantic search indexing, RAG pipeline chunk embedding, document clustering, similarity comparisons, knowledge-base retrieval, large-scale deduplication.

**Verdict:** Only use when the explicit goal is **producing vector embeddings** for retrieval/search workloads. Not useful for any subagent task that requires conversational, coding, analytical, or generative capability.

## Application Guidance

### Required dispatch pattern
Every `task()` call **must** include the `model` parameter with the full path:

```python
# ✅ CORRECT
task(
    name="my-agent",
    description="Do specific thing",
    agent_type="task",
    model="4geeks/downtown-miami/openrouter/deepseek/deepseek-v4-flash",
    prompt="..."
)
```

```python
# ❌ WRONG — runtime default → 402 Quota Exceeded
task(
    name="my-agent",
    description="Do specific thing",
    agent_type="task",
    prompt="..."
)
```

```python
# ❌ WRONG — short alias resolves to non-4Geeks model → 402 Quota Exceeded
task(
    name="my-agent",
    description="Do specific thing",
    agent_type="task",
    model="gpt-6-luna",
    prompt="..."
)
```

### Quick decision flowchart

1. **Is the subagent producing code — generation, review, large refactors, or architecting?** → **`deepseek-v4-flash`** 🏆 (SWE-bench 79.0%, LiveCodeBench 91.6%, 384K output tokens)
2. **Is the subagent doing multi-step tool orchestration, terminal automation, or file-driven agentic loops?** → **`glm-5.3-flash`** 🏆 (Terminal-Bench 84.3, Toolathlon 78.4, near-Claude-Opus agentic performance)
3. **Is the subagent doing reasoning-heavy work, structured JSON output, or image understanding?** → **`gpt-6-luna`** 🏆 (GPQA Diamond 92.3%, cheapest standard pricing, image input, JSON mode)
4. **Is the subagent purely for vector embedding / semantic search?** → **`pplx-embed-v1-0.6b`** (MTEB 68.6 retrieval, $0.004/M, **not a generative model**)
5. **Anything else or unsure?** → **`deepseek-v4-flash`** (safe default — best all-round coding + longest output)

## Supporting References

### Empirical routing tests (Oct 2026)
- Verified that only full `4geeks/downtown-miami/...` paths succeed; no-param and short-alias both produce `402 Quota Exceeded` errors.

### DeepSeek-V4-Flash benchmarks
- SWE-bench Verified 79.0%: [zenmux.ai](https://zenmux.ai/blog/deepseek-v4-flash-benchmarks), [macaron.im](https://macaron.im/blog/deepseek-v4-benchmarks)
- LiveCodeBench 91.6%: [llm-stats.com](https://llm-stats.com/benchmarks/livecodebench)
- Terminal-Bench 2.1: [v4flash.com](https://v4flash.com/benchmarks/)
- GPQA Diamond 88.1%: [aireleasetracker.com](https://aireleasetracker.com/model/deepseek/deepseek-v4-flash)
- Pricing: [api-docs.deepseek.com](https://api-docs.deepseek.com/quick_start/pricing)
- Context 1M + 384K output: official DeepSeek model card

### GPT-6 Luna benchmarks
- GPQA Diamond 92.3%: [benchlm.ai](https://benchlm.ai/benchmarks/gpqa-diamond), [openrouter.ai](https://openrouter.ai/benchmarks/gpqa-diamond)
- Vibe Code Bench 81.7% + Terminal-Bench 2.1 73.0%: [Vals AI](https://www.vals.ai/models/openai_gpt-6-luna)
- Head-to-head vs DeepSeek on Vals AI: [vals.ai/comparisons](https://www.vals.ai/comparisons/deepseek_deepseek-v4.1-flash-vs-openai_gpt-6-luna)
- Pricing $0.10/$0.50: [OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- Context 1,050,000 tokens: [OpenAI API docs](https://developers.openai.com/api/docs/models/gpt-6-luna)
- Artificial Analysis Intelligence Index 38: [artificialanalysis.ai](https://artificialanalysis.ai/models/gpt-6-luna)

### GLM-5.3-Flash benchmarks
- Official model card + all benchmark scores: [HuggingFace](https://huggingface.co/zai-org/GLM-5.3-Flash)
- Terminal-Bench 2.1 (84.3), DeepSWE (63.4), Toolathlon (78.4): [z.ai/blog](https://z.ai/blog/glm-5.3-flash)
- MVBench #1 (0.778): [llm-stats.com](https://llm-stats.com/benchmarks/mvbench)
- Pricing $0.15/$0.50: [docs.z.ai](https://docs.z.ai/guides/overview/pricing)
- Artificial Analysis IQ 42: [artificialanalysis.ai](https://artificialanalysis.ai/models/glm-5.3-flash)
- Long-context 1M: official Z.AI documentation

### pplx-embed-v1-0.6b benchmarks
- HuggingFace model card (specs + non-generative confirmation): [HF](https://huggingface.co/perplexity-ai/pplx-embed-v1-0.6b)
- Perplexity blog (architecture + BERGEN): [perplexity.ai](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval)
- MTEB Retrieval 68.6: [mixpeek.com](https://mixpeek.com/model/perplexity-ai/pplx-embed-v1-0.6b)
- Open-Weight Retrieval 69.8: [aimultiple.com](https://aimultiple.com/open-source-embedding-models)
- Pricing $0.004/M: [OpenRouter](https://openrouter.ai/perplexity/pplx-embed-v1-0.6b)

### Cross-model comparisons
- DeepSeek-V4.1-Flash vs GPT-6 Luna head-to-head (Vals AI, LLM-Stats): [llm-stats.com/compare](https://llm-stats.com/models/compare/deepseek-v4.1-flash-vs-gpt-6-luna), [artificialanalysis.ai](https://artificialanalysis.ai/models/comparisons/gpt-6-luna-vs-deepseek-v4-1-flash)
- Automation Bench 1.0.6 (DeepSeek 69% vs Luna 53%): llm-stats.com/compare

### Tool references
- `task()` tool `model` parameter specification in the agent tool list.
- `.agents/rules/rule-18-single-natural-language.md` (prefer consistent terminology).