/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * animations.js — Scroll Reveals, Counters & Rack Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll-triggered reveal animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    }
  }

  // 2. Interactive Storage Rack Illustration (Selectable rack bins)
  const rackContainer = document.querySelector('.rack-grid-container');
  const rackInspector = document.getElementById('rack-inspector-info');

  if (rackContainer) {
    const rackCells = rackContainer.querySelectorAll('.rack-cell');
    rackCells.forEach(cell => {
      cell.addEventListener('click', () => {
        rackCells.forEach(c => c.classList.remove('is-selected'));
        cell.classList.add('is-selected');

        const code = cell.dataset.code || 'A-01';
        const status = cell.dataset.status || 'Stored';
        const sku = cell.dataset.sku || 'SKU-1001';
        const weight = cell.dataset.weight || '850 kg';

        if (rackInspector) {
          rackInspector.innerHTML = `
            <div class="telemetry-item" style="border-color: var(--electric-cyan);">
              <div class="telemetry-label">Selected Bay</div>
              <div class="telemetry-val telemetry-val--cyan">${code}</div>
              <p style="font-size:0.8rem; color:var(--mid-grey); margin-top:4px;">
                Status: <strong>${status}</strong> &bull; Item: <strong>${sku}</strong> &bull; Load: <strong>${weight}</strong>
              </p>
            </div>
          `;
        }
      });
    });
  }

  // 3. Animated Operations Flow Route Line
  const opTrack = document.querySelector('.operations-track');
  if (opTrack && !prefersReducedMotion) {
    const steps = opTrack.querySelectorAll('.operation-step');
    steps.forEach((step, idx) => {
      step.style.transitionDelay = `${idx * 0.15}s`;
    });
  }
});
