/**
 * FORM.JS — Form Validation & Submission Handler
 */

(function() {
  'use strict';

  function initForms() {
    const form = document.querySelector('form[data-form="membership"]');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.classList.add('btn-loading');
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove('btn-loading');
          btn.disabled = false;
        }

        const successMsg = document.createElement('div');
        successMsg.className = 'card p-4 text-center mt-4';
        successMsg.style.borderColor = 'var(--color-success)';
        successMsg.style.color = 'var(--color-success)';
        successMsg.innerHTML = '<strong>Thank you!</strong> Your membership interest has been recorded. We will contact you shortly.';

        form.appendChild(successMsg);
        form.reset();

        setTimeout(() => {
          successMsg.remove();
        }, 5000);
      }, 1000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
