import BasePage from './base-page';

class Beneficiary extends BasePage {

  onReady() {
    this.initStepNavigation();
    this.initStatusFilters();
    this.initCounters();
    this.initAidTypeSelect();
    this.initCancelRequest();
    this.initFormValidation();
  }

  registerEvents() {
    const registrationForm = document.querySelector('#beneficiary-registration-form');
    if (registrationForm) {
      registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = registrationForm.querySelector('salla-button[type="submit"]');
        if (submitBtn) submitBtn.setAttribute('loading', 'true');
        fetch('/api/beneficiary/register', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          body: new FormData(registrationForm),
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              salla.notify.success(salla.lang.get('pages.beneficiary.registration_success'));
              setTimeout(() => { window.location.href = '/customer/beneficiary/dashboard'; }, 1500);
            } else {
              salla.notify.error(data.message || salla.lang.get('pages.beneficiary.registration_error'));
            }
          })
          .catch(() => salla.notify.error(salla.lang.get('pages.beneficiary.registration_error')))
          .finally(() => { if (submitBtn) submitBtn.removeAttribute('loading'); });
      });
    }

    const requestForm = document.querySelector('#aid-request-form');
    if (requestForm) {
      requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = requestForm.querySelector('salla-button[type="submit"]');
        if (submitBtn) submitBtn.setAttribute('loading', 'true');
        fetch('/api/beneficiary/requests', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          body: new FormData(requestForm),
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              salla.notify.success(salla.lang.get('pages.beneficiary.request_submitted'));
              setTimeout(() => { window.location.href = '/customer/beneficiary/requests'; }, 1500);
            } else {
              salla.notify.error(data.message || salla.lang.get('pages.beneficiary.request_error'));
            }
          })
          .catch(() => salla.notify.error(salla.lang.get('pages.beneficiary.request_error')))
          .finally(() => { if (submitBtn) submitBtn.removeAttribute('loading'); });
      });
    }
  }

  // ──────────────────────────────────────────
  // Multi-step registration form
  // ──────────────────────────────────────────

  initStepNavigation() {
    const steps = document.querySelectorAll('.beneficiary-form__step');
    if (!steps.length) return;

    document.querySelectorAll('.btn--next').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = btn.closest('.beneficiary-form__step');
        if (!this._validateStep(currentStep)) return;
        const nextNum = parseInt(btn.dataset.next);
        this._goToStep(nextNum);
      });
    });

    document.querySelectorAll('.btn--prev').forEach(btn => {
      btn.addEventListener('click', () => {
        const prevNum = parseInt(btn.dataset.prev);
        this._goToStep(prevNum);
      });
    });
  }

  _goToStep(num) {
    document.querySelectorAll('.beneficiary-form__step').forEach(s => s.classList.remove('is-active'));
    document.querySelectorAll('.beneficiary-steps__item').forEach(s => {
      const sNum = parseInt(s.dataset.step);
      s.classList.toggle('is-active', sNum === num);
      s.classList.toggle('is-done', sNum < num);
    });

    const target = document.querySelector(`.beneficiary-form__step[data-step="${num}"]`);
    if (target) {
      target.classList.add('is-active');
      window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' });
    }
  }

  _validateStep(stepEl) {
    const required = stepEl.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.classList.remove('is-invalid');
      const tag = field.tagName.toLowerCase();
      // salla-tel-input exposes .phone, not .value
      const value = tag === 'salla-tel-input'
        ? (field.phone || '')
        : (field.value || '');
      if (!value.toString().trim()) {
        field.classList.add('is-invalid');
        valid = false;
      }
    });

    if (!valid) {
      salla.notify.error(salla.lang.get('pages.beneficiary.fill_required_fields'));
    }

    return valid;
  }

  // ──────────────────────────────────────────
  // Request list status filters
  // ──────────────────────────────────────────

  initStatusFilters() {
    const tabs = document.querySelectorAll('.beneficiary-filter-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const filter = tab.dataset.filter;

        document.querySelectorAll('.beneficiary-request-item').forEach(item => {
          const show = filter === 'all' || item.dataset.status === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ──────────────────────────────────────────
  // Animated counters
  // ──────────────────────────────────────────

  initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        this._animateCounter(el, target);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  _animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  // ──────────────────────────────────────────
  // Aid type visual selection
  // ──────────────────────────────────────────

  initAidTypeSelect() {
    document.querySelectorAll('.beneficiary-aid-type input').forEach(input => {
      input.addEventListener('change', () => {
        const card = input.closest('.beneficiary-aid-type');
        if (input.type === 'radio') {
          document.querySelectorAll('.beneficiary-aid-type').forEach(c => c.classList.remove('is-selected'));
        }
        if (input.checked) card.classList.add('is-selected');
        else card.classList.remove('is-selected');
      });
    });

    document.querySelectorAll('.beneficiary-urgency-option input').forEach(input => {
      input.addEventListener('change', () => {
        document.querySelectorAll('.beneficiary-urgency-option').forEach(c => c.classList.remove('is-selected'));
        if (input.checked) input.closest('.beneficiary-urgency-option').classList.add('is-selected');
      });
    });
  }

  // ──────────────────────────────────────────
  // Cancel request
  // ──────────────────────────────────────────

  initCancelRequest() {
    const confirmBtn = document.querySelector('#confirm-cancel-request');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', () => {
      const requestId = window.location.pathname.split('/').pop();
      confirmBtn.setAttribute('loading', 'true');

      salla.api.request(`/api/beneficiary/requests/${requestId}`, {}, 'DELETE')
        .then(() => {
          salla.notify.success(salla.lang.get('pages.beneficiary.request_cancelled'));
          setTimeout(() => window.location.href = '/customer/beneficiary/requests', 1200);
        })
        .catch(() => salla.notify.error(salla.lang.get('pages.beneficiary.cancel_failed')))
        .finally(() => confirmBtn.removeAttribute('loading'));
    });
  }

  // ──────────────────────────────────────────
  // National ID format validation
  // ──────────────────────────────────────────

  initFormValidation() {
    const nationalId = document.querySelector('#national-id');
    if (!nationalId) return;

    nationalId.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  }
}

Beneficiary.initiateWhenReady([
  'beneficiary-register',
  'customer.beneficiary.dashboard',
  'customer.beneficiary.requests',
  'customer.beneficiary.requests.create',
  'customer.beneficiary.requests.single',
]);
