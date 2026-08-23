# Moni - Financial Calculators & Planning Tools Specification

**Application:** Moni
**Domain:** moni.benmvp.com
**Purpose:** Personal finance calculators and planning tools
**Status:** 🔨 **IN DEVELOPMENT** - Phase 0 complete (1 calculator), deployment pending

---

## Table of Contents

1. [Overview](#overview)
2. [Why Moni Before Convertly?](#why-moni-before-convertly)
3. [Tool Categories](#tool-categories)
4. [Architecture & Patterns](#architecture--patterns)
5. [Implementation Considerations](#implementation-considerations)
6. [Theme Configuration](#theme-configuration)
7. [Future Tool Roadmap](#future-tool-roadmap)

---

## Overview

### Vision

Moni provides accurate, easy-to-use financial calculators for personal financial planning. From budgeting to investing, debt payoff to mortgage planning, Moni helps users make informed financial decisions.

### Key Differentiators

**Accessibility Focused:**
- Financial tools often hidden behind paywalls
- Complex spreadsheets intimidate users
- Moni = free, simple, mobile-friendly
- Visual results (charts, graphs, breakdowns)

**Not AI-Replaceable:**
- Financial calculations need precision, not approximation
- Users want to save/bookmark specific scenarios
- AI chats lack visualization (charts, amortization tables)
- Moni provides instant bookmarkable results

**High Intent Audience:**
- Users arrive with specific goals (payoff debt, save for house)
- High engagement (long dwell time, multiple scenarios)
- Strong monetization potential (financial product affiliate links)
- Repeat usage for financial planning

### Critical Considerations

**⚠️ Accuracy Requirements:**
Financial calculations must be **100% accurate**. Users make real financial decisions based on results. This requires:
- Thorough testing (edge cases, rounding, leap years, compound frequency)
- Review by financial literacy experts (or use battle-tested libraries)
- Clear disclaimers ("This is not financial advice")
- Optional: External validation against known calculators

**Legal Disclaimers:**
All financial calculators must include disclaimers:
- "This calculator provides estimates for educational purposes only"
- "Not financial, tax, or investment advice - consult a professional"
- "Results depend on assumptions that may not reflect reality"
- "Past performance does not guarantee future results" (for investment calc)

**Calculation Approach:**
Unlike Codemata, Moni calculations should run **client-side** for:
- ✅ Instant results (no network latency)
- ✅ Lower Vercel compute costs (complex math runs user's CPU)
- ✅ Privacy (financial inputs never leave user's device)
- ✅ Offline-capable (PWA)

---

## Why Moni Before Convertly?

### Strategic Rationale

1. **Higher ROI - Not Easily Google-able**
   - Financial calculations require context and precision
   - Can't be quickly answered by Google search alone
   - Users need interactive scenarios ("what if I pay $X extra?")
   - Compound interest, debt payoff, mortgage amortization = complex

2. **Stronger Monetization Potential**
   - Financial product affiliate links (credit cards, savings accounts, brokerages)
   - High commercial intent keywords
   - Users actively researching financial decisions
   - Better ad performance (financial services CPM)

3. **Higher Engagement**
   - Financial planning = longer dwell time
   - Users run multiple scenarios before deciding
   - Save/bookmark favorite calculators
   - Return monthly (budget tracking, mortgage planning)

4. **Convertly Tools More Commoditized**
   - Unit conversions easily answered by Google ("375F to C")
   - Voice assistants handle simple conversions
   - Lower differentiation value
   - Recipe Scaler is main unique value prop

5. **Shared Infrastructure Ready**
   - ✅ @repo/config, @repo/ai, @repo/shared all complete
   - Client-side calculator pattern works for both apps
   - Can validate with Moni first, then apply to Convertly

### Timing

Launch Moni **immediately after** Codemata Phase 10.4 (26 tools). This allows:
- Leverage completed shared package infrastructure
- Target high-value audience with financial intent
- Validate client-side calculator architecture
- Generate higher ROI before building commodity converters

---

## Tool Categories

### 1. Budgeting & Expense Tracking (2 tools)

| Tool Name                  | Traffic | Description                                    |
| -------------------------- | ------- | ---------------------------------------------- |
| **50/30/20 Budget Calculator** ⭐⭐ | VERY HIGH | Calculate budget based on after-tax income   |
| Expense Tracker            | HIGH    | Track monthly expenses by category             |

### 2. Savings & Investing (8 tools) - **CORE CATEGORY**

| Tool Name                          | Status | Traffic | Description                                    |
| ---------------------------------- | ------ | ------- | ---------------------------------------------- |
| **Simple Interest Calculator** | ✅ | HIGH | Calculate simple interest on investments (Phase 0 test tool) |
| **Compound Interest Calculator** ⭐⭐⭐ | 📋 | EXTREME | Visualize growth with compound interest       |
| Savings Goal Calculator            | 📋 | HIGH    | How much to save monthly to reach goal         |
| Investment Return Calculator       | 📋 | HIGH    | Calculate ROI on investments                   |
| Retirement Savings Calculator      | 📋 | HIGH    | How much to save for retirement                |
| Emergency Fund Calculator          | 📋 | MEDIUM  | Calculate ideal emergency fund size            |
| **Fire Calculator** ⭐              | 📋 | HIGH    | Financial Independence Retire Early calculator |
| Dollar Cost Averaging Calculator   | 📋 | MEDIUM  | Show DCA benefits vs lump sum                  |

### 3. Debt Management (5 tools) - **HIGH INTENT CATEGORY**

| Tool Name                          | Traffic  | Description                                    |
| ---------------------------------- | -------- | ---------------------------------------------- |
| **Debt Payoff Calculator** ⭐⭐⭐   | EXTREME  | Snowball/Avalanche payoff strategies          |
| Credit Card Payoff Calculator      | VERY HIGH | Time to payoff with minimum vs extra payments |
| **Loan Amortization Calculator** ⭐⭐ | VERY HIGH | Monthly breakdown of principal/interest      |
| Loan Comparison Calculator         | HIGH     | Compare multiple loan offers side-by-side      |
| Debt Consolidation Calculator      | MEDIUM   | Compare consolidation vs current payments      |

### 4. Real Estate & Mortgages (6 tools)

| Tool Name                          | Traffic | Description                                    |
| ---------------------------------- | ------- | ---------------------------------------------- |
| **Mortgage Calculator** ⭐⭐⭐       | EXTREME | Monthly payment with PMI, taxes, insurance     |
| **Rent vs Buy Calculator** ⭐⭐     | VERY HIGH | Compare renting vs buying over time          |
| House Affordability Calculator     | HIGH    | Max house price based on income/debt           |
| Mortgage Refinance Calculator      | HIGH    | Should you refinance? Break-even analysis      |
| Extra Payment Calculator           | MEDIUM  | Time/interest saved by extra mortgage payments |
| Cap Rate Calculator                | LOW     | Investment property cash-on-cash return        |

### 5. Taxes (3 tools)

| Tool Name                       | Traffic | Description                                    |
| ------------------------------- | ------- | ---------------------------------------------- |
| **Income Tax Calculator** ⭐     | HIGH    | Estimate federal + state tax owed              |
| Self-Employment Tax Calculator  | MEDIUM  | Quarterly estimated taxes for freelancers      |
| Tax Bracket Calculator          | MEDIUM  | Marginal vs effective tax rate                 |

### 6. Insurance (1 tool)

| Tool Name                      | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| Life Insurance Needs Calculator | How much life insurance do you need?          |

### 7. Lump Sum Decisions (3 tools)

| Tool Name                          | Description                                    |
| ---------------------------------- | ---------------------------------------------- |
| Lottery/Inheritance Decision Calculator | Lump sum vs annuity comparison            |
| College Savings (529) Calculator   | Save for college with tax-advantaged growth    |
| Student Loan Payoff vs Invest Calculator | Should you pay off loans or invest?      |

### 8. Other Financial Tools (4 tools)

| Tool Name                       | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| Net Worth Calculator            | Assets - Liabilities = Net Worth               |
| Inflation Calculator            | Future value adjusted for inflation            |
| Hourly vs Salary Converter      | Annual salary ↔ hourly wage                    |
| Tip Calculator                  | Calculate tip and split bills                  |

---

## Architecture & Patterns

### Calculator Pattern (Client-Side with Validation)

```typescript
// components/calculators/CompoundInterestCalculator.tsx
'use client'

import { useState } from 'react'
import { calculateCompoundInterest } from '@/lib/calculations/compound-interest'
import { LineChart } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('10')
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('yearly')

  // Client-side calculation
  const result = calculateCompoundInterest({
    principal: parseFloat(principal),
    rate: parseFloat(rate) / 100,
    years: parseInt(years),
    frequency: frequency === 'monthly' ? 12 : 1,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div>
        <label>Initial Investment</label>
        <Input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          prefix="$"
        />

        <label>Annual Interest Rate</label>
        <Input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          suffix="%"
        />

        <label>Time Period</label>
        <Input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          suffix="years"
        />

        <label>Compounding Frequency</label>
        <Select value={frequency} onValueChange={setFrequency}>
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
        </Select>
      </div>

      {/* Results Panel */}
      <div>
        <h3>Results</h3>
        <div className="bg-green-50 p-4 rounded">
          <div className="text-sm text-gray-600">Final Value</div>
          <div className="text-3xl font-bold text-green-600">
            ${result.finalValue.toLocaleString()}
          </div>
        </div>

        <div className="mt-4">
          <div>Principal: ${parseFloat(principal).toLocaleString()}</div>
          <div>Total Interest Earned: ${result.totalInterest.toLocaleString()}</div>
        </div>

        {/* Growth Chart */}
        <LineChart
          data={result.yearlyBreakdown}
          xKey="year"
          yKey="balance"
          title="Balance Over Time"
        />
      </div>
    </div>
  )
}
```

### Calculation Library (Pure Functions)

```typescript
// lib/calculations/compound-interest.ts

interface CompoundInterestInput {
  principal: number
  rate: number // Annual rate as decimal (0.07 = 7%)
  years: number
  frequency: number // 1 = yearly, 12 = monthly
  contribution?: number // Optional monthly contribution
}

interface CompoundInterestResult {
  finalValue: number
  totalInterest: number
  totalContributions: number
  yearlyBreakdown: Array<{
    year: number
    balance: number
    interestEarned: number
  }>
}

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const { principal, rate, years, frequency, contribution = 0 } = input
  const periodsPerYear = frequency
  const totalPeriods = years * periodsPerYear
  const ratePerPeriod = rate / periodsPerYear

  let balance = principal
  let totalContributions = 0
  const yearlyBreakdown: Array<any> = []

  for (let period = 1; period <= totalPeriods; period++) {
    // Apply interest
    balance = balance * (1 + ratePerPeriod)

    // Add contribution (if any)
    if (contribution > 0) {
      balance += contribution
      totalContributions += contribution
    }

    // Record yearly snapshot
    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear
      yearlyBreakdown.push({
        year,
        balance: Math.round(balance * 100) / 100,
        interestEarned: Math.round((balance - principal - totalContributions) * 100) / 100,
      })
    }
  }

  return {
    finalValue: Math.round(balance * 100) / 100,
    totalInterest: Math.round((balance - principal - totalContributions) * 100) / 100,
    totalContributions,
    yearlyBreakdown,
  }
}
```

### Debt Payoff Calculator (Snowball/Avalanche)

```typescript
// lib/calculations/debt-payoff.ts

interface Debt {
  name: string
  balance: number
  apr: number // Annual percentage rate as decimal
  minPayment: number
}

interface PayoffStrategy {
  debts: Debt[]
  extraPayment: number
  method: 'snowball' | 'avalanche' // Smallest balance first vs highest APR first
}

export function calculateDebtPayoff(strategy: PayoffStrategy) {
  const { debts, extraPayment, method } = strategy

  // Sort debts by strategy
  const sorted = [...debts].sort((a, b) => {
    if (method === 'snowball') return a.balance - b.balance
    return b.apr - a.apr
  })

  let month = 0
  let totalInterestPaid = 0
  const timeline: Array<{
    month: number
    debts: Array<{ name: string; balance: number }>
  }> = []

  while (sorted.some(d => d.balance > 0)) {
    month++
    let availableExtra = extraPayment

    sorted.forEach((debt, i) => {
      if (debt.balance <= 0) return

      // Calculate interest for this month
      const monthlyRate = debt.apr / 12
      const interest = debt.balance * monthlyRate
      totalInterestPaid += interest

      // Apply minimum payment
      let payment = debt.minPayment

      // Apply extra payment to first non-paid-off debt
      if (i === sorted.findIndex(d => d.balance > 0)) {
        payment += availableExtra
        availableExtra = 0
      }

      // Update balance
      debt.balance = Math.max(0, debt.balance + interest - payment)

      // If paid off, snowball the min payment
      if (debt.balance === 0) {
        availableExtra += debt.minPayment
      }
    })

    timeline.push({
      month,
      debts: sorted.map(d => ({
        name: d.name,
        balance: Math.round(d.balance * 100) / 100,
      })),
    })
  }

  return {
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    timeline,
  }
}
```

### Tool Data Registry

```typescript
// lib/tools-data.ts
export const CALCULATOR_TOOLS: Record<string, CalculatorTool> = {
  "compound-interest-calculator": {
    id: "compound-interest",
    name: "Compound Interest Calculator",
    description: "Calculate investment growth with compound interest",
    url: "/compound-interest-calculator",
    icon: TrendingUp,
    metadata: {
      title: "Compound Interest Calculator | Moni",
      description: "Calculate how your investments grow with compound interest...",
    },
  },
  "debt-payoff-calculator": {
    id: "debt-payoff",
    name: "Debt Payoff Calculator",
    description: "Compare snowball vs avalanche debt payoff strategies",
    url: "/debt-payoff-calculator",
    icon: CreditCard,
    metadata: {
      title: "Debt Payoff Calculator | Moni",
      description: "Create a debt payoff plan with snowball or avalanche method...",
    },
  },
  // ... 30+ more calculators
}

export const ALL_TOOLS: Record<ToolCategoryId, ToolCategory> = {
  savings: {
    id: "savings",
    label: "Savings & Investing",
    singular: "Savings Calculator",
    url: "/savings",
    description: "Plan your savings and investment goals",
    order: 1,
    tools: [
      CALCULATOR_TOOLS["compound-interest-calculator"],
      CALCULATOR_TOOLS["savings-goal-calculator"],
      // ... more
    ],
  },
  debt: {
    id: "debt",
    label: "Debt Management",
    singular: "Debt Calculator",
    url: "/debt",
    description: "Manage and pay off debt effectively",
    order: 2,
    tools: [
      CALCULATOR_TOOLS["debt-payoff-calculator"],
      CALCULATOR_TOOLS["loan-amortization-calculator"],
      // ... more
    ],
  },
  // ... more categories
}
```

---

## Implementation Considerations

### Phase 0: App Architecture Foundation

**Status:** � **IN PROGRESS** - Core app complete, deployment pending

**Timeline:** 3-4 days (Started Feb 18, 2026)
**Goal:** Set up empty Moni app with complete navigation/search architecture

**Prerequisites:**
- ✅ @repo/config package ready (TypeScript, Biome, Vitest configs)
- ✅ @repo/ai package ready (AI content generation)
- ✅ @repo/shared package ready (shared types/utils + formatCurrency/formatPercentage)
- ✅ @repo/ui package ready (common components + Button/Badge primitives)
- ✅ Codemata Phase 10.4 complete (26 tools live)

#### Tasks

**0.1 Create App from Codemata Template**

- [x] Copy `apps/codemata/` structure to `apps/moni/`
- [x] Update `package.json` (name: "@repo/moni", ports: 3002 dev, 3334 prod)
- [x] Extend @repo/config (biome.json, tsconfig.json, vitest.config.ts)
- [x] Change theme to green (`#16A34A` green-600, `#22C55E` green-500 dark mode)
- [x] Update all branding ($ dollar sign wordmark/logos, "Moni - Financial Calculators")
- [x] Remove Codemata-specific code (formatters, minifiers, etc.)
- [x] Add global FinancialDisclaimer component

**0.2 Create ONE Placeholder Calculator**

- [x] Create Simple Interest Calculator (simplest: principal × rate × time)
- [x] Validates entire data flow: tool registry → page → component
- [x] Tests client-side calculation pattern (useMemo for performance)
- [x] Example code in `lib/tools-data.ts` (category-driven architecture)
- [x] AI content generation working (via @repo/ai with calculator prompts)
- [x] Financial disclaimer component visible

**0.3 Setup Navigation Infrastructure**

- [x] Home page with hero + single calculator card
- [x] Category page: `/savings-investing` with Simple Interest
- [x] Tool page: `/savings-investing/simple-interest-calculator`
- [x] Left sidebar navigation (desktop, centered $ wordmark)
- [x] Mobile navigation drawer
- [x] Command menu (⌘K) with fuzzy search
- [x] Recent calculators tracking (localStorage via @repo/shared)
- [x] CategoryBackLink component (moved to @repo/ui, positioned above h1)
- [x] Global FinancialDisclaimer component

**0.4 Vercel Setup**

- [ ] Create Vercel project for Moni
- [ ] Configure custom domain (moni.benmvp.com)
- [ ] Set environment variables:
  - `GOOGLE_API_KEY` (Moni-specific key or shared with tracking)
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Moni GA4 property)
  - `NEXT_PUBLIC_ADSENSE_ID` (Moni AdSense account)
- [ ] Deploy to production
- [ ] Verify AI content generation works
- [ ] Verify financial disclaimer appears globally

**0.5 Testing Infrastructure**

- [ ] Unit test for Simple Interest calculation (validate against known formula)
- [ ] E2E test config (Playwright on localhost:3334)
- [ ] Lighthouse config with Moni URLs
- [ ] Metadata verification script
- [ ] All tests passing in CI

**Deliverable:** Working Moni app with ONE calculator, complete navigation, financial disclaimers, deployed to production. Ready to add 10+ calculators in Phase 1. 🚀

**Completed Extras (Beyond Spec):**
- [x] Moved Button & Badge primitives to @repo/ui (shared across apps)
- [x] Added formatCurrency() & formatPercentage() utilities to @repo/shared
- [x] Fixed infinite loop bug in SimpleInterestCalculator (useMemo pattern)
- [x] Optimized responsive padding (`py-3 lg:py-8` for mobile)
- [x] Constrained input widths (`max-w-md` on medium+ screens)
- [x] Logo spacing improvements (140×52 viewBox, proper $ symbol extension)
- [x] Empty categories filtered from navigation
- [x] All tool pages refactored (CategoryBackLink before h1, removed CSS order tricks)

**Why Phase 0?**
- Validates entire architecture before building tools
- Tests financial disclaimer integration globally
- Proves AI content generation works for financial context
- Single calculator exercises all code paths
- Foundation ready for high-accuracy calculators

---

### Phase 1: Core Calculators & Analytics

**Status:** 🚧 **PLANNED** - After Phase 0 deployment

**Timeline:** 1-2 weeks
**Goal:** Add 5-7 high-traffic calculators + GA4 event tracking

#### Tasks

**1.1 GA4 Event Tracking Setup**

- [ ] **Create event taxonomy for Moni**
  - Calculator events: `calculator_loaded`, `calculation_performed`, `input_changed`
  - Navigation events: `calculator_search`, `category_viewed`
  - Custom dimensions: `calculator_type`, `input_principal`, `input_rate`, `time_period`
- [ ] **Implement tracking in Simple Interest Calculator**
  - Track page views with calculator metadata
  - Track calculation completions
  - Track input interactions (debounced)
- [ ] **Add GA4 tracking to Codemata as well**
  - Tool events: `tool_loaded`, `format_action`, `minify_action`, `copy_result`
  - Transform events: `code_formatted`, `code_minified`, `code_encoded`
  - Custom dimensions: `tool_type`, `language`, `indentation`, `action_type`
- [ ] **Set up conversion goals in GA4**
  - Primary: Calculation completed
  - Secondary: Multiple calculators used in session
  - Engagement: Time on calculator > 30s
- [ ] **Document event schema in both READMEs**
  - Event naming conventions
  - Required/optional parameters
  - Custom dimension taxonomy
  - Privacy considerations (no PII in events)

**1.2 Add High-Traffic Calculators**

- [ ] **Compound Interest Calculator** ⭐⭐⭐ (with recharts visualization)
  - Initial investment + monthly contributions
  - Compounding frequency (monthly, yearly)
  - Line chart showing growth over time
  - Yearly breakdown table
- [ ] **Debt Payoff Calculator** ⭐⭐⭐ (snowball/avalanche comparison)
  - Multiple debts with balance/APR/minPayment
  - Snowball vs Avalanche strategy comparison
  - Timeline visualization
  - Total interest saved calculation
- [ ] **Mortgage Calculator** ⭐⭐⭐ (PITI breakdown)
  - Principal, Interest, Taxes, Insurance
  - PMI calculation (< 20% down payment)
  - Amortization schedule
  - Extra payment simulator
- [ ] **50/30/20 Budget Calculator** ⭐⭐ (pie chart visualization)
  - After-tax income input
  - Automatic 50/30/20 split
  - Pie chart breakdown
  - Detailed category recommendations
- [ ] **Loan Amortization Calculator** ⭐⭐ (amortization table)
  - Month-by-month principal/interest breakdown
  - Total interest paid
  - Downloadable schedule (CSV)
  - Extra payment impact

**1.3 Chart Library Integration**

- [ ] Install recharts + shadcn/ui chart components
- [ ] Create reusable chart components:
  - `<LineChart />` for investment growth
  - `<PieChart />` for budget breakdown
  - `<AmortizationTable />` for loan schedules
  - `<StackedAreaChart />` for debt payoff timeline
- [ ] Add responsive chart behaviors (mobile-friendly scaling)
- [ ] Test chart accessibility:
  - Keyboard navigation
  - ARIA labels for data points
  - Screen reader announcements
  - Color contrast (WCAG AA compliant)

**1.4 Testing & Documentation**

- [ ] Unit tests for new calculators (100% coverage)
- [ ] E2E tests for chart interactions
- [ ] Lighthouse scores > 95 for all pages
- [ ] Update README with Phase 1 completion status
- [ ] Document GA4 events in analytics guide

**Deliverable:** Moni with 6 calculators, full GA4 tracking, data visualizations, and matching analytics for Codemata. Ready for Phase 2 (advanced calculators).

---

### Accuracy & Testing

**Unit Test Every Calculation:**
```typescript
// __tests__/compound-interest.test.ts
import { calculateCompoundInterest } from '../lib/calculations/compound-interest'

describe('Compound Interest Calculator', () => {
  it('calculates simple yearly compound interest', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 0.05,
      years: 5,
      frequency: 1,
    })
    // 10000 * (1.05)^5 = 12762.82
    expect(result.finalValue).toBeCloseTo(12762.82, 2)
  })

  it('calculates monthly compound interest', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 0.05,
      years: 5,
      frequency: 12,
    })
    // More frequent compounding = higher return
    expect(result.finalValue).toBeGreaterThan(12762.82)
    expect(result.finalValue).toBeCloseTo(12833.59, 2)
  })

  it('includes monthly contributions', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      rate: 0.07,
      years: 10,
      frequency: 12,
      contribution: 500,
    })
    expect(result.totalContributions).toBe(500 * 12 * 10) // 60000
    expect(result.finalValue).toBeGreaterThan(10000 + 60000)
  })
})
```

**Validate Against Known Calculators:**
- Test results match established calculators (Bankrate, NerdWallet, etc.)
- Document expected rounding behavior
- Edge case testing (0%, negative numbers, large values)

### Legal Disclaimers (Global Component)

```typescript
// components/FinancialDisclaimer.tsx
export function FinancialDisclaimer() {
  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
      <h4 className="font-semibold text-yellow-900 mb-2">
        ⚠️ Important Disclaimer
      </h4>
      <p>
        This calculator provides estimates for <strong>educational purposes only</strong>.
        Results are based on assumptions and may not reflect real-world conditions.
        This is <strong>not financial, tax, or investment advice</strong>.
        Consult a qualified financial professional before making financial decisions.
      </p>
    </div>
  )
}

// Use in every calculator page:
<FinancialDisclaimer />
```

### Chart & Visualization Libraries

Moni needs more visualizations than Codemata/Convertly:
- **recharts** (recommended): React charts built on D3
- **shadcn/ui charts**: Built on Recharts, styled to match
- Amortization tables (custom table component)
- Pie charts (budget breakdown)
- Line charts (investment growth)
- Stacked area charts (debt payoff timeline)

```typescript
// Example: Investment growth chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

<LineChart data={result.yearlyBreakdown} width={600} height={300}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
  <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
  <Legend />
  <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} />
</LineChart>
```

### Input Validation

Financial calculators need robust validation:
- Minimum/maximum values (APR 0-100%, years 1-50, etc.)
- Decimal precision (2 decimal places for currency)
- Prevent negative values where inappropriate
- Real-time feedback ("Interest rate seems high - did you mean 7% instead of 70%?")

```typescript
// lib/validation.ts
export function validateAPR(apr: number): string | null {
  if (apr < 0) return "Interest rate cannot be negative"
  if (apr > 1) return "Interest rate should be between 0-100% (did you mean decimal format?)"
  if (apr > 0.5) return "Interest rate seems unusually high (>50%) - please verify"
  return null
}
```

---

## Theme Configuration

```typescript
// apps/moni/tailwind.config.ts
const colors = {
  primary: 'green-600',   // #16a34a - Financial growth/money
  hover: 'green-700',     // #15803d
  light: 'green-50',      // #f0fdf4
  accent: 'emerald-600',  // #059669
}

// Site config
export const SITE_CONFIG = {
  name: 'Moni',
  url: 'https://moni.benmvp.com',
  tagline: 'Financial Calculators',
  description: 'Free financial calculators and planning tools. Make informed decisions about budgeting, investing, debt, and more.',
  // ...
}
```

---

## Future Tool Roadmap

Below is the comprehensive list of all planned Moni tools. Prioritize based on analytics after Convertly launch.

### Budgeting & Expense Tracking (2 tools)

**Status:** 0/2

- [ ] **50/30/20 Budget Calculator** ⭐⭐ (VERY HIGH TRAFFIC)
  - 50% needs, 30% wants, 20% savings/debt
  - Based on after-tax income
  - Visual pie chart breakdown
- [ ] Expense Tracker
  - Track monthly expenses by category
  - Compare to budget targets
  - Spending trends over time

### Savings & Investing (8 tools)

**Status:** 1/8 (Priority: High) - Simple Interest Calculator ✅ Complete

- [x] **Simple Interest Calculator** (HIGH TRAFFIC) ✅
  - Calculate interest on principal × rate × time
  - Real-time validation with error handling
  - Currency & percentage formatting
  - Client-side calculation (useMemo pattern)
  - Financial disclaimer integration
  - AI content generation working
  - **Deployed:** Phase 0 test calculator
- [ ] **Compound Interest Calculator** ⭐⭐⭐ (EXTREMELY HIGH TRAFFIC)
  - Initial investment + periodic contributions
  - Monthly/yearly compounding
  - Visual growth chart
  - Detailed yearly breakdown
- [ ] Savings Goal Calculator
  - "I want $X by [date], how much to save monthly?"
  - Accounts for interest earned
  - Progress tracker
- [ ] Investment Return Calculator
  - Calculate ROI (% gain/loss)
  - Annualized return
  - Compare multiple investments
- [ ] Retirement Savings Calculator
  - Current age → retirement age
  - Current savings + monthly contributions
  - Expected return rate
  - "Will I have enough?"
- [ ] Emergency Fund Calculator
  - 3-6 months of expenses (conservative/moderate/aggressive)
  - Based on monthly expenses input
- [ ] **FIRE Calculator** ⭐ (HIGH TRAFFIC)
  - Financial Independence Retire Early
  - 25x annual expenses rule
  - Safe withdrawal rate (4% rule)
  - Years to FIRE based on savings rate
- [ ] Dollar Cost Averaging Calculator
  - Show smoothing effect vs lump sum
  - Historical backtesting with S&P 500
  - Visualization of buy-in prices over time

### Debt Management (5 tools)

**Status:** 0/5 (Priority: Very High)

- [ ] **Debt Payoff Calculator** ⭐⭐⭐ (EXTREMELY HIGH TRAFFIC)
  - Snowball method (smallest balance first)
  - Avalanche method (highest APR first)
  - Side-by-side comparison
  - Timeline visualization
  - Total interest saved
- [ ] Credit Card Payoff Calculator
  - Minimum payment vs extra payment comparison
  - Time to payoff
  - Total interest paid
  - Credit utilization impact
- [ ] **Loan Amortization Calculator** ⭐⭐ (VERY HIGH TRAFFIC)
  - Month-by-month principal/interest breakdown
  - Total interest paid over life of loan
  - Downloadable amortization schedule
  - Extra payment impact
- [ ] Loan Comparison Calculator
  - Side-by-side comparison (2-4 loans)
  - Total cost comparison
  - Monthly payment differences
  - APR vs total interest paid
- [ ] Debt Consolidation Calculator
  - Current debts vs consolidation loan
  - Monthly payment comparison
  - Total interest comparison
  - Break-even analysis

### Real Estate & Mortgages (6 tools)

**Status:** 0/6 (Priority: High)

- [ ] **Mortgage Calculator** ⭐⭐⭐ (EXTREMELY HIGH TRAFFIC)
  - Home price, down payment, APR, term
  - Monthly payment (PITI: Principal, Interest, Taxes, Insurance)
  - PMI calculation (if down payment < 20%)
  - Amortization schedule
  - Extra payment simulator
- [ ] **Rent vs Buy Calculator** ⭐⭐ (VERY HIGH TRAFFIC)
  - Monthly rent vs mortgage payment
  - Include: maintenance, HOA, property tax, insurance, opportunity cost
  - Break-even timeline
  - Net worth comparison over time
- [ ] House Affordability Calculator
  - Income + debts → max house price
  - 28/36 rule (housing/total debt ratios)
  - Down payment impact
  - "You can afford $X house"
- [ ] Mortgage Refinance Calculator
  - Current loan vs new loan
  - Break-even timeline (closing costs vs monthly savings)
  - Total interest comparison
  - "Should you refinance?"
- [ ] Extra Payment Calculator
  - Extra monthly/yearly payments
  - Payoff time saved
  - Interest saved
  - Equity building acceleration
- [ ] Cap Rate Calculator
  - Investment property analysis
  - Annual NOI / Purchase price
  - Cash-on-cash return
  - Rental yield comparison

### Taxes (3 tools)

**Status:** 0/3

- [ ] **Income Tax Calculator** ⭐ (HIGH TRAFFIC)
  - Federal + state tax estimate
  - Standard vs itemized deduction
  - Tax bracket visualization
  - Take-home pay estimate
- [ ] Self-Employment Tax Calculator
  - Quarterly estimated taxes
  - SE tax (Social Security + Medicare)
  - Deductions (home office, mileage, etc.)
  - "Set aside $X per month"
- [ ] Tax Bracket Calculator
  - Marginal vs effective tax rate
  - Visual bracket chart
  - "What if I earn $X more?"

### Insurance (1 tool)

**Status:** 0/1

- [ ] Life Insurance Needs Calculator
  - 10x income rule vs detailed calculation
  - Debts, funeral costs, income replacement
  - Children's education
  - Spouse's retirement
  - "You need $X in coverage"

### Lump Sum Decisions (3 tools)

**Status:** 0/3

- [ ] Lottery/Inheritance Decision Calculator
  - Lump sum vs annuity
  - Present value comparison
  - Tax implications
  - Investment growth assumptions
- [ ] College Savings (529) Calculator
  - Future education cost estimate
  - Monthly contribution needed
  - Tax advantages
  - Growth projection
- [ ] Student Loan Payoff vs Invest Calculator
  - Pay off loans aggressively vs minimum + invest difference
  - Interest rates comparison
  - Total wealth outcome
  - Risk/psychological factors

### Other Financial Tools (4 tools)

**Status:** 0/4

- [ ] Net Worth Calculator
  - Assets (cash, investments, property, etc.)
  - Liabilities (mortgage, loans, credit cards)
  - Net worth = Assets - Liabilities
  - Track over time
- [ ] Inflation Calculator
  - Future value adjusted for inflation
  - Historical inflation data
  - "You need $X in [year] to match $Y today"
- [ ] Hourly vs Salary Converter
  - Annual salary → hourly wage
  - Account for hours/week, weeks/year
  - Before/after tax
- [ ] Tip Calculator
  - Bill amount + tip % → tip amount + total
  - Split bill between N people
  - Round up/down option

---

## Summary

**Current Status (Feb 2026):** Phase 0 complete (except deployment). Moni has 1 working calculator with full infrastructure.

**Launch Strategy (UPDATED):** Launching Moni BEFORE Convertly (reversed from original plan). Simple Interest Calculator validates client-side calculation patterns, AI content generation, and financial accuracy requirements. Monorepo infrastructure proven with Codemata (26 tools). Ready for Phase 1 (5-7 more calculators + GA4 tracking).

**Architecture:** Client-side calculations for privacy and cost savings, extensive testing for financial accuracy, chart visualizations for engagement, legal disclaimers on all pages.

**Development Ports:**
- Dev server: `localhost:3002` ✅ Running
- Production build: `localhost:3334` (for E2E/Lighthouse testing)

**Completed Infrastructure:**
- ✅ Category-driven tool registry (same pattern as Codemata)
- ✅ Complete navigation (sidebar, mobile drawer, command menu ⌘K)
- ✅ Shared packages (@repo/ai, @repo/shared, @repo/ui with Button/Badge)
- ✅ $ Dollar sign branding (wordmark, logos, favicons, OG images)
- ✅ Simple Interest Calculator with validation & formatting
- ✅ Financial disclaimer component
- ✅ AI content generation for financial context
- ✅ Responsive design (mobile-first, constrained inputs)

**Next Steps:**
1. Resolve open issues (logo colors, commit 150 files)
2. Deploy to Vercel (moni.benmvp.com)
3. Add testing infrastructure (Phase 0.5)
4. Phase 1: Add 5-7 high-traffic calculators + GA4 tracking

**Legal/Accuracy:** Every calculator includes disclaimers ("not financial advice"), tested against known calculators, reviewed for accuracy. This is **critical** - users make real financial decisions based on results.

