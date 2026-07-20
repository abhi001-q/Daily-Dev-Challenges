// ============================================
// HABIT TRACKER UI — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Animate Progress Rings on Load
  const CIRCUMFERENCE = 2 * Math.PI * 20; // r=20 → 125.66

  document.querySelectorAll('.ring-progress').forEach(ring => {
    const value = parseInt(ring.dataset.value, 10) || 0;
    const offset = CIRCUMFERENCE - (CIRCUMFERENCE * value) / 100;
    // Trigger animation after a brief delay
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset;
    });
  });

  // 2. Progress Ring Click — Complete Habit
  document.querySelectorAll('.progress-ring-container').forEach(container => {
    container.addEventListener('click', () => {
      const card = container.closest('.habit-card');
      const ring = container.querySelector('.ring-progress');
      const label = container.querySelector('.progress-label');

      // Set ring to 100%
      ring.style.strokeDashoffset = '0';
      ring.dataset.value = '100';

      // Update label to checkmark
      if (label) {
        label.textContent = '✓';
        label.classList.add('check');

        // Match check color to ring color
        const ringColor = window.getComputedStyle(ring).stroke;
        label.style.color = ringColor;
      }

      // Mark card as completed
      card.classList.add('completed');
    });
  });

  // 3. Weekly Calendar — Switch Active Day
  document.querySelectorAll('.day-item').forEach(day => {
    day.addEventListener('click', () => {
      document.querySelectorAll('.day-item').forEach(d => d.classList.remove('active'));
      day.classList.add('active');
    });
  });

  // 4. Bottom Nav — Switch Active Tab
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // 5. FAB — Bounce Animation
  const fab = document.querySelector('.nav-fab');
  if (fab) {
    fab.addEventListener('click', () => {
      fab.style.transform = 'translateY(-6px) scale(0.88)';
      setTimeout(() => {
        fab.style.transform = '';
      }, 200);
    });
  }

});
