document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const searchInput = document.getElementById('services-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const noResults = document.getElementById('no-results');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const form = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTriggers = document.querySelectorAll('.modal-trigger-link');
    const closeButtons = document.querySelectorAll('.modal-close');
    const formFields = {
        name: document.getElementById('form-name'),
        email: document.getElementById('form-email'),
        company: document.getElementById('form-company'),
        message: document.getElementById('form-message')
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('active');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const setActiveLink = () => {
        let current = 'home';
        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.id;
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    const applyFilters = () => {
        const searchValue = (searchInput?.value || '').trim().toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        let visibleCount = 0;

        serviceCards.forEach((card) => {
            const category = card.dataset.category || '';
            const text = card.textContent.toLowerCase();
            const matchesCategory = activeFilter === 'all' || category === activeFilter || (activeFilter === 'ai' && ['ai'].includes(category)) || (activeFilter === 'software' && ['software'].includes(category)) || (activeFilter === 'analytics' && ['analytics'].includes(category));
            const matchesSearch = !searchValue || text.includes(searchValue);
            const visible = matchesCategory && matchesSearch;
            card.style.display = visible ? 'block' : 'none';
            if (visible) visibleCount += 1;
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    };

    searchInput?.addEventListener('input', applyFilters);
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });

    const updateTimeline = () => {
        if (!timelineProgress || timelineSteps.length === 0) return;
        const firstStep = timelineSteps[0].getBoundingClientRect();
        const containerTop = firstStep.top + window.scrollY;
        const currentScroll = window.scrollY + window.innerHeight * 0.6;
        const totalHeight = document.querySelector('.timeline-container').offsetHeight;
        let progress = Math.min(1, Math.max(0, (currentScroll - containerTop) / totalHeight));
        timelineProgress.style.height = `${progress * 100}%`;

        timelineSteps.forEach((step, index) => {
            const stepTop = step.getBoundingClientRect().top;
            if (stepTop < window.innerHeight * 0.8) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();

    if (form) {
        Object.entries(formFields).forEach(([key, field]) => {
            if (!field) return;
            const simplePlaceholder = key === 'message' ? 'Message' : key.charAt(0).toUpperCase() + key.slice(1);
            field.setAttribute('placeholder', simplePlaceholder);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = formFields.name;
            const email = formFields.email;
            const company = formFields.company;
            const message = formFields.message;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let valid = true;

            document.querySelectorAll('.error-msg').forEach((error) => {
                error.style.display = 'none';
            });

            if (!name?.value.trim()) {
                document.getElementById('name-error').style.display = 'block';
                valid = false;
            }
            if (!email?.value.trim() || !emailPattern.test(email.value)) {
                document.getElementById('email-error').style.display = 'block';
                valid = false;
            }
            if (!company?.value.trim()) {
                document.getElementById('company-error').style.display = 'block';
                valid = false;
            }
            if (!message?.value.trim()) {
                document.getElementById('message-error').style.display = 'block';
                valid = false;
            }

            if (!valid) return;

            const nameValue = name.value.trim();
            const emailValue = email.value.trim();
            const companyValue = company.value.trim();
            const messageValue = message.value.trim();
            const body = [
                `Name: ${nameValue}`,
                `Email: ${emailValue}`,
                `Company: ${companyValue}`,
                '',
                `Message: ${messageValue}`
            ].join('\n');
            const mailtoLink = `mailto:Mathibela.k@outlook.com?subject=${encodeURIComponent('New contact message')}&body=${encodeURIComponent(body)}`;

            if (successAlert) {
                successAlert.innerHTML = `
                    <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <div>
                        <h4>Message ready</h4>
                        <p>Your message is being prepared for delivery.</p>
                    </div>
                `;
                successAlert.style.display = 'flex';
            }

            form.reset();
            window.location.href = mailtoLink;
        });
    }

    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (!modal || !modalOverlay) return;
        modalOverlay.style.display = 'flex';
        modal.style.display = 'block';
    };

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.style.display = 'none';
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const id = trigger.id.includes('privacy') ? 'privacy-modal' : 'terms-modal';
            openModal(id);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeModal);
    });

    modalOverlay?.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
});
