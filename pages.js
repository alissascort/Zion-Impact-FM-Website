// Shared navigation functionality
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const dropdowns = document.querySelectorAll('.dropdown-toggle');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

dropdowns.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const parent = toggle.parentElement;
            parent.classList.toggle('active');
        }
    });
});

const API_BASE = 'http://localhost:8000/api';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[v0] API Error:', error);
        return null;
    }
}

// Programs Page
const scheduleTabsEls = document.querySelectorAll('.schedule-tab');
const scheduleContent = document.getElementById('scheduleContent');

if (scheduleTabsEls.length) {
    scheduleTabsEls.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            scheduleTabsEls.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadScheduleForDay(index);
        });
    });
    loadScheduleForDay(new Date().getDay());
}

async function loadScheduleForDay(dayIndex) {
    const data = await fetchAPI(`/schedule?day=${dayIndex}`);
    if (data && data.length) {
        scheduleContent.innerHTML = data.map(item => `
            <div class="schedule-item">
                <div class="schedule-time">${item.start_time} - ${item.end_time}</div>
                <div class="schedule-show">${item.show_name}</div>
                <div class="schedule-presenter">Host: ${item.presenter_name}</div>
            </div>
        `).join('');
    }
}

// Testimony Form
const testimonyForm = document.getElementById('testimonyForm');
if (testimonyForm) {
    const audioCheckbox = document.getElementById('testifyAudio');
    const audioUploadSection = document.getElementById('audioUploadSection');
    
    if (audioCheckbox) {
        audioCheckbox.addEventListener('change', (e) => {
            audioUploadSection.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    testimonyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('testifyName').value);
        formData.append('email', document.getElementById('testifyEmail').value);
        formData.append('phone', document.getElementById('testifyPhone').value);
        formData.append('content', document.getElementById('testifyContent').value);
        
        if (document.getElementById('testifyAudioFile').files.length) {
            formData.append('audio', document.getElementById('testifyAudioFile').files[0]);
        }
        
        try {
            const response = await fetch(`${API_BASE}/testimonies`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                showMessage('Testimony submitted! Thank you for sharing.', 'success', 'testimonyMessage');
                testimonyForm.reset();
                audioUploadSection.style.display = 'none';
            } else {
                showMessage('Error submitting testimony. Please try again.', 'error', 'testimonyMessage');
            }
        } catch (error) {
            showMessage('Error submitting testimony. Please try again.', 'error', 'testimonyMessage');
        }
    });
}

// Booking Form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('bookingName').value);
        formData.append('email', document.getElementById('bookingEmail').value);
        formData.append('phone', document.getElementById('bookingPhone').value);
        formData.append('company', document.getElementById('bookingCompany').value);
        formData.append('booking_type', document.getElementById('bookingType').value);
        formData.append('preferred_date', document.getElementById('bookingDate').value);
        formData.append('preferred_time', document.getElementById('bookingTime').value);
        formData.append('message', document.getElementById('bookingMessage').value);
        
        if (document.getElementById('bookingFile').files.length) {
            formData.append('file', document.getElementById('bookingFile').files[0]);
        }
        
        try {
            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                showMessage('Booking request submitted! We will contact you soon.', 'success', 'bookingMessage');
                bookingForm.reset();
            } else {
                showMessage('Error submitting booking. Please try again.', 'error', 'bookingMessage');
            }
        } catch (error) {
            showMessage('Error submitting booking. Please try again.', 'error', 'bookingMessage');
        }
    });
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            type: document.getElementById('contactType').value,
            message: document.getElementById('contactMessage').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                showMessage('Message sent successfully! We will reply soon.', 'success', 'contactMessage');
                contactForm.reset();
            } else {
                showMessage('Error sending message. Please try again.', 'error', 'contactMessage');
            }
        } catch (error) {
            showMessage('Error sending message. Please try again.', 'error', 'contactMessage');
        }
    });
}

// Partner Form
const partnerForm = document.getElementById('partnerForm');
if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('partnerName').value,
            email: document.getElementById('partnerEmail').value,
            phone: document.getElementById('partnerPhone').value,
            level: document.getElementById('partnerLevel').value,
            message: document.getElementById('partnerMessage').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/partners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                showMessage('Partnership registration submitted! We will contact you.', 'success', 'partnerMessage');
                partnerForm.reset();
            } else {
                showMessage('Error submitting partnership. Please try again.', 'error', 'partnerMessage');
            }
        } catch (error) {
            showMessage('Error submitting partnership. Please try again.', 'error', 'partnerMessage');
        }
    });
}

function showMessage(text, type, elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = text;
        el.className = `form-message ${type}`;
        setTimeout(() => {
            el.className = 'form-message';
        }, 5000);
    }
}

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Add filter logic here
    });
});
