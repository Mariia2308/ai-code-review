AI SDLC Assistant

Simple backend prototype exploring how AI can be used in the software development lifecycle, especially for code review.

The main idea is to test whether a lightweight risk model can predict when AI review is actually needed.

What this project does

Accepts code via API

Calculates a structural risk score

Runs code review:

Deterministic mode (mock / rule-based)

LLM mode (OpenAI)

Logs metrics for each request

Provides analytics (correlation, averages, latency)

Uses risk-based routing to decide whether to call AI

Risk Model

The risk score is based on:

Code size

Usage of any

TODO / FIXME comments

Missing unit tests

Risk score range: 0 – 1

Based on the score:

< 0.2 → Skip AI

0.2 – 0.6 → Mini AI review

> 0.6 → Full AI review

Research Goal

To evaluate:

How well structural risk correlates with detected issues

Whether heuristic risk can act as a pre-filter for AI

The tradeoff between latency, cost, and review quality

Deterministic Baseline

Initial experiments showed weak correlation between risk score and detected issues.

After tuning the heuristic and expanding the dataset (n=55):

Pearson correlation ≈ 0.48

Moderate alignment between risk score and issue count

Weighted severity correlation also moderate

This indicates partial predictive value without artificial alignment.

LLM Integration

The system integrates OpenAI (gpt-4.1-mini) for real AI-based review:

Strict JSON output

Schema validation with Zod

Severity-based scoring

This allows comparison between:

Heuristic predictions

Deterministic rules

LLM semantic analysis

Metrics Collected

Total reviews

Average risk

Average issues

Weighted issue score

Pearson correlation (risk ↔ issues)

Strategy breakdown (skip / mini / full)

Average latency

Tech Stack

TypeScript

Express

Zod

OpenAI API

Custom logging + statistical evaluation

Next Steps

Multi-model comparison

Cost-per-review analysis

GitHub / CI integration

Heuristic calibration using real PR data