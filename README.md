# 🚘 AutoSpace (VSMS)
**Vehicle Service Management System**

AutoSpace is a full-stack, comprehensive garage management platform designed to streamline automotive repair workflows. It bridges the gap between customers, mechanics, and shop administrators through real-time progress tracking, transparent billing, and automated digital workflows.

![AutoSpace Banner](https://via.placeholder.com/1200x400?text=AutoSpace+Dashboard+Preview) ## ✨ Core Features

### 👥 Multi-Role Architecture
* **Customer Portal (Tailwind CSS):** Users can book services, track their vehicle's real-time status dynamically, view mechanic notes, and receive digital invoices.
* **Mechanic Workspace (Bootstrap / SB Admin 2):** Mechanics can view assigned jobs, update statuses, add repair notes, and upload "After Service" verification photos.
* **Admin Dashboard:** Administrators can oversee shop capacity, assign jobs to mechanics, manage billing queues, and generate automated tax-inclusive HTML invoices.

### 🚀 Key Capabilities
* **Live Progress Tracking:** Customers see a dynamic progress bar updating as their vehicle moves from *Pending* ➡️ *In Progress* ➡️ *Completed*.
* **Automated Email Notifications:** Integrated NodeMailer system sends beautiful HTML emails to customers when a job is finished and when the official invoice is generated.
* **Photo Verification:** Secure image uploading via Multer & Cloudinary allows mechanics to prove repairs.
* **Immutable Logs:** Complete history tracking for every vehicle and customer.

---

## 🛠️ Tech Stack

**Frontend:**
* [EJS (Embedded JavaScript)](https://ejs.co/) for server-side templating
* [Tailwind CSS](https://tailwindcss.com/) (Customer views & Landing Page)
* [Bootstrap 4 / SB Admin 2](https://startbootstrap.com/theme/sb-admin-2) (Admin & Mechanic Dashboards)

**Backend:**
* [Node.js](https://nodejs.org/) runtime
* [Express.js](https://expressjs.com/) framework
* [MongoDB](https://www.mongodb.com/) with Mongoose ODM
* Aggregation Pipelines for complex data joining

**Utilities:**
* `nodemailer` - For transactional HTML emails
* `multer` & `cloudinary` - For image handling
* `bcryptjs` - Password hashing
* `express-session` & `connect-flash` - Authentication & Alert states

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.

### 1. Clone the repository

git clone [https://github.com/sourovnaskar/autospace-vsms.git](https://github.com/yourusername/autospace-vsms.git)
cd autospace-vsms
2. Install dependencies
Bash
npm install
3. Environment Variables
Create a .env file in the root directory and add your specific configuration:

Code snippet
PORT=3000
MONGO_URI=your_mongodb_connection_string

# Session Secret
SESSION_SECRET=your_super_secret_key

# Email Configuration (Nodemailer)
EMAIL_USERNAME=your_garage_email@gmail.com
EMAIL_PASSWORD=your_16_digit_google_app_password

# Cloudinary (If applicable)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
4. Run the application
For Development:

Bash
npm run dev  # Requires nodemon installed globally
For Production:

Bash
npm start
The application will be running at http://localhost:3000.

🛣️ Core Workflows
The Booking: A User logs in, adds their vehicle, and books a service. Status: Pending.

The Assignment: The Admin reviews the booking and assigns it to an available Mechanic.

The Repair: The Mechanic logs in, sees the job, and begins work. Status: In Progress.

The Completion: The Mechanic finishes, inputs the base cost, uploads a photo, and marks it done. An automated email is sent to the customer telling them the vehicle is ready. Status: Completed.

The Billing: The Admin reviews the completed job in the Billing Queue, calculates taxes, and generates the final invoice. A beautiful HTML invoice is emailed directly to the customer. Status: Ready for Pickup.

🔒 Security
Passwords are cryptographically hashed before saving to the database.

Role-based middleware ensures Customers cannot access Admin routes, and Mechanics cannot access Customer routes.

Mongoose schemas enforce strict data validation.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to contribute.

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.