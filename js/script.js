// ============================================
// Post Sara - JavaScript Logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== Smooth Scroll for nav links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // close mobile menu
                const navCollapse = document.querySelector('.navbar-collapse');
                if (navCollapse.classList.contains('show')) {
                    new bootstrap.Collapse(navCollapse).hide();
                }
            }
        });
    });

    // ===== Active nav link on scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== Cost Calculation =====
    const weightInput = document.getElementById('pkgWeight');
    const insureBox = document.getElementById('insure');
    const codBox = document.getElementById('cod');
    const weightCostEl = document.getElementById('weightCost');
    const insureCostEl = document.getElementById('insureCost');
    const totalCostEl = document.getElementById('totalCost');

    const basePrices = {
        normal: 25000,
        fast: 40000,
        express: 65000
    };

    function formatToman(num) {
        return num.toLocaleString('fa-IR') + ' تومان';
    }

    function calculateCost() {
        const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
        let weight = parseFloat(weightInput.value) || 0;
        if (weight > 30) weight = 30;

        let total = basePrices[serviceType];

        // weight cost
        let weightCost = 0;
        if (weight > 0.5) {
            const extraWeight = Math.max(0, weight - 0.5);
            const factor = serviceType === 'normal' ? 8000 :
                           serviceType === 'fast' ? 12000 : 18000;
            weightCost = Math.ceil(extraWeight * factor);
        }
        total += weightCost;
        weightCostEl.innerHTML = formatToman(weightCost);

        // insurance (2% of declared value, demo: 50000)
        let insureCost = 0;
        if (insureBox.checked) {
            insureCost = 50000;
            total += insureCost;
        }
        insureCostEl.innerHTML = formatToman(insureCost);

        // COD adds 10000
        if (codBox.checked) {
            total += 10000;
        }

        totalCostEl.innerHTML = formatToman(total);
    }

    if (weightInput) {
        weightInput.addEventListener('input', calculateCost);
        insureBox.addEventListener('change', calculateCost);
        codBox.addEventListener('change', calculateCost);
        document.querySelectorAll('input[name="serviceType"]').forEach(r => {
            r.addEventListener('change', calculateCost);
        });
    }

    // ===== Form Submit =====
    const sendForm = document.getElementById('sendForm');
    if (sendForm) {
        sendForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Generate tracking code
            const trackingCode = Array.from({ length: 24 }, () =>
                Math.floor(Math.random() * 10)
            ).join('');

            // Show success modal (using alert for simplicity)
            const formattedCode = trackingCode.match(/.{1,4}/g).join('-');

            showSuccessModal(formattedCode);

            // reset form
            sendForm.reset();
            calculateCost();
        });
    }

    function showSuccessModal(code) {
        const modalHtml = `
        <div class="modal fade" id="successModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <div class="mb-3">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                        </div>
                        <h3 class="fw-bold text-success mb-3">بسته با موفقیت ثبت شد!</h3>
                        <p class="text-muted">کد رهگیری شما:</p>
                        <div class="alert alert-warning fw-bold fs-5" style="letter-spacing: 2px;">
                            ${code}
                        </div>
                        <p class="small text-muted mb-4">
                            کد رهگیری را ذخیره کنید تا بتوانید وضعیت بسته را پیگیری کنید.
                        </p>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                            <i class="bi bi-check"></i> متوجه شدم
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalEl = document.getElementById('successModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        modalEl.addEventListener('hidden.bs.modal', function () {
            modalEl.remove();
        });
    }

    // ===== Tracking =====
    window.trackPackage = function () {
        const input = document.getElementById('trackingInput').value.trim();
        if (input.length < 8) {
            alert('لطفا کد رهگیری معتبر وارد کنید');
            return;
        }

        document.getElementById('trackCode').textContent = input;
        document.getElementById('trackStatus').textContent = 'در مرکز توزیع مقصد';

        const resultSection = document.getElementById('trackResultSection');
        resultSection.style.display = 'block';
        resultSection.classList.add('fade-in');

        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // ===== Contact form =====
    const contactForms = document.querySelectorAll('#contact form');
    contactForms.forEach(f => {
        f.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('پیام شما با موفقیت ارسال شد! به زودی با شما تماس می‌گیریم.');
            f.reset();
        });
    });

    // ===== Newsletter =====
    const newsletterBtn = document.querySelector('footer .btn-warning');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            if (input.value) {
                alert('ایمیل شما با موفقیت ثبت شد!');
                input.value = '';
            }
        });
    }

    // ===== Animate on scroll =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .icon-box').forEach(el => {
        observer.observe(el);
    });

    // initial cost
    if (weightInput) calculateCost();
});
