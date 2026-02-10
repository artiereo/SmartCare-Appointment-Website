// Global state
let currentUserType = 'patient';
let contactMessages = []; // Store contact messages for admin

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for appointment booking
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Load contact messages if on admin dashboard
    loadContactMessages();
    
    // Initialize alert boxes
    createAlertBox('appointmentAlertBox');
});

// User Type Selection
function selectUserType(type) {
    currentUserType = type;
    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        showAlert('alertBox', 'Please fill in all fields', 'error');
        return;
    }

    // Simulate login
    showAlert('alertBox', 'Login successful! Redirecting...', 'success');

    setTimeout(() => {
        // Route to appropriate dashboard based on user type
        switch(currentUserType) {
            case 'patient':
                window.location.href = 'patient-dashboard.html';
                break;
            case 'doctor':
                window.location.href = 'doctor-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
        }
    }, 1500);
}

// Registration Handler
function handleRegistration(event) {
    event.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAlert('registerAlertBox', 'Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('registerAlertBox', 'Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('registerAlertBox', 'Password must be at least 6 characters', 'error');
        return;
    }

    showAlert('registerAlertBox', 'Registration successful! Redirecting to login...', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Booking Handler
function handleBooking(event) {
    event.preventDefault();
    
    const department = document.getElementById('bookDepartment').value;
    const doctor = document.getElementById('bookDoctor').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const reason = document.getElementById('bookReason').value;

    // Validation
    if (!department || !doctor || !date || !time || !reason) {
        showAlert('bookingAlertBox', 'Please fill in all fields', 'error');
        return;
    }

    showAlert('bookingAlertBox', 'Appointment booked successfully! You will receive a confirmation email shortly.', 'success');

    setTimeout(() => {
        document.getElementById('bookingForm').reset();
        showDashboardSection('patient-overview');
    }, 2500);
}

// Contact Form Handler
function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // Validation
    if (!name || !email || !subject || !message) {
        showAlert('contactAlertBox', 'Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('contactAlertBox', 'Please enter a valid email address', 'error');
        return;
    }

    // Create message object
    const contactMessage = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleString(),
        status: 'unread'
    };

    // Save to localStorage (simulating database)
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    showAlert('contactAlertBox', 'Thank you for contacting us! We will get back to you within 24 hours.', 'success');

    setTimeout(() => {
        document.getElementById('contactForm').reset();
    }, 2000);
}

// Dashboard Section Navigation
function showDashboardSection(sectionId) {
    // Remove active class from all menu items
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to clicked item
    if (event && event.target) {
        const clickedLink = event.target.closest('a');
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
    }

    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load contact messages if admin messages section is shown
    if (sectionId === 'admin-messages') {
        loadContactMessages();
    }
    
    // Clear any alerts when switching sections
    document.querySelectorAll('.alert').forEach(alert => {
        alert.classList.remove('show');
    });
}

// Load Doctors based on Department
function loadDoctors() {
    const department = document.getElementById('bookDepartment').value;
    const doctorSelect = document.getElementById('bookDoctor');
    
    // Clear existing options
    doctorSelect.innerHTML = '<option value="">Select doctor</option>';

    const doctorsByDept = {
        'cardiology': ['Dr. Ahmad Rahman', 'Dr. Sarah Mitchell'],
        'pediatrics': ['Dr. Sarah Chen', 'Dr. Michael Wong'],
        'orthopedics': ['Dr. Raj Kumar', 'Dr. Lisa Johnson'],
        'dermatology': ['Dr. Emily Wong', 'Dr. David Park'],
        'neurology': ['Dr. Michael Lee', 'Dr. Amanda Roberts'],
        'gynecology': ['Dr. Aisha Hassan', 'Dr. Jennifer Smith']
    };

    if (department && doctorsByDept[department]) {
        doctorsByDept[department].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        });
    }
}

// Load Contact Messages (Admin)
function loadContactMessages() {
    const messagesTableBody = document.getElementById('messagesTableBody');
    if (!messagesTableBody) return;

    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    if (messages.length === 0) {
        messagesTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">No messages yet</td></tr>';
        return;
    }

    // Sort messages by date (newest first)
    messages.sort((a, b) => b.id - a.id);

    messagesTableBody.innerHTML = messages.map(msg => `
        <tr>
            <td>#MSG${String(msg.id).slice(-4)}</td>
            <td>${escapeHtml(msg.name)}</td>
            <td>${escapeHtml(msg.email)}</td>
            <td>${escapeHtml(msg.subject)}</td>
            <td>${msg.date}</td>
            <td><span class="status-badge status-${msg.status}">${capitalizeFirst(msg.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewMessage(${msg.id})">View</button>
                    <button class="btn-action btn-edit" onclick="markAsRead(${msg.id})">Mark Read</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Update unread count
    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const unreadCountElement = document.getElementById('unreadMessagesCount');
    if (unreadCountElement) {
        unreadCountElement.textContent = unreadCount;
    }
}

// View Message Details (Admin)
function viewMessage(messageId) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const message = messages.find(m => m.id === messageId);
    
    if (!message) return;

    // Create modal content
    const modalContent = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2 style="margin-bottom: 1.5rem; color: var(--gray-900);">Message Details</h2>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--gray-700);">From:</strong> ${escapeHtml(message.name)}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--gray-700);">Email:</strong> ${escapeHtml(message.email)}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--gray-700);">Subject:</strong> ${escapeHtml(message.subject)}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--gray-700);">Date:</strong> ${message.date}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--gray-700);">Status:</strong> 
                <span class="status-badge status-${message.status}">${capitalizeFirst(message.status)}</span>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
                <strong style="color: var(--gray-700); display: block; margin-bottom: 0.5rem;">Message:</strong>
                <p style="color: var(--gray-600); line-height: 1.7; white-space: pre-wrap;">${escapeHtml(message.message)}</p>
            </div>
            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
                <button onclick="replyToMessage('${message.email}', '${escapeHtml(message.subject)}')" class="btn-primary" style="margin-right: 0.5rem;">Reply via Email</button>
                <button onclick="markAsRead(${message.id})" class="btn-secondary">Mark as Read</button>
            </div>
        </div>
    `;

    // Show modal
    showModal(modalContent);
}

// Mark Message as Read
function markAsRead(messageId) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        messages[messageIndex].status = 'read';
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        loadContactMessages();
        closeModal();
    }
}

// Reply to Message
function replyToMessage(email, subject) {
    const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
    closeModal();
}

// Show Alert
function showAlert(containerId, message, type) {
    const alertBox = document.getElementById(containerId);
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// Show Modal
function showModal(content) {
    let modal = document.getElementById('messageModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'messageModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = content;
    modal.classList.add('show');
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Admin Functions - Add Doctor
function addDoctor() {
    const modalContent = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2 style="margin-bottom: 1.5rem; color: var(--gray-900);">Add New Doctor</h2>
            <form id="addDoctorForm" onsubmit="handleAddDoctor(event)">
                <div class="form-group">
                    <label>Doctor Name *</label>
                    <input type="text" required placeholder="Enter doctor's full name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Specialty *</label>
                        <input type="text" required placeholder="e.g., Cardiologist">
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select required>
                            <option value="">Select department</option>
                            <option>Cardiology</option>
                            <option>Pediatrics</option>
                            <option>Orthopedics</option>
                            <option>Dermatology</option>
                            <option>Neurology</option>
                            <option>Gynecology</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" required placeholder="doctor@smartcare.com">
                </div>
                <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" required placeholder="Enter phone number">
                </div>
                <div style="margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button type="button" onclick="closeModal()" class="btn-secondary" style="padding: 0.75rem 1.5rem;">Cancel</button>
                    <button type="submit" class="btn-primary" style="padding: 0.75rem 1.5rem;">Add Doctor</button>
                </div>
            </form>
        </div>
    `;
    showModal(modalContent);
}

function handleAddDoctor(event) {
    event.preventDefault();
    alert('Doctor added successfully! (This would save to database in production)');
    closeModal();
}

// Admin Functions - Add Department
function addDepartment() {
    const modalContent = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2 style="margin-bottom: 1.5rem; color: var(--gray-900);">Add New Department</h2>
            <form id="addDepartmentForm" onsubmit="handleAddDepartment(event)">
                <div class="form-group">
                    <label>Department Name *</label>
                    <input type="text" required placeholder="Enter department name">
                </div>
                <div class="form-group">
                    <label>Head of Department *</label>
                    <select required>
                        <option value="">Select doctor</option>
                        <option>Dr. Ahmad Rahman</option>
                        <option>Dr. Sarah Chen</option>
                        <option>Dr. Raj Kumar</option>
                        <option>Dr. Emily Wong</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="4" placeholder="Enter department description"></textarea>
                </div>
                <div style="margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button type="button" onclick="closeModal()" class="btn-secondary" style="padding: 0.75rem 1.5rem;">Cancel</button>
                    <button type="submit" class="btn-primary" style="padding: 0.75rem 1.5rem;">Add Department</button>
                </div>
            </form>
        </div>
    `;
    showModal(modalContent);
}

function handleAddDepartment(event) {
    event.preventDefault();
    alert('Department added successfully! (This would save to database in production)');
    closeModal();
}

// Edit Functions
function editDoctor(doctorId) {
    alert('Edit doctor form would open here for doctor: ' + doctorId);
}

function editDepartment(deptId) {
    alert('Edit department form would open here for department: ' + deptId);
}

function viewDoctorDetails(doctorId) {
    alert('View doctor details for: ' + doctorId);
}

function viewDepartmentDetails(deptId) {
    alert('View department details for: ' + deptId);
}

function viewPatientProfile(patientId) {
    alert('View patient profile for: ' + patientId);
}

// Helper Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create alert box if it doesn't exist
function createAlertBox(id) {
    if (!document.getElementById(id)) {
        const alertBox = document.createElement('div');
        alertBox.id = id;
        alertBox.className = 'alert';
        const firstCard = document.querySelector('.dashboard-card');
        if (firstCard) {
            firstCard.insertBefore(alertBox, firstCard.firstChild);
        }
    }
}

// Cancel Appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        createAlertBox('appointmentAlertBox');
        showAlert('appointmentAlertBox', 'Appointment cancelled successfully', 'success');
        // Reload the appointments list after short delay
        setTimeout(() => {
            const row = event.target.closest('tr');
            if (row) {
                row.querySelector('.status-badge').className = 'status-badge status-cancelled';
                row.querySelector('.status-badge').textContent = 'Cancelled';
                row.querySelector('.btn-cancel').disabled = true;
                row.querySelector('.btn-cancel').style.opacity = '0.5';
            }
        }, 500);
    }
}

// View Appointment Details
function viewAppointmentDetails(appointmentId) {
    const modalContent = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2 style="margin-bottom: 1.5rem; color: var(--gray-900);">Appointment Details</h2>
            <div style="display: grid; gap: 1rem;">
                <div>
                    <strong style="color: var(--gray-700);">Appointment ID:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">${appointmentId}</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Date & Time:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">February 10, 2026 at 10:00 AM</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Patient:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">John Doe (PAT-2024-001)</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Doctor:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Dr. Ahmad Rahman - Cardiologist</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Department:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Cardiology</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Reason for Visit:</strong>
                    <p style="color: var(--gray-600); margin-top: 0.25rem;">Routine checkup and blood pressure monitoring</p>
                </div>
                <div>
                    <strong style="color: var(--gray-700);">Status:</strong>
                    <p style="margin-top: 0.25rem;"><span class="status-badge status-confirmed">Confirmed</span></p>
                </div>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button onclick="closeModal()" class="btn-primary" style="padding: 0.75rem 1.5rem;">Close</button>
            </div>
        </div>
    `;
    showModal(modalContent);
}

// Confirm Appointment (Doctor)
function confirmAppointment(appointmentId) {
    if (confirm('Confirm this appointment?')) {
        createAlertBox('appointmentAlertBox');
        showAlert('appointmentAlertBox', 'Appointment confirmed successfully!', 'success');
        setTimeout(() => {
            const row = event.target.closest('tr');
            if (row) {
                row.querySelector('.status-badge').className = 'status-badge status-confirmed';
                row.querySelector('.status-badge').textContent = 'Confirmed';
                const editBtn = row.querySelector('.btn-edit');
                if (editBtn) {
                    editBtn.textContent = 'Complete';
                    editBtn.onclick = function() { completeAppointment(appointmentId); };
                }
            }
        }, 500);
    }
}

// Complete Appointment (Doctor)
function completeAppointment(appointmentId) {
    if (confirm('Mark this appointment as completed?')) {
        createAlertBox('appointmentAlertBox');
        showAlert('appointmentAlertBox', 'Appointment marked as completed', 'success');
        setTimeout(() => {
            const row = event.target.closest('tr');
            if (row) {
                row.querySelector('.status-badge').className = 'status-badge status-completed';
                row.querySelector('.status-badge').textContent = 'Completed';
                row.querySelector('.btn-edit').disabled = true;
                row.querySelector('.btn-edit').style.opacity = '0.5';
            }
        }, 500);
    }
}
