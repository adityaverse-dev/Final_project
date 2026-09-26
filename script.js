/* =========================================
   BUS PASS MANAGEMENT SYSTEM
   JAVASCRIPT
========================================= */

const passForm = document.getElementById("passForm");


/* ---------- APPLICATION SUBMISSION ---------- */

passForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const college = document.getElementById("college").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const route = document.getElementById("route").value;
    const duration = document.getElementById("duration").value;


    /* ---------- VALIDATION ---------- */

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }


    /* ---------- GENERATE UNIQUE APPLICATION ID ---------- */

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const applicationId = "BP2026-" + randomNumber;


    /* ---------- APPLICATION OBJECT ---------- */

    const application = {

        applicationId: applicationId,
        studentName: studentName,
        rollNumber: rollNumber,
        college: college,
        phone: phone,
        email: email,
        address: address,
        route: route,
        duration: duration,

        status: "Pending",

        applicationDate:
            new Date().toLocaleDateString("en-IN")
    };


    /* ---------- GET EXISTING APPLICATIONS ---------- */

    let applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];


    /* ---------- ADD NEW APPLICATION ---------- */

    applications.push(application);


    /* ---------- SAVE APPLICATIONS ---------- */

    localStorage.setItem(
        "busApplications",
        JSON.stringify(applications)
    );


    alert(
        "Application submitted successfully!\n\n" +
        "Application ID: " + applicationId
    );


    /* ---------- SHOW RESULT ---------- */

    showApplication(application);

    passForm.reset();

});


/* =========================================
   SHOW APPLICATION
========================================= */

function showApplication(application) {

    const statusResult =
        document.getElementById("statusResult");

    statusResult.innerHTML = `

        <div class="status-card">

            <h3>Application Submitted ✓</h3>

            <p>
                <strong>Application ID:</strong>
                ${application.applicationId}
            </p>

            <p>
                <strong>Student:</strong>
                ${application.studentName}
            </p>

            <p>
                <strong>Route:</strong>
                ${application.route}
            </p>

            <p>
                <strong>Duration:</strong>
                ${application.duration}
            </p>

            <p>
                <strong>Status:</strong>
                <span class="status-pending">
                    ${application.status}
                </span>
            </p>

        </div>

    `;
}


/* =========================================
   CHECK STATUS
========================================= */

function checkStatus() {

    const applicationId =
        document.getElementById("applicationId")
        .value.trim();

    const statusResult =
        document.getElementById("statusResult");


    if (applicationId === "") {

        statusResult.innerHTML = `
            <p class="error-message">
                Please enter an Application ID.
            </p>
        `;

        return;
    }


    const applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];


    const application =
        applications.find(
            app => app.applicationId === applicationId
        );


    if (!application) {

        statusResult.innerHTML = `
            <p class="error-message">
                Application not found.
                Please check your Application ID.
            </p>
        `;

        return;
    }


    displayApplicationStatus(application);
}


/* =========================================
   DISPLAY STATUS
========================================= */

function displayApplicationStatus(application) {

    const statusResult =
        document.getElementById("statusResult");


    let statusClass = "status-pending";


    if (application.status === "Approved") {
        statusClass = "status-approved";
    }

    else if (application.status === "Rejected") {
        statusClass = "status-rejected";
    }


    statusResult.innerHTML = `

        <div class="status-card">

            <h3>Application Found ✓</h3>

            <p>
                <strong>Application ID:</strong>
                ${application.applicationId}
            </p>

            <p>
                <strong>Student Name:</strong>
                ${application.studentName}
            </p>

            <p>
                <strong>Roll Number:</strong>
                ${application.rollNumber}
            </p>

            <p>
                <strong>College:</strong>
                ${application.college}
            </p>

            <p>
                <strong>Route:</strong>
                ${application.route}
            </p>

            <p>
                <strong>Pass Duration:</strong>
                ${application.duration}
            </p>

            <p>
                <strong>Application Date:</strong>
                ${application.applicationDate}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="${statusClass}">
                    ${application.status}
                </span>

            </p>

            ${
                application.status === "Approved"
                ? `
                    <button
                        class="pass-view-btn"
                        onclick="generatePass('${application.applicationId}')"
                    >
                        🎫 View Digital Pass
                    </button>
                `
                : ""
            }

        </div>

    `;
}


/* =========================================
   ADMIN DASHBOARD
========================================= */

function loadAdminApplications() {

    const applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];

    const tableBody =
        document.getElementById("adminTableBody");


    if (applications.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No applications available.
                </td>
            </tr>
        `;

        updateDashboardStats([]);

        return;
    }


    tableBody.innerHTML = "";


    applications.forEach((application, index) => {

        let statusClass = "status-pending";

        if (application.status === "Approved") {
            statusClass = "status-approved";
        }

        else if (application.status === "Rejected") {
            statusClass = "status-rejected";
        }


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${application.applicationId}
                </td>

                <td>
                    ${application.studentName}
                </td>

                <td>
                    ${application.route}
                </td>

                <td>
                    ${application.duration}
                </td>

                <td>
                    <span class="${statusClass}">
                        ${application.status}
                    </span>
                </td>

                <td>

                    ${
                        application.status === "Pending"
                        ? `
                            <button
                                class="approve-btn"
                                onclick="updateApplication(${index}, 'Approved')"
                            >
                                Approve
                            </button>

                            <button
                                class="reject-btn"
                                onclick="updateApplication(${index}, 'Rejected')"
                            >
                                Reject
                            </button>
                        `
                        : `
                            <button
                                class="view-btn"
                                onclick="viewAdminApplication(${index})"
                            >
                                View
                            </button>
                        `
                    }

                </td>

            </tr>

        `;
    });


    updateDashboardStats(applications);
}


/* =========================================
   UPDATE APPLICATION STATUS
========================================= */

function updateApplication(index, newStatus) {

    const applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];


    applications[index].status = newStatus;


    localStorage.setItem(
        "busApplications",
        JSON.stringify(applications)
    );


    alert(
        "Application " +
        applications[index].applicationId +
        " has been " +
        newStatus.toLowerCase() +
        "."
    );


    loadAdminApplications();
}


/* =========================================
   ADMIN VIEW DETAILS
========================================= */

function viewAdminApplication(index) {

    const applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];

    const application = applications[index];


    alert(

        "APPLICATION DETAILS\n\n" +

        "Application ID: " +
        application.applicationId + "\n\n" +

        "Student: " +
        application.studentName + "\n\n" +

        "Roll Number: " +
        application.rollNumber + "\n\n" +

        "College: " +
        application.college + "\n\n" +

        "Phone: " +
        application.phone + "\n\n" +

        "Email: " +
        application.email + "\n\n" +

        "Route: " +
        application.route + "\n\n" +

        "Duration: " +
        application.duration + "\n\n" +

        "Status: " +
        application.status
    );
}


/* =========================================
   DASHBOARD STATISTICS
========================================= */

function updateDashboardStats(applications) {

    const total =
        applications.length;

    const pending =
        applications.filter(
            app => app.status === "Pending"
        ).length;

    const approved =
        applications.filter(
            app => app.status === "Approved"
        ).length;

    const rejected =
        applications.filter(
            app => app.status === "Rejected"
        ).length;


    document.getElementById("totalApplications").textContent = total;

    document.getElementById("pendingApplications").textContent = pending;

    document.getElementById("approvedApplications").textContent = approved;

    document.getElementById("rejectedApplications").textContent = rejected;
}


/* =========================================
   DIGITAL BUS PASS
========================================= */

function generatePass(applicationId) {

    const applications =
        JSON.parse(localStorage.getItem("busApplications")) || [];


    const application =
        applications.find(
            app => app.applicationId === applicationId
        );


    if (!application || application.status !== "Approved") {

        alert("Digital pass is only available for approved applications.");

        return;
    }


    const statusResult =
        document.getElementById("statusResult");


    statusResult.innerHTML = `

        <div class="digital-pass">

            <div class="pass-header">
                🚌 STUDENT BUS PASS
            </div>

            <div class="pass-body">

                <div class="pass-icon">
                    🎓
                </div>

                <h2>
                    ${application.studentName}
                </h2>

                <p>
                    ${application.college}
                </p>

                <div class="pass-info">

                    <div>
                        <small>PASS ID</small>
                        <strong>
                            ${application.applicationId}
                        </strong>
                    </div>

                    <div>
                        <small>ROUTE</small>
                        <strong>
                            ${application.route}
                        </strong>
                    </div>

                    <div>
                        <small>VALIDITY</small>
                        <strong>
                            ${application.duration}
                        </strong>
                    </div>

                    <div>
                        <small>STATUS</small>
                        <strong class="status-approved">
                            APPROVED
                        </strong>
                    </div>

                </div>

                <div class="qr-code">
                    ${application.applicationId}
                </div>

                <p class="pass-note">
                    This digital pass is valid for the selected route
                    and duration.
                </p>

            </div>

        </div>

    `;
}




document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("adminTableBody")) {
        loadAdminApplications();
    }

});