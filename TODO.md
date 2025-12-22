# TODO

## Dev Tools (codemata.bemvp.com)

Examples

- https://www.devtoolbox.co/
- https://www.freeformatter.com/

### Formatters (FormatAlignCenter icon)

- [ ] CSS/SCSS (`scss` parser)
- [ ] GraphQL (`graphql` parser)
- [ ] HTML (`html` parser)
- [ ] JS/TS (`typescript` parser)
- [ ] JSON (`json`)
- [ ] Markdown/MDX (`mdx` parser)
- [ ] XML (`@prettier/plugin-xml` plugin)
- [ ] YAML (`yaml` parser)

### Minifiers (Compress icon)

- [ ] HTML (`html-minifier-terser`)
- [ ] CSS/SCSS (`clean-css`)
- [ ] JS/TS (`terser` for JS, `typescript` for TS compilation)
- [ ] XML (`minify-xml`)
- [ ] JSON (`JSON.stringify(JSON.parse(input), null, 0)`)
- [ ] SVG

### Viewers (Visibility icon)

- [ ] SVG Viewer (`svgo`, potentially a dedicated SVG rendering library)
- [ ] View Page Source (Fetch source using a Server Action, display with syntax highlighting potentially `prismjs` or `highlight.js`)
- [ ] Google Fonts Previewer (Google Fonts API)
- [ ] Diff (`diff`, `diff2html`)
- [ ] Markdown Previewer (`marked`, `markdown-it`)

### Checkers/Validators (CheckCircle icon)

- [ ] XML (`xml2js`, potentially a schema validator)
- [ ] HTML (`html-validate`)
- [ ] JSON (`JSON.parse()` for basic validation, `ajv` for schema validation)
- [ ] CSS (`css-validator`)
- [ ] Favicon (Fetch favicon using a Server Action, parse HTML for `<link rel="icon">`, check image format, size, etc.)
- [ ] SEO (Libraries/APIs for analyzing meta tags, etc.)
- [ ] SMO (Libraries/APIs for analyzing Open Graph tags, Twitter Card tags, etc.)
- [ ] A11Y (`axe-core`)
- [ ] Robots.txt (Fetch and parse `robots.txt`, potentially offer basic validation)
- [ ] .htaccess (Fetch and parse `.htaccess`, potentially offer basic validation)
- [ ] Regex Tester (Potentially a library for visual representation of matches)

### Encoders/Decoders (Shuffle icon)

- [ ] JWT Decoder (`jsonwebtoken`)
- [ ] Base64 Encoder/Decoder (Browser: `btoa()`, `atob()`. Node.js: `Buffer`)
- [ ] URL Encoder/Decoder (Browser: `encodeURIComponent()`, `decodeURIComponent()`, `encodeURI()`, `decodeURI()`)
- [ ] HTML Entity Encoder/Decoder (`he`, `html-entities`)
- [ ] JS String Encoder/Decoder (Custom implementation for escaping/unescaping strings)

### Colors (Palette icon)

- [ ] Color Converter (`chroma-js`, `color.js`)
- [ ] Blend Transparent Colors (`chroma-js`, `color.js`)
- [ ] Find Complementary Colors (`chroma-js`, `color.js`)
- [ ] Create Website Color Scheme (`chroma-js`, `color.js`, potentially a color scheme generation API)
- [ ] CSS Gradient Generator (Potentially use a library to help with generating gradient strings)

### Generators (OfflineBolt icon)

- [ ] Hash (MD5, SHA) (Node.js: `crypto` module)
- [ ] Lorem Ipsum (Use an existing npm package for generating Lorem Ipsum text)
- [ ] UUID (`uuid`)
- [ ] Meta Tag (Create a form to input data and generate meta tags for SEO and social media)
- [ ] Random Number (Browser: `Math.random()`. Consider options for ranges and integer/decimal)
- [ ] Password Generator (Implement strong password generation logic with customizable options)
- [ ] QR Code Generator (`qrcode`, `node-qrcode`)
- [ ] QR Code Reader (`jsqr`)

### Converters (CompareArrows icon)

- [ ] Epoch Timestamp <-> Date (Browser: `Date` object)
- [ ] Unit (px <-> em, kb <-> MB, etc.) (Define supported units and conversion factors)
- [ ] XML <-> JSON (`xml2js`, `js2xmlparser`)
- [ ] CSV <-> JSON (`papaparse`)
- [ ] YAML <-> JSON (`js-yaml`)

### Text (TextFields icon)

- [ ] Case Converter (Implement functions for converting to uppercase, lowercase, title case, etc.)
- [ ] Text Analyzer (Calculate word count, character count, sentence count, etc.)
- [ ] String Reverser (Implement a function to reverse strings)
- [ ] Line sort & deduplication

### Network (Public icon)

- [ ] IP Address Lookup (Use a Server Action and potentially a third-party API, e.g., `ip-api.com`)
- [ ] Whois Lookup (Use a Server Action and potentially a third-party API)
- [ ] DNS Lookup (Use a Server Action and potentially a third-party API)

### Other (Extension icon)

- [ ] Character/Word Count (Implement basic counting logic)
- [ ] Unicode Character Lookup (Requires a database of Unicode characters or an API)
- [ ] Date/Time Difference Calculator (`date-fns`, `dayjs`)
- [ ] Diff Tool (`diff` for generating diffs & `diff2html` for visualization)
- [ ] API Tester (`axios` or `fetch` for making requests)
  - **Description:** A tool for making HTTP requests and inspecting responses.
  - **Inputs:** URL, HTTP method (GET, POST, PUT, DELETE, etc.), headers, request body.
  - **Outputs:** Response status code, headers, response body (formatted nicely for JSON, XML, etc.).
  - **UI:** Input fields for URL, method, headers, and body; a way to organize and save common requests; clear display of response details.

## Financial Tools (moni.benmvp.com)

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

### Debt Management

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

### Other Useful Tools

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

### Text

- [ ] Morse Code Converter
- [ ] Roman Numeral Converter
