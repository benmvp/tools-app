# TODO

## Dev Tools (codemata.bemvp.com)

Examples

- https://www.devtoolbox.co/
- https://www.freeformatter.com/

### Formatters

- [x] CSS/SCSS (`scss` parser)
- [x] GraphQL (`graphql` parser)
- [x] HTML (`html` parser)
- [x] JS/TS (`typescript` parser)
- [x] JSON (`json`)
- [x] Markdown/MDX (`mdx` parser)
- [x] XML (`@prettier/plugin-xml` plugin)
- [x] YAML (`yaml` parser)
- [ ] SQL (`sql-formatter`) - HIGH TRAFFIC

### Minifiers

- [x] HTML (`html-minifier-terser`)
- [x] CSS/SCSS (`clean-css`)
- [x] JS/TS (`terser` for JS, `typescript` for TS compilation)
- [x] XML (`minify-xml`)
- [x] JSON (`JSON.stringify(JSON.parse(input), null, 0)`)
- [x] SVG

### Encoders/Decoders (NEXT PRIORITY)

- [ ] JWT Decoder (`jsonwebtoken`) - HIGH TRAFFIC
- [ ] Base64 Encoder/Decoder (Browser: `btoa()`, `atob()`. Node.js: `Buffer`)
- [ ] URL Encoder/Decoder (Browser: `encodeURIComponent()`, `decodeURIComponent()`, `encodeURI()`, `decodeURI()`)
- [ ] HTML Entity Encoder/Decoder (`he`, `html-entities`)
- [ ] JS String Encoder/Decoder (Custom implementation for escaping/unescaping strings)

### Checkers/Validators (HIGH PRIORITY)

- [x] JSON (`JSON.parse()` for basic validation, `ajv` for schema validation) - HIGH VALUE ✅
- [x] HTML (`html-validate`) ✅
- [x] CSS (`css-tree` for strict syntax validation) ✅
- [x] XML (`fast-xml-parser` for well-formedness validation) ✅
- [ ] Regex Tester (Potentially a library for visual representation of matches) - HIGH TRAFFIC
- [ ] Favicon (Fetch favicon using a Server Action, parse HTML for `<link rel="icon">`, check image format, size, etc.)
- [ ] SEO (Libraries/APIs for analyzing meta tags, etc.)
- [ ] SMO (Libraries/APIs for analyzing Open Graph tags, Twitter Card tags, etc.)
- [ ] A11Y (`axe-core`)
- [ ] Robots.txt (Fetch and parse `robots.txt`, potentially offer basic validation)
- [ ] .htaccess (Fetch and parse `.htaccess`, potentially offer basic validation)
- [ ] OpenAPI/Swagger Validator (`swagger-parser` or `@apidevtools/swagger-parser`)
- [ ] Package.json Validator (`package-json-validator` or custom checks)
- [ ] Semver Calculator (`semver` - compare versions, calculate ranges)

### Generators

- [ ] Hash (MD5, SHA) (Node.js: `crypto` module)
- [ ] Lorem Ipsum (Use an existing npm package for generating Lorem Ipsum text)
- [ ] UUID (`uuid`)
- [ ] Meta Tag (Create a form to input data and generate meta tags for SEO and social media)
- [ ] Random Number (Browser: `Math.random()`. Consider options for ranges and integer/decimal)
- [ ] Password Generator (Implement strong password generation logic with customizable options)
- [ ] QR Code Generator (`qrcode`, `node-qrcode`)
- [ ] QR Code Reader (`jsqr`)
- [ ] Fake Data Generator (`@faker-js/faker` for names, emails, addresses, phones, etc.) - HIGH VALUE
- [ ] JSON Schema to Sample Data (`json-schema-faker`)
- [ ] README Badge Generator (Build shields.io URLs with form inputs)
- [ ] Regex Generator (Natural language → regex using AI) - EXTREMELY HIGH VALUE
- [ ] SQL Query Generator (Natural language → SQL using AI) - HIGH TRAFFIC
- [ ] Code Documentation Generator (AI generates JSDoc/docstrings from code)

### Converters

- [ ] Hexadecimal/Base Converter (Binary, Octal, Decimal, Hexadecimal)
  - **Description:** Convert numbers between different bases (binary, octal, decimal, hexadecimal)
  - **Inputs:** Number in any base, source base, target base
  - **Outputs:** Converted number in target base(s), visual representation for binary
  - **Why useful:** Low-level programming, debugging, color codes, bitwise operations
  - **Libraries:** Browser native `parseInt(value, base)` and `Number.prototype.toString(base)`
- [ ] Color Format Converter (`chroma-js`, `color.js`) - HIGH TRAFFIC
  - **Description:** Convert colors between HEX, RGB, HSL, HSV, CMYK formats with live preview
  - **Inputs:** Color in any format (HEX, RGB, HSL, HSV, CMYK)
  - **Outputs:** All other formats, color preview swatch
  - **Why useful:** Essential for developers and designers working across different color systems
- [ ] Font Size Converter (px, em, rem, pt)
  - **Description:** Convert font sizes between different CSS units
  - **Inputs:** Size in one unit, base font size (for relative units)
  - **Outputs:** Equivalent sizes in all other units
  - **Why useful:** CSS developers constantly need to convert between units
- [ ] Epoch Timestamp <-> Date (Browser: `Date` object)
- [ ] Unit (px <-> em, kb <-> MB, etc.) (Define supported units and conversion factors)
- [ ] XML <-> JSON (`xml2js`, `js2xmlparser`)
- [ ] CSV <-> JSON (`papaparse`)
- [ ] YAML <-> JSON (`js-yaml`)
- [ ] HTML <-> Markdown (`turndown` for HTML→MD, `marked` for MD→HTML) - HIGH TRAFFIC
- [ ] SVG to Data URI (URL encode + data URI prefix)
- [ ] Image to Data URI/Base64 (File to base64 with data URI scheme)
- [ ] CRON Expression Generator/Parser (`cron-parser`, `cronstrue`) - VERY HIGH TRAFFIC

### Text

- [ ] Case Converter (camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, etc.)
- [ ] Text Analyzer (Calculate word count, character count, sentence count, etc.)
- [ ] String Reverser (Implement a function to reverse strings)
- [ ] Line sort & deduplication
- [ ] String Diff/Comparison (Character/word diff with `diff` library and visual highlighting)
- [ ] JSONPath Tester (`jsonpath-plus` for querying JSON)
- [ ] XPath Tester (Native XPath or `xpath` package for XML/HTML queries)
- [ ] ASCII Art Generator (`figlet` library)

### Viewers

- [ ] SVG Viewer (`svgo`, potentially a dedicated SVG rendering library)
- [ ] View Page Source (Fetch source using a Server Action, display with syntax highlighting potentially `prismjs` or `highlight.js`)
- [ ] Google Fonts Previewer (Google Fonts API)
- [ ] Diff (`diff`, `diff2html`)
- [ ] Markdown Previewer (`marked`, `markdown-it`)

### Colors

- [ ] Color Converter (`chroma-js`, `color.js`)
- [ ] Blend Transparent Colors (`chroma-js`, `color.js`)
- [ ] Find Complementary Colors (`chroma-js`, `color.js`)
- [ ] Create Website Color Scheme (`chroma-js`, `color.js`, potentially a color scheme generation API)
- [ ] CSS Gradient Generator (Potentially use a library to help with generating gradient strings)

### Network

- [ ] IP Address Lookup (Use a Server Action and potentially a third-party API, e.g., `ip-api.com`)
- [ ] Whois Lookup (Use a Server Action and potentially a third-party API)
- [ ] DNS Lookup (Use a Server Action and potentially a third-party API)

### Other

- [ ] Character/Word Count (Implement basic counting logic)
- [ ] Unicode Character Lookup (Requires a database of Unicode characters or an API)
- [ ] Date/Time Difference Calculator (`date-fns`, `dayjs`)
- [ ] Diff Tool (`diff` for generating diffs & `diff2html` for visualization)
- [ ] API Tester (`axios` or `fetch` for making requests)
  - **Description:** A tool for making HTTP requests and inspecting responses.
  - **Inputs:** URL, HTTP method (GET, POST, PUT, DELETE, etc.), headers, request body.
  - **Outputs:** Response status code, headers, response body (formatted nicely for JSON, XML, etc.).
  - **UI:** Input fields for URL, method, headers, and body; a way to organize and save common requests; clear display of response details.

### AI Meta Tools (HIGH SEO POTENTIAL - Tools ABOUT AI)

**⚠️ Cost Warning:** These tools execute AI requests from the client (not just build-time content generation). Implement careful rate limiting, caching, and usage monitoring to control API costs.

- [ ] **Prompt Optimizer** (Improve AI prompts for better results) - ⭐ FLAGSHIP TOOL
  - **Description:** Optimize prompts for AI models to get better results
  - **Inputs:** Original prompt, target model (GPT, Claude, Gemini, etc.), use case
  - **Outputs:** Improved prompt with explanation, before/after comparison, tips
  - **Implementation:** Gemini API with prompt engineering best practices
  - **Why it's great:** This is ABOUT AI, not just using AI
  - **Cost mitigation:** Rate limit per user, cache common optimizations

- [ ] **AI Token Counter & Cost Calculator**
  - **Description:** Count tokens and calculate costs for various AI APIs
  - **Inputs:** Text/prompt, model selection (GPT-4, Claude, Gemini, etc.)
  - **Outputs:** Token count, estimated cost, context window usage
  - **Implementation:** Use tokenizer libraries (tiktoken for GPT, etc.) + pricing tables
  - **Why it's great:** Essential tool for anyone working with AI APIs
  - **Cost mitigation:** Pure client-side calculation, no API calls needed!

- [ ] **Prompt Template Library** (Educational)
  - **Description:** Browse and use proven prompt templates for common tasks
  - **Inputs:** Task category (writing, coding, analysis, etc.)
  - **Outputs:** Curated prompt templates with placeholders, usage examples
  - **Implementation:** Curated database of effective prompts, variable substitution
  - **Why it's great:** Helps people learn prompt engineering patterns
  - **Cost mitigation:** Static content, no AI calls needed

- [ ] **Context Window Optimizer**
  - **Description:** Help fit more content into AI context windows
  - **Inputs:** Long text/document, target model's context limit
  - **Outputs:** Optimized/compressed version, summarization, chunking strategy
  - **Implementation:** Smart summarization + chunking algorithms (may use AI for summarization)
  - **Why it's great:** Solves real problem with context limits
  - **Cost mitigation:** Rate limit, offer client-side chunking without summarization
  - **Inputs:** Task description, desired output format
  - **Outputs:** Set of example input/output pairs for few-shot learning
  - **Implementation:** AI-generated examples following best practices
  - **Why it's great:** Few-shot prompting is powerful but hard to do right

- [ ] **Code Explainer** (AI explains code snippets) - VERY HIGH VALUE
  - **Description:** Paste code and get plain English explanation
  - **Inputs:** Code snippet, programming language
  - **Outputs:** Plain English explanation, key concepts, potential issues
  - **Implementation:** Gemini API with code analysis prompt

- [ ] **Code Explainer** (AI explains code snippets) - VERY HIGH VALUE
  - **Description:** Paste code and get plain English explanation
  - **Inputs:** Code snippet, programming language
  - **Outputs:** Plain English explanation, key concepts, potential issues
  - **Implementation:** Gemini API with code analysis prompt
  - **Cost mitigation:** Rate limit per user, limit snippet size, cache common patterns

- [ ] **Code Review Assistant** (AI suggests improvements)
  - **Description:** Get AI feedback on code quality, bugs, best practices
  - **Inputs:** Code snippet
  - **Outputs:** Suggestions for improvement, potential bugs, best practices
  - **Implementation:** Gemini API with code review prompt
  - **Cost mitigation:** Rate limit per user, limit snippet size

## Financial Tools (moni.benmvp.com)

### Budgeting & Planning

- [ ] **50/30/20 Budget Calculator**
  - **Description:** Apply the popular 50/30/20 budgeting rule to monthly income
  - **Inputs:** Monthly take-home income
  - **Outputs:** Recommended amounts for needs (50%), wants (30%), savings (20%), visual breakdown
  - **Why useful:** Popular budgeting rule, helps people start budgeting without complex tracking
  - **Data:** User provides all inputs. Moni maintains only the 50/30/20 formula.
- [ ] **Emergency Fund Calculator**
  - **Description:** Determine recommended emergency fund size and savings plan
  - **Inputs:** Monthly expenses, number of dependents, job stability (dropdown: stable/moderate/unstable)
  - **Outputs:** Recommended emergency fund size (3-6 months based on stability), savings timeline, monthly contribution needed
  - **Why useful:** Financial security is top priority, very searchable topic
  - **Data:** User provides all inputs. Moni maintains rules for fund size based on job stability (3-6 months).
- [ ] **Paycheck Budget Allocator**
  - **Description:** Budget per-paycheck for people paid weekly or bi-weekly
  - **Inputs:** Paycheck amount, pay frequency (weekly/bi-weekly/monthly), list of fixed expenses with due dates
  - **Outputs:** Per-paycheck allocation plan, which expenses to pay from which check, leftover discretionary income
  - **Why useful:** Helps people budget when paid more frequently than monthly
  - **Data:** User provides all inputs. Moni maintains allocation logic.

### Savings & Investing

- [ ] **Savings Goal Calculator**
  - **Description:** Calculate how much to save monthly or annually to reach a savings goal.
  - **Inputs:** Savings goal amount, current savings, interest rate, time horizon (in months or years).
  - **Outputs:** Required monthly/annual savings, total amount saved, total interest earned.
  - **UI:** Input fields for each input, slider to adjust the time horizon or savings amount, clear display of outputs.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Compound Interest Calculator**
  - **Description:** Calculate the future value of an investment with compound interest.
  - **Inputs:** Principal amount, annual interest rate, compounding frequency (e.g., daily, monthly, annually), time period (in years).
  - **Outputs:** Future value of the investment, total interest earned.
  - **UI:** Input fields for each input, potentially a chart showing the investment growth over time.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Investment Return Calculator (ROI)**
  - **Description:** Calculate the return on investment (ROI).
  - **Inputs:** Initial investment amount, final value of the investment.
  - **Outputs:** ROI (as a percentage), total profit/loss.
  - **UI:** Simple input fields, clear result display.
  - **Libraries:** None needed.
- [ ] **Retirement Calculator**
  - **Description:** Estimate retirement savings and whether it's enough to meet a desired retirement income.
  - **Inputs:** Current age, retirement age, current retirement savings, monthly contributions, estimated annual rate of return, desired annual retirement income.
  - **Outputs:** Estimated retirement savings at retirement age, estimated annual income from savings, shortfall or surplus compared to desired income.
  - **UI:** Input fields for each input, sliders to adjust retirement age and monthly contributions, clear display of outputs, potentially a chart showing the projected savings growth.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **401(k) / IRA Contribution Calculator**
  - **Description:** Estimate the growth of 401(k) or IRA balance over time, taking into account employer match (if applicable).
  - **Inputs:** Current annual income, employee contribution percentage, employer match percentage and limit, annual rate of return, current balance, years until retirement.
  - **Outputs:** Estimated future balance of the 401(k)/IRA, total employee contributions, total employer contributions, total interest earned.
  - **UI:** Input fields for each input, clear display of outputs, potentially a chart showing the projected growth.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Stock/Investment Growth Calculator**
  - **Description:** Calculate the potential growth of investments over time, including regular contributions.
  - **Inputs:** Initial investment amount, monthly contribution amount, expected annual rate of return, investment period (in years).
  - **Outputs:** Estimated future value of the investment, total amount invested, total interest earned.
  - **UI:** Input fields for each input, clear display of outputs, potentially a chart showing the projected growth.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Rule of 72 Calculator**
  - **Description:** Quickly estimate how long it takes for an investment to double at a given interest rate.
  - **Inputs:** Annual interest rate.
  - **Outputs:** Approximate number of years to double the investment.
  - **UI:** Simple input field for the interest rate, clear display of the result.
  - **Libraries:** None needed.
- [ ] **Investment Fee Calculator**
  - **Description:** Calculate the impact of investment fees on returns over time.
  - **Inputs:** Initial investment amount, monthly contribution, expected annual rate of return, annual fee percentage, investment period (in years).
  - **Outputs:** Estimated future value with fees, estimated future value without fees, total fees paid, the difference in value.
  - **UI:** Input fields for each input, clear display of outputs, potentially a chart comparing growth with and without fees.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Time Value of Money Calculator**
  - **Description:** Solve for present value, future value, payment, interest rate, or number of periods.
  - **Inputs:** Four of the five variables: present value (PV), future value (FV), payment (PMT), interest rate (I/YR), number of periods (N). The user will select which variable to solve for.
  - **Outputs:** The calculated value of the unknown variable.
  - **UI:** Input fields for four variables, a dropdown to select which variable to solve for, and clear display of the result.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Investment Fee Calculator**
  - **Description:** Calculate the impact of investment fees on returns over time.
  - **Inputs:** Initial investment amount, monthly contribution, expected annual rate of return, annual fee percentage, investment period (in years).
  - **Outputs:** Estimated future value with fees, estimated future value without fees, total fees paid, the difference in value.
  - **UI:** Input fields for each input, clear display of outputs, potentially a chart comparing growth with and without fees.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Time Value of Money Calculator**
  - **Description:** Solve for present value, future value, payment, interest rate, or number of periods.
  - **Inputs:** Four of the five variables: present value (PV), future value (FV), payment (PMT), interest rate (I/YR), number of periods (N). The user will select which variable to solve for.
  - **Outputs:** The calculated value of the unknown variable.
  - **UI:** Input fields for four variables, a dropdown to select which variable to solve for, and clear display of the result.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **FIRE Calculator (Financial Independence, Retire Early)** ⭐⭐ - HIGH TRAFFIC
  - **Description:** Calculate when you can achieve financial independence and retire early
  - **Inputs:** Current age, current savings, annual expenses, annual savings rate, expected investment return rate
  - **Outputs:** FIRE number (25x annual expenses), years until FIRE, coast FIRE age (when you can stop contributing), projected retirement date
  - **Why useful:** FIRE movement is HUGE, massive search traffic, high engagement
  - **Data:** User provides all inputs. Moni maintains the 25x rule and calculation formulas.
- [ ] **Social Security Benefits Estimator**
  - **Description:** Estimate Social Security benefits at different claiming ages
  - **Inputs:** Birth year, estimated average indexed monthly earnings (or use simplified annual income input), claiming age (slider 62-70)
  - **Outputs:** Estimated monthly benefit at different claiming ages (62, full retirement age, 70), lifetime benefit comparison
  - **Why useful:** Everyone needs this, government site is confusing
  - **Data:** User provides earnings data. Moni maintains benefit calculation formulas and full retirement age by birth year (static, rarely changes).

### Debt Management

- [ ] **Balance Transfer Savings Calculator**
  - **Description:** Calculate savings from transferring credit card balance to a lower-rate card
  - **Inputs:** Current credit card balance, current APR, transfer card APR, balance transfer fee (%), payoff timeline (months)
  - **Outputs:** Total interest saved, break-even point (months), month-by-month payment comparison
  - **Why useful:** Credit card debt is massive search topic, helps make balance transfer decisions
  - **Data:** User provides all inputs. Moni maintains calculation formulas.
- [ ] **Student Loan vs Extra Mortgage Payment Calculator**
  - **Description:** Determine whether to pay extra on student loans or mortgage
  - **Inputs:** Student loan balance/rate/term, mortgage balance/rate/term, extra payment amount available
  - **Outputs:** 10-year comparison of each strategy, total interest saved, recommendation based on rates and tax implications
  - **Why useful:** Common financial dilemma, helps optimize debt payoff strategy
  - **Data:** User provides all inputs. Moni maintains comparison algorithms.
- [ ] **Credit Card/Student Loan Minimum Payment Calculator**
  - **Description:** Calculate minimum payment, interest paid, and payoff time, with a slider to adjust monthly payments.
  - **Inputs:** Loan balance, annual interest rate, minimum payment percentage (and/or fixed amount).
  - **Outputs:** Minimum monthly payment, total interest paid, payoff date.
  - **UI:** Input fields for loan details, a slider to adjust the monthly payment amount, clear display of outputs, and potentially an amortization table.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision. `date-fns` or `dayjs` might be useful for date calculations.
- [ ] **Loan/Mortgage Pre-payment Calculator**
  - **Description:** Calculate the impact of extra payments on the loan payoff date, time saved, and interest saved.
  - **Inputs:** Original loan amount, annual interest rate, loan term (in months), monthly payment, extra payment amount (either a single extra payment or a recurring monthly extra payment).
  - **Outputs:** New payoff date, time saved (in years/months), total interest saved, potentially an updated amortization schedule.
  - **UI:** Accordion-style UI to guide the user through the input process, input fields for loan details, a slider to adjust the extra payment amount, and clear display of outputs.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision. `date-fns` or `dayjs` might be useful for date calculations.
  - **Flow:**
    1.  **Initial Loan Details:** User enters the original loan amount, interest rate, and loan term. The system calculates and displays the original amortization schedule (optional).
    2.  **Extra Payment Type:** User selects whether they want to make a single extra payment or recurring monthly extra payments.
    3.  **Extra Payment Amount:** User enters the extra payment amount (or uses a slider to adjust it).
    4.  **Results:** The system recalculates the amortization schedule and displays the new payoff date, time saved, and total interest saved.
- [ ] **Should I Refinance? Calculator**
  - **Description:** Compare current loan with a refinance offer, showing interest paid, monthly payments, and break-even point.
  - **Inputs:** Current loan balance, current interest rate, current remaining term (in months), new loan amount, new interest rate, new loan term (in months), estimated closing costs for refinancing.
  - **Outputs:** Total interest paid on the current loan, total interest paid on the new loan, difference in monthly payments, break-even point (in months).
  - **UI:** Input fields for current and new loan details, sliders to adjust new loan rate or term, clear comparison of interest paid, monthly payments, and loan terms, potentially a recommendation on whether to refinance.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision. `date-fns` or `dayjs` might be useful for date calculations.
- [ ] **Simple Mortgage Calculator**
  - **Description:** Calculate monthly mortgage payment (principal and interest).
  - **Inputs:** Loan amount, annual interest rate, loan term (in years).
  - **Outputs:** Monthly mortgage payment (principal and interest).
  - **UI:** Input fields for loan details, clear display of the monthly payment, potentially an amortization table.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision.
- [ ] **Paying Loan Bi-Weekly Calculator**
  - **Description:** Compare monthly vs. bi-weekly payments, showing time and interest saved.
  - **Inputs:** Loan amount, annual interest rate, loan term (in months).
  - **Outputs:** Bi-weekly payment amount, new payoff date, time saved, total interest saved.
  - **UI:** Input fields for loan details, clear comparison between monthly and bi-weekly payment scenarios.
  - **Libraries:** None needed for basic calculations. Consider `decimal.js` or `bignumber.js` for higher precision. `date-fns` or `dayjs` might be useful for date calculations.
- [ ] **Debt Snowball Calculator**
  - **Description:** Help users create a plan to pay off multiple debts using the debt snowball method (smallest balance first).
  - **Inputs:** List of debts with their balances, interest rates, and minimum payments.
  - **Outputs:** A debt payoff schedule showing the order of debts to be paid off and the estimated payoff date for each debt.
  - **UI:** Input fields for each debt, a table displaying the debt payoff schedule.
  - **Libraries:** None needed for basic calculations.
- [ ] **Debt Avalanche Calculator**
  - **Description:** Help users create a plan to pay off multiple debts using the debt avalanche method (highest interest rate first).
  - **Inputs:** List of debts with their balances, interest rates, and minimum payments.
  - **Outputs:** A debt payoff schedule showing the order of debts to be paid off and the estimated payoff date for each debt.
  - **UI:** Input fields for each debt, a table displaying the debt payoff schedule.
  - **Libraries:** None needed for basic calculations.

### Real Estate

- [ ] **Rent vs Buy Calculator** ⭐ - EXTREMELY HIGH TRAFFIC
  - **Description:** Compare the total cost of renting vs buying a home over time
  - **Inputs:** Home price, down payment, mortgage rate, loan term, monthly rent, years planning to stay, property tax rate, maintenance (% of home value), HOA fees, home appreciation rate, investment return rate (for down payment alternative)
  - **Outputs:** Total cost of renting vs buying over time period, break-even year, equity built, monthly cost comparison, recommendation
  - **Why useful:** HUGE search volume, major financial decision, helps people make informed housing choices
  - **Data:** User provides all inputs (prices, rates, etc.). Moni maintains calculation formulas only.
- [ ] **House Flipping Calculator**
  - **Description:** Calculate potential profit and ROI for house flipping investment
  - **Inputs:** Purchase price, renovation budget, holding time (months), expected selling price, buying closing costs, selling closing costs (%), holding costs (utilities, taxes, insurance), financing costs
  - **Outputs:** Total invested, gross profit, net profit after all costs, ROI percentage, annualized return (IRR), break-even selling price
  - **Why useful:** Real estate investing is popular, helps investors evaluate flip deals
  - **Data:** User provides all inputs. Moni maintains calculation formulas.
- [ ] **Mortgage Comparison Tool**
  - **Description:** Compare 2-3 different mortgage offers side-by-side
  - **Inputs:** For each loan: Amount, interest rate, term (years), points paid, closing costs, monthly PMI (if applicable)
  - **Outputs:** Side-by-side comparison table, total cost over life of loan, monthly payment differences, break-even point for points, recommendation
  - **Why useful:** Shopping for mortgages is stressful, this simplifies comparison across multiple offers
  - **Data:** User provides all loan offer details. Moni maintains comparison logic.
- [ ] **Property Tax Estimator**
  - **Description:** Estimate annual property tax and monthly escrow amount
  - **Inputs:** Home value (or purchase price), state, county (optional), property tax rate (user can provide or use state average)
  - **Outputs:** Estimated annual property tax, monthly escrow amount, comparison to state/county averages
  - **Why useful:** Important for home buying decisions and budgeting
  - **Data:** User provides home value and can provide their specific rate. Moni could maintain state average tax rates (but make it clear these are estimates and actual rates vary by locality).

### Taxes

- [ ] **Take-Home Pay Calculator** ⭐ - EXTREMELY HIGH TRAFFIC
  - **Description:** Calculate net pay after all taxes and deductions
  - **Inputs:** Gross annual salary (or hourly wage + hours), pay frequency, filing status, state, pre-tax deductions (401k %, health insurance, etc.)
  - **Outputs:** Net monthly/bi-weekly/weekly pay after federal income tax, state income tax, FICA (Social Security + Medicare), and deductions
  - **Why useful:** EXTREMELY high search volume, essential for salary negotiation and budgeting
  - **Data:** User provides all inputs including current tax year rates. Moni maintains tax calculation formulas and current FICA rates (static: 6.2% SS + 1.45% Medicare). User must provide or look up their federal/state tax brackets.
- [ ] **Self-Employment Tax Calculator**
  - **Description:** Calculate estimated quarterly tax payments for self-employed individuals
  - **Inputs:** Estimated annual net self-employment income, business deductions, filing status, state
  - **Outputs:** Estimated quarterly tax payment amounts (federal + state + self-employment tax), total annual tax burden, effective tax rate
  - **Why useful:** Freelancers and contractors desperately need this for quarterly estimated payments
  - **Data:** User provides income and current tax rates. Moni maintains self-employment tax rate (15.3%) and calculation formulas.
- [ ] **Capital Gains Tax Calculator**
  - **Description:** Calculate capital gains tax on investment sales
  - **Inputs:** Purchase price (cost basis), sale price, holding period (short-term <1 year or long-term >1 year), income bracket (for tax rate), state
  - **Outputs:** Taxable gain/loss, estimated federal tax owed, estimated state tax owed, net proceeds after tax
  - **Why useful:** Stock market and crypto investors need this constantly
  - **Data:** User provides transaction details and their tax bracket. Moni maintains long-term capital gains rates (0%, 15%, 20%) and calculation formulas.
- [ ] **Roth vs Traditional IRA/401(k) Calculator**
  - **Description:** Compare Roth vs Traditional retirement account contributions
  - **Inputs:** Annual contribution amount, current age, retirement age, current tax bracket (%), expected retirement tax bracket (%), expected annual return rate
  - **Outputs:** Side-by-side comparison at retirement: Traditional (larger balance but taxed), Roth (smaller balance but tax-free), break-even analysis, recommendation based on tax bracket assumptions
  - **Why useful:** Common investment question, helps optimize tax strategy for retirement savings
  - **Data:** User provides all inputs including their tax brackets. Moni maintains comparison formulas and compound growth calculations.

### Insurance

- [ ] **Life Insurance Needs Calculator**
  - **Description:** Calculate recommended life insurance coverage amount
  - **Inputs:** Annual household income, number of dependents, total debt (mortgage, loans, etc.), desired years of income replacement, final expenses (funeral, etc.), existing life insurance coverage
  - **Outputs:** Recommended coverage using multiple methods (income replacement, DIME method), shortfall/surplus vs existing coverage, estimated monthly premium ranges by age
  - **Why useful:** Important decision, helps avoid over-insuring or under-insuring
  - **Data:** User provides all inputs. Moni maintains calculation formulas (10x income rule, DIME method).
- [ ] **Health Insurance Plan Comparator**
  - **Description:** Compare 2-3 health insurance plans with different usage scenarios
  - **Inputs:** For each plan: Monthly premium, annual deductible, out-of-pocket maximum, coinsurance %, copay amounts. Usage scenarios: Low (1-2 visits), Medium (regular care + prescriptions), High (chronic condition or planned surgery)
  - **Outputs:** True annual cost for each plan under each usage scenario, break-even analysis, recommendation based on expected usage
  - **Why useful:** Open enrollment is confusing, helps choose the right plan based on health needs
  - **Data:** User provides all plan details and estimates usage. Moni maintains scenario calculations.

### Lump Sum Decisions

- [ ] **Lump Sum Decision Calculator** (Pension, Lottery, Inheritance, Settlement)
  - **Description:** Evaluate whether to take a lump sum payout or structured payments for various scenarios
  - **Inputs:** Event type (pension, lottery, inheritance, insurance settlement, severance), lump sum offer amount, alternative: structured payment amount and frequency and duration, current age, life expectancy, discount rate (expected investment return)
  - **Outputs:** Present value of structured payments, break-even age, total payout comparison, recommendation based on life expectancy and investment assumptions, tax implications note
  - **Why useful:** Critical high-stakes financial decision for multiple life events
  - **Data:** User provides all offer details and assumptions. Moni maintains present value formulas and comparison logic.

### Other Financial Tools

- [ ] **College Savings (529) Calculator**
  - **Description:** Calculate college savings progress and required contributions
  - **Inputs:** Child's current age, target college start age (typically 18), current annual college cost (user provides), expected college cost inflation rate (default ~5% but user can adjust), current 529 balance, monthly contribution amount
  - **Outputs:** Current college cost (user-provided), projected cost at enrollment (with inflation), projected 529 balance at enrollment, savings progress bar, shortfall/surplus, adjusted monthly contribution to meet goal. Interactive sliders to adjust: contribution amount, target cost, years to enrollment.
  - **Why useful:** Parents need this, education savings is major financial goal
  - **Data:** User provides current college costs for their target schools. Moni maintains compound interest calculations and inflation projections.
- [ ] **Wedding Budget Calculator**
  - **Description:** Allocate wedding budget across typical categories
  - **Inputs:** Total wedding budget, number of guests
  - **Outputs:** Category-by-category allocation with percentage and dollar amounts (venue, catering, photography, flowers, music, attire, rings, invitations, favors, etc.), cost per guest, adjustable sliders for each category
  - **Why useful:** Weddings are expensive and stressful, helps plan spending
  - **Data:** User provides budget and guest count. Moni maintains typical allocation percentages (can be industry averages).
- [ ] **Car Affordability Calculator**
  - **Description:** Calculate maximum affordable car price and total cost of ownership
  - **Inputs:** Annual income, existing monthly debt payments, down payment available, interest rate, loan term (years), estimated insurance (monthly), estimated gas/maintenance (monthly)
  - **Outputs:** Maximum affordable car price (using 20/4/10 rule or debt-to-income), maximum monthly payment, total cost over loan term, recommended budget
  - **Why useful:** Helps avoid buying too much car, very common financial mistake
  - **Data:** User provides all inputs. Moni maintains affordability rules (20/4/10 rule: 20% down, 4-year loan, 10% of gross income).
- [ ] **Debt-to-Income Ratio Calculator**
  - **Description:** Calculate DTI ratio for loan qualification
  - **Inputs:** Gross monthly income, list of monthly debt payments (mortgage/rent, car loans, student loans, credit cards, etc.)
  - **Outputs:** Front-end DTI (housing only), back-end DTI (all debts), qualification status for mortgages (conventional, FHA), recommendations to improve ratio
  - **Why useful:** Key metric for mortgage and loan qualification
  - **Data:** User provides all inputs. Moni maintains DTI thresholds (28% front-end, 36% back-end for conventional; 31%/43% for FHA).
- [ ] **Texas Energy Plan Analyzer** (EFL Comparison Tool)
  - **Description:** Compare Texas electricity plans using EFL (Electricity Facts Label) data
  - **Inputs:** For each plan (2-3 plans): Provider name, base charge ($/month), price per kWh at different usage tiers (500, 1000, 2000 kWh), contract length (months), early termination fee, renewable energy percentage (optional). User's estimated monthly usage (kWh).
  - **Outputs:** True monthly cost for each plan at user's usage level, annual cost comparison, cost per kWh at user's usage (accounting for base charges), break-even usage points where plans become competitive, recommendation, visual chart showing cost curves
  - **Why useful:** Texas has deregulated energy market, EFL labels are confusing, advertised rates are misleading. Huge value for Texas residents.
  - **Data:** User manually inputs plan details from EFL labels. Moni maintains calculation logic for true cost analysis.
  - **Implementation:** Start with structured manual input (not PDF parsing). Could add PDF parsing in future phase.

### Other Useful Tools

- [ ] **Percentage Calculator** ⭐ - HIGH TRAFFIC
  - **Description:** Calculate percentages, percentage increases/decreases, and percentage differences
  - **Inputs:** Various depending on calculation type (e.g., "what is X% of Y?", "X is what % of Y?", "% change from X to Y")
  - **Outputs:** Calculated percentage or value
  - **Why useful:** Essential for financial calculations (discounts, interest, returns, tips, tax), appears in Favorites of popular calculator apps
  - **Libraries:** None needed.
  - **Data:** User provides all inputs. Moni maintains calculation formulas.
- [ ] **APR to APY Converter** ⭐ - HIGH VALUE
  - **Description:** Convert between APR (Annual Percentage Rate) and APY (Annual Percentage Yield)
  - **Inputs:** Interest rate (APR or APY), compounding frequency (daily, monthly, quarterly, annually)
  - **Outputs:** Equivalent APR and APY, explanation of difference
  - **Why useful:** Credit cards/loans show APR, savings accounts show APY - people need to compare apples to apples
  - **Data:** User provides rates. Moni maintains conversion formulas.
- [ ] **Stock Share Price to Market Cap Converter**
  - **Description:** Convert between share price and market capitalization
  - **Inputs:** Either (share price + shares outstanding) OR (market cap + shares outstanding)
  - **Outputs:** The missing value (share price or market cap)
  - **Why useful:** Investors use this constantly to understand company valuation
  - **Data:** User provides company data. Moni maintains simple formula (market cap = price × shares).
- [ ] **Gross to Net Income Converter**
  - **Description:** Quick conversion between gross and net amounts with tax percentage
  - **Inputs:** Amount (gross or net), tax/fee percentage, conversion direction
  - **Outputs:** Converted amount, tax/fee amount
  - **Why useful:** Salary negotiation, contractor invoicing, quick calculations
  - **Data:** User provides all inputs. Moni maintains simple formulas.
- [ ] **Currency Converter**
  - **Description:** Convert between currencies using reasonably accurate exchange rates.
  - **Inputs:** Amount to convert, source currency, target currency.
  - **Outputs:** Converted amount.
  - **UI:** Input fields for amount and currencies (potentially with autocomplete), clear display of the converted amount.
  - **Libraries:** You could use the European Central Bank's exchange rates XML feed for currency conversion, which is updated daily. Or a free currency conversion API like `exchangerate-api.com`, but check their terms.
- [ ] **Sales Tax Calculator**
  - **Description:** Calculate sales tax for a given amount and location.
  - **Inputs:** Purchase amount, state/province and/or ZIP code.
  - **Outputs:** Sales tax amount, total price including tax.
  - **UI:** Input fields for amount and location, clear display of outputs.
  - **Libraries:** For the US, you can potentially use a simplified lookup table based on state/province. Accurate ZIP code-level calculations would likely require a more complex solution or an external API, but you can potentially use approximations.
- [ ] **Tip Calculator**
  - **Description:** Calculate tip amounts and split bills.
  - **Inputs:** Bill amount, tip percentage, number of people.
  - **Outputs:** Tip amount per person, total bill per person.
  - **UI:** Input fields for bill amount, tip percentage, and number of people, clear display of outputs.
  - **Libraries:** None needed.
- [ ] **Discount Calculator**
  - **Description:** Calculate the final price after applying a discount.
  - **Inputs:** Original price, discount percentage.
  - **Outputs:** Discount amount, final price.
  - **UI:** Input fields for original price and discount, clear display of outputs.
  - **Libraries:** None needed.
- [ ] **Price Per Unit Calculator**
  - **Description:** Compare the cost per unit of different products.
  - **Inputs:** Price of product 1, quantity of product 1, price of product 2, quantity of product 2.
  - **Outputs:** Price per unit for each product, a clear indication of which product is cheaper.
  - **UI:** Input fields for price and quantity of each product, clear display of unit prices and the best deal.
  - **Libraries:** None needed.
- [ ] **Inflation Calculator**
  - **Description:** Calculate the effect of inflation on the value of money over time.
  - **Inputs:** Amount of money, start year, end year.
  - **Outputs:** Value of the money in the end year, inflation rate.
  - **UI:** Input fields for amount and years, clear display of outputs.
  - **Libraries:** For the US, you could use historical inflation data from a source like the US Bureau of Labor Statistics (BLS) and calculate an average inflation rate over a given period. This could be reasonable to include.
- [ ] **Salary/Hourly Wage Converter**
  - **Description:** Convert between annual salary, hourly wage, weekly pay, etc.
  - **Inputs:** Amount, current pay period (e.g., hourly, annually), hours worked per week (if applicable).
  - **Outputs:** Equivalent amounts for other pay periods.
  - **UI:** Input fields for amount and pay period, clear display of converted amounts.
  - **Libraries:** None needed.
- [ ] **Home Affordability Calculator**
  - **Description:** Estimate how much house someone can afford based on their income, debt, and other factors.
  - **Inputs:** Gross monthly income, monthly debt payments, down payment amount, estimated interest rate, loan term, property taxes, homeowners insurance.
  - **Outputs:** Estimated maximum affordable home price, estimated monthly payment.
  - **UI:** Input fields for each input, clear display of outputs.
  - **Libraries:** None needed for basic calculations.
- [ ] **Rent Affordability Calculator**
  - **Description:** Estimate how much rent someone can afford based on their income and expenses.
  - **Inputs:** Gross monthly income, monthly debt payments, estimated other monthly expenses.
  - **Outputs:** Estimated maximum affordable monthly rent.
  - **UI:** Input fields for each input, clear display of output.
  - **Libraries:** None needed for basic calculations.
- [ ] **Net Worth Calculator**
  - **Description:** Calculate net worth by subtracting liabilities from assets.
  - **Inputs:** List of assets with their values (e.g., cash, investments, property), list of liabilities with their values (e.g., loans, credit card debt).
  - **Outputs:** Total assets, total liabilities, net worth.
  - **UI:** Input fields for each asset and liability, clear display of totals and net worth.
  - **Libraries:** None needed.

## Conversion tools (convertly.benmvp.com)

### Cooking/Recipe

- [ ] **Recipe Scaler** ⭐⭐⭐ - EXTREMELY HIGH TRAFFIC
  - **Description:** Scale recipe ingredients up or down for different serving sizes
  - **Inputs:** Original recipe servings, target servings, list of ingredients with amounts and units
  - **Outputs:** Scaled ingredients list with converted amounts, maintains proper fractions (e.g., 1/3 cup, not 0.33 cups)
  - **Why useful:** MASSIVELY searched, everyone who cooks needs this, high engagement
  - **Implementation:** Smart fraction handling, unit conversion (cups to tablespoons when scaling down)
- [ ] **Cooking Temperature Converter** (Celsius/Fahrenheit with cooking context)
  - **Description:** Convert cooking temperatures with doneness guidance
  - **Inputs:** Temperature (C or F), optional: cooking method (baking, frying, grilling), optional: food type
  - **Outputs:** Converted temperature, common cooking temp references (e.g., "350°F = 175°C = Moderate oven"), doneness notes if food type provided
  - **Why useful:** International recipes need conversion, provides helpful cooking context
  - **Database:** Small JSON of common cooking temps and food doneness temps (static, ~2KB)

### Measurement

- [ ] Length Converter (mm, cm, m, km, in, ft, yd, mi, nautical miles, etc.)
- [ ] Weight/Mass Converter (mg, g, kg, metric tons, ounces, pounds, US tons, UK tons, etc.)
- [ ] Volume Converter (ml, l, cubic cm, cubic m, tsp, tbsp, fl oz, cups, pints, quarts, gallons, etc.)
- [ ] Temperature Converter (Celsius, Fahrenheit, Kelvin)
- [ ] Area Converter (sq cm, sq m, sq km, sq in, sq ft, sq yd, sq mi, acres, hectares, etc.)
- [ ] Pressure Converter (Pa, kPa, MPa, bars, atmospheres, psi, torrs, etc.)
- [ ] Energy Converter (Joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours, BTUs, etc.)
- [ ] Speed Converter (m/s, km/h, mph, knots, ft/s, etc.)
- [ ] Angle Converter (degrees, radians, gradians)

### Time

- [ ] Time Zone Converter (`dayjs` with the `timezone` and `utc` plugins, `moment-timezone`)
- [ ] Time Unit Converter (seconds, minutes, hours, days, weeks, etc.)

### Data

- [ ] Data Size Converter (bit, byte, KB, MB, GB, TB, etc.)
- [ ] Numeral System Converter (decimal, binary, octal, hexadecimal)

### International/Travel

- [ ] **Clothing Size Converter** ⭐ - HIGH TRAFFIC
  - **Description:** Convert clothing sizes between international sizing systems
  - **Inputs:** Size in one country's system, clothing type (shirts, pants, dresses, suits, etc.), gender
  - **Outputs:** Equivalent sizes in US, UK, EU, Asia sizing systems, size chart reference
  - **Why useful:** Online international shopping is huge, essential for cross-border e-commerce
  - **Database:** Static JSON lookup table (~5KB) - US/UK/EU/Asia sizing charts by clothing type. Never changes.
- [ ] **Shoe Size Converter** - HIGH TRAFFIC
  - **Description:** Convert shoe sizes between international sizing systems
  - **Inputs:** Size in one system (US, UK, EU, or CM), gender (men's/women's/kids)
  - **Outputs:** Equivalent sizes in all other systems (US, UK, EU, CM), size chart reference
  - **Why useful:** International shoe shopping, very commonly searched
  - **Database:** Static JSON lookup table (~2KB) - international shoe size conversions. Never changes.
- [ ] **Paper Size Converter** (A4, Letter, Legal, etc.)
  - **Description:** Look up dimensions of standard paper sizes
  - **Inputs:** Paper size name (A0-A10, Letter, Legal, Tabloid, etc.) or dimensions to identify
  - **Outputs:** Dimensions in mm, cm, and inches, aspect ratio, common uses
  - **Why useful:** Printing, international documents, design work
  - **Database:** Tiny static JSON (~1KB) - standard paper sizes. Never changes.

### Health/Fitness

- [ ] **BMI Calculator** - EXTREMELY HIGH TRAFFIC
  - **Description:** Calculate Body Mass Index from height and weight
  - **Inputs:** Height (ft/in or cm), weight (lbs or kg), optional: age and gender for more context
  - **Outputs:** BMI value, category (underweight/normal/overweight/obese), healthy weight range for height, BMI chart visualization
  - **Why useful:** EXTREMELY high search volume, basic health metric
  - **Database:** BMI formula only (weight / height²), category thresholds (static)
- [ ] **BMR/TDEE Calculator** ⭐⭐ - VERY HIGH TRAFFIC
  - **Description:** Calculate Basal Metabolic Rate and Total Daily Energy Expenditure
  - **Inputs:** Age, gender, height, weight, activity level (sedentary to very active)
  - **Outputs:** BMR (calories burned at rest), TDEE (total daily calories), calorie targets for weight loss/maintenance/gain goals (with deficit/surplus amounts)
  - **Why useful:** Essential for fitness and diet planning, very high search volume
  - **Database:** Mifflin-St Jeor formula (static), activity multipliers (static)
- [ ] **Body Fat Percentage Calculator**
  - **Description:** Estimate body fat percentage using various measurement methods
  - **Inputs:** Method selection (Navy method, BMI method, or visual estimation), required measurements based on method (waist, neck, hip for Navy method)
  - **Outputs:** Estimated body fat percentage, category (essential/athletes/fitness/average/obese), comparison by age and gender
  - **Why useful:** Fitness tracking, more accurate than BMI alone
  - **Database:** Navy method formula (static), category thresholds (static)
- [ ] **Macro Calculator** (Protein/Carbs/Fat)
  - **Description:** Calculate daily macronutrient targets
  - **Inputs:** Weight, goal (lose fat/maintain/gain muscle), activity level, diet preference (balanced/low-carb/high-protein)
  - **Outputs:** Daily macro targets in grams (protein, carbs, fat), calorie breakdown by macro, meal planning suggestions
  - **Why useful:** Essential for nutrition and bodybuilding, meal planning
  - **Database:** Macro formulas based on goals (static: 1g protein per lb for muscle gain, etc.)
- [ ] **Running Pace Converter**
  - **Description:** Convert running pace between different units
  - **Inputs:** Pace in min/mile or min/km, or speed in mph/kph
  - **Outputs:** Pace in both units, speed in both units, projected finish times for common race distances (5K, 10K, half marathon, marathon)
  - **Why useful:** Runners need this constantly for training and race planning
  - **Database:** Distance conversions only (static)

### Energy/Power

- [ ] **Electricity Cost Calculator** ⭐ - HIGH TRAFFIC
  - **Description:** Calculate electricity cost and energy usage for devices/appliances
  - **Inputs:** Device wattage (or amps + voltage), hours used per day, electricity rate ($/kWh - user provides from their bill)
  - **Outputs:** Daily/monthly/yearly energy usage (kWh), daily/monthly/yearly cost, comparison to common appliances
  - **Why useful:** Understanding electric bills, comparing appliances, identifying energy vampires
  - **Database:** Optional reference list of common appliance wattages (static, for examples)
- [ ] **Solar Panel Output Calculator**
  - **Description:** Estimate solar panel energy production and savings
  - **Inputs:** Panel wattage (per panel), number of panels, average daily sun hours (user provides for their location), system efficiency % (default 80%), electricity rate ($/kWh)
  - **Outputs:** Daily/monthly/yearly energy production (kWh), estimated bill savings ($/month, $/year), ROI timeline (if system cost provided)
  - **Why useful:** Solar is growing rapidly, people want ROI estimates before installation
  - **Database:** Calculation formulas only (static)

### Computing/Internet

- [ ] **Bandwidth/Data Transfer Calculator**
  - **Description:** Calculate file transfer time based on connection speed
  - **Inputs:** File size (with unit selector: KB, MB, GB, TB), connection speed (with unit selector: Kbps, Mbps, Gbps)
  - **Outputs:** Transfer time (seconds, minutes, hours), data transferred per hour/day/month at that speed
  - **Why useful:** File hosting decisions, video streaming, cloud backup planning
- [ ] **Screen Size/DPI Calculator**
  - **Description:** Calculate screen PPI and optimal viewing distance
  - **Inputs:** Screen diagonal size (inches), resolution (width × height in pixels)
  - **Outputs:** PPI (pixels per inch), pixel pitch, optimal viewing distance, "Retina" display threshold, screen classification (HD/FHD/QHD/4K)
  - **Why useful:** Monitor shopping, display quality comparison
- [ ] **Video Bitrate Calculator**
  - **Description:** Calculate recommended video bitrate for encoding
  - **Inputs:** Resolution (dropdown: 720p, 1080p, 1440p, 4K, etc.), framerate (dropdown: 24, 30, 60 fps), quality target (low/medium/high), codec (H.264, H.265)
  - **Outputs:** Recommended bitrate (Mbps), file size estimates for different video lengths, streaming bandwidth requirements
  - **Why useful:** Video encoding, streaming setup, storage planning
  - **Database:** Bitrate recommendations by resolution/quality (static guidelines)

### Video/Photography

- [ ] **Resolution/Aspect Ratio Calculator**
  - **Description:** Calculate video/image dimensions for aspect ratios
  - **Inputs:** Known dimension (width OR height), target aspect ratio (16:9, 4:3, 1:1, 21:9, etc.)
  - **Outputs:** Matching dimension, common resolutions for that aspect ratio, pixel count, use cases
  - **Why useful:** Video editing, image resizing, content creation for different platforms
- [ ] **Framerate to Shutter Speed Converter** (180° Shutter Rule)
  - **Description:** Calculate cinematically correct shutter speed for framerate
  - **Inputs:** Framerate (fps)
  - **Outputs:** 180° rule shutter speed (1/[fps×2]), other common shutter speeds, motion blur explanation
  - **Why useful:** Video production standard for natural motion blur
  - **Database:** 180° shutter rule formula (static)

### Other

- [ ] **Child Height Predictor**
  - **Description:** Predict adult height based on current height and parental heights
  - **Inputs:** Child's current age (years), child's current height, child's sex, mother's height, father's height
  - **Outputs:** Predicted adult height with range, growth chart percentile, methodology explanation
  - **Why useful:** Parents are curious about child development, fun and engaging tool
  - **Database:** Static growth prediction formulas (mid-parental height method, Khamis-Roche method if age 2+)

### Text

- [ ] Morse Code Converter
- [ ] Roman Numeral Converter
