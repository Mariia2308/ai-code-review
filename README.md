commit 1
In deterministic baseline evaluation, risk score did not strongly correlate with detected issues count, indicating that heuristic alignment requires tuning.

commit 2
After decoupling heuristic risk scoring from deterministic issue generation and expanding the dataset (n=55), Pearson correlation stabilized at r ≈ 0.48, indicating moderate predictive alignment between structural risk estimation and detected quality issues.

# AI SDLC Assistant

## Overview
Research-driven prototype exploring AI impact on Software Development Lifecycle.

## Features
- AI Code Review (deterministic + LLM mode)
- Risk Scoring Model
- Metrics Logging with request correlation
- Analytics Endpoint
- Dataset Evaluation Layer

## Architecture
- Express backend
- Service layer separation
- Zod validation
- Correlated request logging
- Deterministic baseline before LLM integration

## Research Focus
Evaluating:
- Risk score vs detected issues correlation
- Performance impact of AI-assisted review
- Deterministic vs LLM comparison

## Current Results (Mock Baseline)
- Total Reviews: 34
- Average Risk: 0.426
- Average Issues: 1.147

## Next Steps
- LLM integration comparison
- Advanced statistical correlation
- GitHub workflow integration