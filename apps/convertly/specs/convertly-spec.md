# Convertly - Unit & Format Conversion Tools Specification

**Application:** Convertly
**Domain:** convertly.benmvp.com
**Purpose:** Unit and format conversion tools for everyone
**Status:** 🚧 **PLANNED** - Launch after Codemata Phase 10.4

---

## Table of Contents

1. [Overview](#overview)
2. [Why Convertly Next?](#why-convertly-next)
3. [Tool Categories](#tool-categories)
4. [Architecture & Patterns](#architecture--patterns)
5. [Implementation Plan](#implementation-plan)
6. [Theme Configuration](#theme-configuration)
7. [Future Tool Roadmap](#future-tool-roadmap)

---

## Overview

### Vision

Convertly provides fast, accurate conversion tools for a broad audience beyond developers. From cooking and travel to fitness and shopping, Convertly serves everyone who needs quick, bookmarkable conversions.

### Key Differentiators

**Broader Audience Than Codemata:**
- Not dev-specific - appeals to general population
- Mobile-first usage (cooking, shopping, travel)
- High-frequency, repeat usage patterns
- Lower competitive pressure (fewer quality conv apps)

**Not AI-Replaceable:**
- "Convert 375°F to C" in AI chat = slow
- Bookmarked converter = instant, one-click
- Perfect for mobile workflows (recipes, shopping)
- Voice assistants limited on mobile browsers

**High Traffic Potential:**
- Recipe Scaler: ⭐⭐⭐ **EXTREMELY HIGH TRAFFIC**
- Cooking Temperature: Broadly searched
- BMI Calculator: Massive health/fitness audience
- Clothing/Shoe Size: International shopping boom

### Architectural Note

**Calculations Run Client-Side**

Unlike Codemata (which runs transformations server-side for security), Convertly calculations are **pure math** and can run client-side to minimize Vercel compute costs:

```typescript
// Client-side conversion (no Server Action needed)
'use client'

function convertLength(value: number, from: string, to: string): number {
  // Pure math conversion - no security concerns
  const meters = value * UNITS[from].toMeters
  return meters / UNITS[to].toMeters
}
```

**Benefits:**
- ✅ Instant conversions (no network latency)
- ✅ Lower Vercel compute costs (no function invocations)
- ✅ Offline-capable (PWA)
- ✅ Simpler implementation

**When to use Server Actions:**
- External API calls (currency rates, timezone data)
- Complex calculations requiring external libraries
- Data validation/sanitization
- Storage/persistence operations

---

## Why Convertly Next?

### Strategic Rationale

1. **Fastest Path to Traffic Diversity**
   - Recipe Scaler alone has exceptional search volume
   - Cooking/measurement tools serve 100% of population
   - Validates "beyond developers" strategy

2. **Validates Monorepo Architecture**
   - Second app proves shared component strategy
   - Tests different audience/domain patterns
   - Builds confidence before Moni's accuracy demands

3. **Low Risk, High Reward**
   - Simple math operations (vs. financial calculations)
   - Fast to build (10-12 converters in 3-4 weeks)
   - Huge search volume for Recipe Scaler
   - Mobile usage patterns (different from Codemata)

4. **Not AI-Commoditized**
   - Converting units via AI chat = clunky
   - Dedicated converter = instant, bookmarkable
   - Mobile-first (AI chat less convenient on phones)

5. **Complements Codemata**
   - Builds benmvp.com brand across audiences
   - Cross-promotion opportunities
   - Shared infrastructure amortized

### Timing

Launch Convertly **after** completing Codemata Phase 10.4 (26 tools). This allows:
- Codemata to generate initial revenue
- Analytics data to guide future priorities
- Proven monorepo patterns to replicate

---

## Tool Categories

### 1. Cooking/Recipe (2 tools) - **ANCHOR CATEGORY**

| Tool Name                      | Traffic | Description                                    | Implementation              |
| ------------------------------ | ------- | ---------------------------------------------- | --------------------------- |
| **Recipe Scaler** ⭐⭐⭐       | EXTREME | Scale ingredients up/down for servings          | Smart fraction handling     |
| **Cooking Temperature Converter** | HIGH | C/F conversion with cooking context            | Static cooking temp reference (2KB JSON) |

### 2. Measurement (8 tools) - **CORE CATEGORY**

| Tool Name             | Description                                    |
| --------------------- | ---------------------------------------------- |
| Length Converter      | mm, cm, m, km, in, ft, yd, mi, nautical miles  |
| Weight/Mass Converter | mg, g, kg, oz, lb, tons (metric/US/UK)         |
| Volume Converter      | ml, l, tsp, tbsp, fl oz, cups, pints, quarts, gallons |
| Temperature Converter | Celsius, Fahrenheit, Kelvin                    |
| Area Converter        | sq m, sq ft, acres, hectares                   |
| Pressure Converter    | Pa, kPa, bar, psi, atm                         |
| Energy Converter      | Joules, calories, kW·h, BTU                    |
| Speed Converter       | m/s, km/h, mph, knots                          |

### 3. Time (2 tools)

| Tool Name            | Description                                    |
| -------------------- | ---------------------------------------------- |
| Time Zone Converter  | Convert times between time zones (`dayjs` with timezone plugin) |
| Time Unit Converter  | seconds, minutes, hours, days, weeks           |

### 4. Data/Computing (2 tools)

| Tool Name             | Description                                    |
| --------------------- | ---------------------------------------------- |
| Data Size Converter   | bit, byte, KB, MB, GB, TB, PB                  |
| Numeral System Converter | Decimal, binary, octal, hexadecimal         |

### 5. Health/Fitness (5 tools) - **HIGH TRAFFIC CATEGORY**

| Tool Name                    | Traffic  | Description                                    |
| ---------------------------- | -------- | ---------------------------------------------- |
| **BMI Calculator** ⭐         | EXTREME  | Body Mass Index with healthy weight range      |
| **BMR/TDEE Calculator** ⭐⭐  | VERY HIGH | Basal Metabolic Rate + Total Daily Energy Expenditure |
| Body Fat % Calculator        | HIGH     | Navy method, BMI method, visual estimation     |
| Macro Calculator             | MEDIUM   | Daily macronutrient targets (protein/carbs/fat) |
| Running Pace Converter       | MEDIUM   | min/mile ↔ min/km, race time projections      |

### 6. International/Travel (3 tools)

| Tool Name                  | Traffic | Description                                    |
| -------------------------- | ------- | ---------------------------------------------- |
| **Clothing Size Converter** ⭐ | HIGH | US/UK/EU/Asia clothing sizes (static JSON)    |
| **Shoe Size Converter**    | HIGH    | International shoe sizing (static JSON)        |
| Paper Size Converter       | LOW     | A0-A10, Letter, Legal dimensions               |

### 7. Energy/Power (2 tools)

| Tool Name                      | Traffic | Description                                    |
| ------------------------------ | ------- | ---------------------------------------------- |
| **Electricity Cost Calculator** ⭐ | HIGH | Device wattage → monthly cost                 |
| Solar Panel Output Calculator  | MEDIUM  | Estimate solar production & savings            |

### 8. Computing/Internet (3 tools)

| Tool Name                       | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| Bandwidth/Data Transfer Calculator | File transfer time estimates                |
| Screen Size/DPI Calculator      | PPI calculation, optimal viewing distance      |
| Video Bitrate Calculator        | Recommended bitrate by resolution/quality      |

### 9. Video/Photography (2 tools)

| Tool Name                           | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| Resolution/Aspect Ratio Calculator  | Calculate dimensions for aspect ratios         |
| Framerat to Shutter Speed Converter | 180° shutter rule for cinematography          |

### 10. Text (2 tools)

| Tool Name              | Description                                    |
| ---------------------- | ---------------------------------------------- |
| Morse Code Converter   | Text ↔ Morse code                              |
| Roman Numeral Converter | Arabic ↔ Roman numerals                       |

### 11. Other (1 tool)

| Tool Name             | Description                                    |
| --------------------- | ---------------------------------------------- |
| Child Height Predictor | Predict adult height from parental heights    |

---

## Architecture & Patterns

### Converter Pattern (Client-Side)

```typescript
// components/converters/LengthConverter.tsx
'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const LENGTH_UNITS = {
  m: { label: 'Meters', toMeters: 1 },
  cm: { label: 'Centimeters', toMeters: 0.01 },
  ft: { label: 'Feet', toMeters: 0.3048 },
  in: { label: 'Inches', toMeters: 0.0254 },
  // ... more units
}

export function LengthConverter() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')

  const convert = () => {
    if (!value) return ''
    const meters = parseFloat(value) * LENGTH_UNITS[fromUnit].toMeters
    return (meters / LENGTH_UNITS[toUnit].toMeters).toFixed(4)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>From</label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Select value={fromUnit} onValueChange={setFromUnit}>
          {Object.entries(LENGTH_UNITS).map(([key, unit]) => (
            <option key={key} value={key}>{unit.label}</option>
          ))}
        </Select>
      </div>

      <div>
        <label>To</label>
        <Input value={convert()} readOnly />
        <Select value={toUnit} onValueChange={setToUnit}>
          {Object.entries(LENGTH_UNITS).map(([key, unit]) => (
            <option key={key} value={key}>{unit.label}</option>
          ))}
        </Select>
      </div>
    </div>
  )
}
```

### Recipe Scaler Pattern

```typescript
// components/converters/RecipeScaler.tsx
'use client'

import { useState } from 'react'
import { parseIngredient, scaleIngredient } from '@/lib/recipe-utils'

export function RecipeScaler() {
  const [originalServings, setOriginalServings] = useState(4)
  const [targetServings, setTargetServings] = useState(6)
  const [ingredients, setIngredients] = useState<string[]>([
    '2 cups flour',
    '1/3 cup sugar',
    '1.5 tsp salt'
  ])

  const scale = (ingredient: string) => {
    const parsed = parseIngredient(ingredient) // Parse amount + unit + name
    const scaled = scaleIngredient(parsed, originalServings, targetServings)
    return formatIngredient(scaled) // Format with proper fractions
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Original Recipe ({originalServings} servings)</h3>
        {ingredients.map((ing, i) => (
          <div key={i}>{ing}</div>
        ))}
      </div>

      <div>
        <h3>Scaled Recipe ({targetServings} servings)</h3>
        {ingredients.map((ing, i) => (
          <div key={i}>{scale(ing)}</div>
        ))}
      </div>
    </div>
  )
}
```

### Tool Data Registry (Similar to Codemata)

```typescript
// lib/tools-data.ts
export const CONVERTER_TOOLS: Record<string, ConverterTool> = {
  "recipe-scaler": {
    id: "recipe-scaler",
    name: "Recipe Scaler",
    description: "Scale recipe ingredients for different serving sizes",
    url: "/recipe-scaler",
    icon: ChefHat,
    metadata: {
      title: "Recipe Scaler | Convertly",
      description: "Scale recipe ingredients up or down for any serving size...",
    },
  },
  "length-converter": {
    id: "length",
    name: "Length Converter",
    description: "Convert between metric and imperial length units",
    url: "/length-converter",
    icon: Ruler,
    metadata: {
title: "Length Converter | Convertly",
      description: "Convert between meters, feet, inches, and more...",
    },
  },
  // ... 30+ more converters
}

export const ALL_TOOLS: Record<ToolCategoryId, ToolCategory> = {
  cooking: {
    id: "cooking",
    label: "Cooking & Recipe",
    singular: "Cooking Tool",
    url: "/cooking",
    description: "Recipe scaling and cooking conversions",
    order: 1,
    tools: [
      CONVERTER_TOOLS["recipe-scaler"],
      CONVERTER_TOOLS["cooking-temperature"],
    ],
  },
  measurement: {
    id: "measurement",
    label: "Measurement",
    singular: "Measurement Converter",
    url: "/measurement",
    description: "Convert between metric and imperial units",
    order: 2,
    tools: [
      CONVERTER_TOOLS["length-converter"],
      CONVERTER_TOOLS["weight-converter"],
      // ... 6 more
    ],
  },
  // ... more categories
}
```

---

## Implementation Plan

### Phase 0: App Architecture Foundation

**Timeline:** 3-4 days
**Goal:** Set up empty Convertly app with complete navigation/search architecture

#### Tasks

**0.1 Create App from Codemata Template**

- [ ] Copy `apps/codemata/` structure to `apps/convertly/`
- [ ] Update `package.json` (name: "@repo/convertly", ports)
- [ ] Change theme to purple (`purple-600` → `purple-700`)
- [ ] Update all branding ("Convertly" wordmark, tagline: "Conversion Tools")
- [ ] Remove Codemata-specific code (formatters, minifiers, etc.)

**0.2 Create ONE Placeholder Converter**

- [ ] Create Temperature Converter (simplest: C/F/K)
- [ ] Validates entire data flow: tool registry → page → component
- [ ] Tests Server Action pattern (even though client-side)
- [ ] Example code in `lib/tools-data.ts`
- [ ] AI content generation working

**0.3 Setup Navigation Infrastructure**

- [ ] Home page with hero + single converter card
- [ ] Category page: `/measurement` with Temperature Converter
- [ ] Tool page: `/temperature-converter`
- [ ] Left sidebar navigation (desktop)
- [ ] Mobile navigation drawer
- [ ] Command menu (⌘K) with fuzzy search
- [ ] Recent converters tracking (localStorage)
- [ ] CategoryBackLink component

**0.4 Vercel Setup**

- [ ] Create Vercel project for Convertly
- [ ] Configure custom domain (convertly.benmvp.com)
- [ ] Set environment variables:
  - `GOOGLE_API_KEY` (Convertly-specific key)
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Convertly GA4 property)
  - `NEXT_PUBLIC_ADSENSE_ID` (Convertly AdSense account)
- [ ] Deploy to production
- [ ] Verify AI content generation works

**0.5 Testing Infrastructure**

- [ ] Unit test for Temperature Converter action
- [ ] E2E test config (Playwright on localhost:3335)
- [ ] Lighthouse config with Convertly URLs
- [ ] Metadata verification script
- [ ] All tests passing in CI

**Deliverable:** Working Convertly app with ONE converter, complete navigation, deployed to production. Ready to add 10+ converters in Phase 1. 🚀

**Why Phase 0?**
- Validates entire architecture before building many tools
- Tests Vercel deployment pipeline
- Proves AI content generation works
- Single converter exercises all code paths
- Foundation ready for rapid tool addition

---

### Phase 1: Recipe Scaler & Core Converters

**Timeline:** 3-4 weeks
**Goal:** Launch Convertly with Recipe Scaler anchor + 10-12 core converters

#### Phase 1.1: Foundation Converters (Week 1)

**Tasks:**
- [x] Create `apps/convertly/` from Codemata template
- [ ] Change theme to purple (`purple-600`)
- [ ] Adapt layout components (Header, Footer, Navigation)
- [ ] Update branding ("Convertly" wordmark, tagline)
- [ ] Set up Vercel project (convertly.benmvp.com)
- [ ] Build 3 simple converters (client-side):
  - [ ] Temperature Converter (C/F/K)
  - [ ] Length Converter (m, cm, ft, in, yd, mi)
  - [ ] Weight Converter (kg, g, lb, oz)
- [ ] Deploy to production (validates setup)

**Deliverable:** Convertly live with 3 working converters

#### Phase 1.2: Recipe Scaler Anchor (Week 2)

**Tasks:**
- [ ] Build Recipe Scaler component:
  - [ ] Ingredient parser (regex for amount + unit + name)
  - [ ] Fraction handler (1/3, 2/3, 1.5 → proper fractions)
  - [ ] Unit conversion (cups → tbsp when scaling down)
  - [ ] Bi-directional scaling UI (drag servings slider)
- [ ] Add example recipes (dropdown)
- [ ] Mobile optimization (vertical layout on small screens)
- [ ] Generate AI content for Recipe Scaler
- [ ] Create category page: `/cooking`
- [ ] Update home page hero copy

**Deliverable:** Recipe Scaler live - the traffic anchor 🎯

#### Phase 1.3: High-Traffic Converters (Week 3)

**Tasks:**
- [ ] **Cooking Temperature Converter** (with cooking context)
  - [ ] C/F conversion
  - [ ] Common cooking temp references (JSON: 350°F = moderate oven)
  - [ ] Optional: Food doneness temps (chicken, beef, etc.)
- [ ] **Volume Converter** (focus on cooking units)
  - [ ] ml, l, tsp, tbsp, fl oz, cups, pints, quarts, gallons
  - [ ] Metric ↔ Imperial
- [ ] **Data Size Converter**
  - [ ] bit, byte, KB, MB, GB, TB, PB
  - [ ] Binary (1024) vs Decimal (1000) toggle
- [ ] **Time Zone Converter**
  - [ ] Select source/target zones
  - [ ] Date/time picker
  - [ ] Live "current time" display
- [ ] **BMI Calculator** (health/fitness anchor)
  - [ ] Height (ft/in or cm) + Weight (lb or kg)
  - [ ] BMI result + category + healthy weight range
  - [ ] Visual BMI chart
- [ ] Generate AI content for all 5 tools
- [ ] Create category pages: `/measurement`, `/health`, `/time`, `/data`

**Deliverable:** 10 total converters (3 initial + Recipe Scaler + 5 high-traffic)

#### Phase 1.4: Polish & SEO (Week 4)

**Tasks:**
- [ ] SEO optimization:
  - [ ] Sitemap for all converters
  - [ ] robots.txt
  - [ ] Metadata for all pages (title, description, OG, Twitter)
  - [ ] Dynamic OG images (same pattern as Codemata)
  - [ ] JSON-LD structured data
- [ ] Command menu (⌘K) with converter search
- [ ] Recent converters tracking (localStorage)
- [ ] Mobile optimization:
  - [ ] Test on actual devices while cooking/shopping
  - [ ] Optimize touch targets
  - [ ] Reduce vertical padding
  - [ ] Test landscape mode
- [ ] Accessibility audit (WCAG AA)
- [ ] Cross-browser testing
- [ ] Lighthouse CI setup (same gates as Codemata)
- [ ] Analytics + AdSense integration
- [ ] Link prefetching

**Deliverable:** Production-ready Convertly with 10-12 converters 🚀

### Phase 2+: Expand Based on Analytics

After Phase 1 launch, monitor analytics for 2-4 weeks to identify:
- Which converters get most traffic
- Mobile vs desktop usage patterns
- Top search queries in command menu
- Bounce rates and dwell time

**Priority expansion:**
1. More health/fitness tools (if BMI performs well)
2. International shopping tools (clothing/shoe sizes)
3. Energy/power tools (electricity cost calculator)
4. More measurement converters

**Extract shared code only when painful:**
- If Convertly + Moni both need similar converter patterns
- If layout components truly diverge and cause maintenance pain
- Never preemptively - wait for real duplication issues

---

## Theme Configuration

```typescript
// apps/convertly/tailwind.config.ts
const colors = {
  primary: 'purple-600',   // #9333ea - Conversion/transformation
  hover: 'purple-700',     // #7e22ce
  light: 'purple-50',      // #faf5ff
  accent: 'violet-600',    // #7c3aed
}

// Site config
export const SITE_CONFIG = {
  name: 'Convertly',
  url: 'https://convertly.benmvp.com',
  tagline: 'Conversion Tools',
  description: 'Fast, accurate conversion tools for everyone. From recipes to fitness, travel to shopping.',
  // ...
}
```

---

## Future Tool Roadmap

Below is the comprehensive list of all planned Convertly tools. After Phase 1 (10-12 tools), prioritize based on analytics data.

### Cooking/Recipe (2 tools)

**Status:** 0/2 (Priority: Phase 1.2)

- [ ] **Recipe Scaler** ⭐⭐⭐ (EXTREMELY HIGH TRAFFIC) - Week 2
  - Scale ingredients for serving sizes
  - Smart fraction handling (1/3, 2/3, proper display)
  - Unit conversion (cups → tbsp when scaling down)
  - Example recipes dropdown
- [ ] **Cooking Temperature Converter** (HIGH TRAFFIC) - Week 3
  - Celsius/Fahrenheit conversion
  - Cooking context (350°F = moderate oven)
  - Optional: Food doneness temps

### Measurement (8 tools)

**Status:** 0/8 (Priority: Phase 1.1 + 1.3)

- [ ] **Length Converter** - Week 1 (Foundation)
  - mm, cm, m, km, in, ft, yd, mi, nautical miles
- [ ] **Weight Converter** - Week 1 (Foundation)
  - mg, g, kg, metric tons, oz, lb, US tons, UK tons
- [ ] **Volume Converter** - Week 3 (Cooking focus)
  - ml, l, cubic cm/m, tsp, tbsp, fl oz, cups, pints, quarts, gallons
- [ ] **Temperature Converter** - Week 1 (Foundation)
  - Celsius, Fahrenheit, Kelvin
- [ ] Area Converter - Phase 2+
  - sq cm, sq m, sq km, sq in, sq ft, sq yd, sq mi, acres, hectares
- [ ] Pressure Converter - Phase 2+
  - Pa, kPa, MPa, bars, atmospheres, psi, torrs
- [ ] Energy Converter - Phase 2+
  - Joules, kilojoules, calories, kilocalories, watt-hours, BTU
- [ ] Speed Converter - Phase 2+
  - m/s, km/h, mph, knots, ft/s

### Time (2 tools)

**Status:** 0/2

- [ ] **Time Zone Converter** - Week 3
  - Convert between time zones
  - Date/time picker
  - Live "current time" display
  - Uses `dayjs` with timezone plugin
- [ ] Time Unit Converter - Phase 2+
  - seconds, minutes, hours, days, weeks, months, years

### Data/Computing (2 tools)

**Status:** 0/2

- [ ] **Data Size Converter** - Week 3
  - bit, byte, KB, MB, GB, TB, PB
  - Binary (1024) vs Decimal (1000) toggle
- [ ] Numeral System Converter - Phase 2+
  - Decimal, binary, octal, hexadecimal

### Health/Fitness (5 tools)

**Status:** 0/5 (Priority: Phase 1.3 + Phase 2)

- [ ] **BMI Calculator** ⭐ (EXTREMELY HIGH TRAFFIC) - Week 3
  - Height + Weight → BMI
  - Category classification
  - Healthy weight range
  - Visual BMI chart
- [ ] **BMR/TDEE Calculator** ⭐⭐ (VERY HIGH TRAFFIC) - Phase 2
  - Basal Metabolic Rate + Total Daily Energy Expenditure
  - Calorie targets for weight loss/maintenance/gain
  - Mifflin-St Jeor formula
- [ ] Body Fat % Calculator - Phase 2+
  - Navy method, BMI method, visual estimation
  - Category classification by age/gender
- [ ] Macro Calculator - Phase 2+
  - Daily protein/carbs/fat targets
  - Based on weight, goal, activity level
- [ ] Running Pace Converter - Phase 2+
  - min/mile ↔ min/km
  - Race time projections (5K, 10K, half, full marathon)

### International/Travel (3 tools)

**Status:** 0/3 (Priority: Phase 2+)

- [ ] **Clothing Size Converter** ⭐ (HIGH TRAFFIC)
  - US/UK/EU/Asia sizes
  - By clothing type (shirts, pants, dresses, etc.)
  - Static JSON lookup (~5KB)
- [ ] **Shoe Size Converter** (HIGH TRAFFIC)
  - US/UK/EU/CM sizes
  - Men's/Women's/Kids
  - Static JSON lookup (~2KB)
- [ ] Paper Size Converter
  - A0-A10, Letter, Legal, Tabloid dimensions
  - Static JSON (~1KB)

### Energy/Power (2 tools)

**Status:** 0/2 (Priority: Phase 2+)

- [ ] **Electricity Cost Calculator** ⭐ (HIGH TRAFFIC)
  - Device wattage → daily/monthly/yearly cost
  - User provides electricity rate ($/kWh)
  - Comparison to common appliances
- [ ] Solar Panel Output Calculator
  - Panel wattage × number × sun hours → production
  - Estimated bill savings
  - ROI timeline (if system cost provided)

### Computing/Internet (3 tools)

**Status:** 0/3 (Priority: Phase 3+)

- [ ] Bandwidth/Data Transfer Calculator
  - File size + connection speed → transfer time
  - Data transferred per hour/day/month
- [ ] Screen Size/DPI Calculator
  - Screen size + resolution → PPI
  - Pixel pitch, optimal viewing distance
  - "Retina" display threshold
- [ ] Video Bitrate Calculator
  - Resolution + framerate + quality → recommended bitrate
  - File size estimates
  - Streaming bandwidth requirements

### Video/Photography (2 tools)

**Status:** 0/2 (Priority: Phase 3+)

- [ ] Resolution/Aspect Ratio Calculator
  - Known dimension + aspect ratio → matching dimension
  - Common resolutions for aspect ratio
- [ ] Framerate to Shutter Speed Converter
  - 180° shutter rule (shutter = 1/[fps×2])
  - Cinematically correct motion blur

### Text (2 tools)

**Status:** 0/2 (Priority: Phase 3+)

- [ ] Morse Code Converter
  - Text ↔ Morse code
  - Audio playback (optional)
- [ ] Roman Numeral Converter
  - Arabic ↔ Roman numerals
  - Validation

### Other (1 tool)

**Status:** 0/1 (Priority: Phase 3+)

- [ ] Child Height Predictor
  - Current height + parental heights → predicted adult height
  - Growth chart percentile
  - Mid-parental height method

---

## Summary

**Launch Strategy:** Build Convertly with Recipe Scaler as the traffic anchor, supported by 10-12 high-utility converters. Launch fast (3-4 weeks), monitor analytics, then expand based on data.

**Architecture:** Client-side calculations for simplicity and cost savings, AI-enhanced content for SEO, mobile-first UX, same quality gates as Codemata.

**Development Ports:**
- Dev server: `localhost:3003`
- Production build: `localhost:3335` (for E2E/Lighthouse testing)

**Timing:** After Codemata Phase 10.4 complete. Validate monorepo with non-dev audience before tackling Moni's financial accuracy requirements.

