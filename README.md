# AI Risk-Based Code Review Router

Backend service for AI-powered code review with heuristic risk estimation, deterministic routing, and statistical analysis.
---
## 1. Research Goal

This project explores whether a lightweight heuristic risk model can be used to:
- Predict likelihood of meaningful AI review findings
- Reduce unnecessary LLM usage
- Optimize cost-performance tradeoff in automated code review
Core research question:
> Can a simple static heuristic meaningfully approximate AI-detected code issues?
---
## 2. System Architecture
Request flow:
Client → Route → Decision Engine → Risk Model → AI Service → Metrics → Stats
Layers:
- Routes — input validation and response handling
- Engine — strategy decision logic
- Services — AI integration and risk calculation
- Config — thresholds and heuristics
- Utils — scoring, hashing, statistics
- Metrics — persistent logging and analytics
---

## 3. Risk Model
The heuristic risk score ∈ [0,1] is computed from static code signals.
Configured in:
`src/config/risk-heuristics.ts`
### Factors
1. Code size (line count thresholds)
2. `any` usage frequency
3. TODO / FIXME markers
4. Missing test indicators
Each factor contributes weighted risk with upper caps.
Final risk score is normalized and capped at 1.0.

## 4. Strategy Routing
Decision is based on risk score:
risk < skip threshold → skip AI review
risk > full threshold → full model
otherwise → deterministic A/B routing

Routing is stable (non-random):
hashToUnit(code) ensures repeatable traffic splits.
This allows controlled experiments.

## 5. AI Review
The system supports:
Full model (gpt-4.1)
Mini model (gpt-4.1-mini)
Mock mode for deterministic testing
AI responses are validated via Zod schema before being accepted.
Invalid responses trigger controlled errors.

## 6. Metrics Collection
Each review logs:
requestId
riskScore
issuesCount
weightedIssueScore
strategy used
duration
mock flag
Stored as append-only JSON lines.

## 7. Statistical Analysis
Analytics endpoint computes:
7.1 Aggregates
Average risk score
Average issues detected
Average weighted severity
Strategy distribution
Duration by strategy

7.2 Buckets
Risk segmentation:
Low risk
Medium risk
High risk
Used to analyze model performance by segment.

## 7.3 Correlation Analysis
Pearson correlation is computed between:
Risk score ↔ Issue count
Risk score ↔ Weighted severity
Formula:
ρ(X,Y) = cov(X,Y) / (σX * σY)

Interpretation:
0.0 → no linear relationship
0.3–0.5 → moderate correlation
0.5 → strong correlation
Observed result (sample runs):
~0.48 correlation between heuristic risk and issue count.

This suggests predictive signal, but not full equivalence to AI semantic reasoning.

## 8. Research Findings
Heuristic model has measurable predictive value.
High-risk code statistically produces more AI-detected issues.
Weighted severity correlates similarly to raw issue count.
Deterministic routing enables stable experimentation.
Cost reduction is achievable without fully removing AI from low-risk segments.

## 9. Limitations
Heuristic model ignores semantic complexity.
Correlation does not imply causation.
Static signals cannot detect logical flaws.
Model quality depends on LLM consistency.

## 10. Experimental Extensions
Potential next research directions:
Cost-per-strategy analysis
Token usage tracking
Time-based risk drift
Dynamic threshold calibration
Logistic regression instead of linear correlation
Multi-model comparative evaluation

## 11. Running the Project
Install:
npm install
Run dev:
npm run dev
Run tests:
npm run test

## 12. Conclusion
This project demonstrates that:
Simple static heuristics can approximate AI review likelihood
Deterministic routing enables controlled cost optimization
Statistical instrumentation is essential for evaluating AI system design
**
The system is designed as a research backend for AI-assisted SDLC optimization.**
