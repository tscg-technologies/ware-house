/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * main.js — Application Initializer & Global Helpers
 * TSCG Technologies Portfolio Demo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year dynamically
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = currentYear.toString();
  });

  // Log demo initialization
  console.log(
    '%c WAREHOUSE & STORAGE SOLUTIONS %c Intelligent Industrial Demo %c',
    'background: #172536; color: #37C5DF; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #2869A6; color: #ffffff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'background: transparent;'
  );
});
