export function Footer() {
  const currentYear = new Date().getFullYear()
  const yearRange = currentYear > 2025 ? `2025-${currentYear}` : '2025'

  return (
    <footer className="border-t py-6 text-center text-sm text-slate-600 dark:text-slate-400">
      <p>
        © {yearRange}{' '}
        <a
          href="https://benmvp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          BenMVP
        </a>
      </p>
    </footer>
  )
}
