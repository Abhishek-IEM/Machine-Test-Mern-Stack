MERN Stack Application: Admin and Agent List Management System
This application is built using the MERN (MongoDB, Express.js, React.js, Node.js) stack to provide an administrative interface for user login, agent management, and the distribution of tasks/lists via CSV/XLSX file uploads.

🚀 Getting Started
Follow these instructions to set up and run the application on your local machine.

Prerequisites
You need the following software installed on your system:

Node.js (version 14 or higher is recommended)

npm (Node Package Manager, installed with Node.js)

MongoDB (Local instance or cloud service like MongoDB Atlas)

1. Project Setup
Clone the repository:

Bash

git clone https://github.com/Abhishek-IEM/Machine-Test-Mern-Stack.git
cd Machine Test Assignment
Install dependencies: The project is split into a frontend (React) and a backend (Express/Node) directory. You must install dependencies for both.

Bash

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install

2. Configuration (.env File)
You must create a .env file in the root directory of the project to configure the database connection and JWT secret.

# MongoDB Connection String (e.g., local or Atlas)
MONGO_URI=mongodb://localhost:27017/mern_list_app

# JSON Web Token Secret for authentication
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY

# Port for the Express server
PORT=8000

3. Database Seeding (Optional but Recommended)
For initial testing, you may need a default Admin User. If you do not have a separate seeding script, you will need to manually create an admin user directly in your MongoDB shell or using a tool like MongoDB Compass.

Field	Value (Example)	Notes
email	admin@example.com	Primary login credential
password	hashed_password	Must be BCRYPT hashed!
role	admin	Used for authorization

Export to Sheets
4. Running the Application
Use the following commands from the root directory to start the application.

Start the Backend Server (API): 

Bash

npm run dev
# The server will run on http://localhost:8000
Start the Frontend Client (React.js):
Open a new terminal window, navigate to the client directory, and run:

Bash

npm run dev
# The client will typically run on http://localhost:5173

⚙️ Key Functionality
1. Admin User Login
Access the application at http://localhost:5173.

Use the Admin Email and Password (from the seeding step) to log in.

Upon successful login, a JWT is generated and stored, and the user is redirected to the dashboard.

2. Agent Creation & Management
Navigate to the Agent Management section on the dashboard.

Use the form to create new agents by providing a Name, Unique Email, Mobile Number (with country code), and Password.

The agent password is hashed before being saved to the database.

3. CSV Upload and List Distribution
Navigate to the List Upload section.

File Upload: Select a file (.csv, .xlsx, or .xls). The application validates the file type.

Format Validation: Ensure the file contains the required columns: FirstName, Phone, and Notes.

Distribution:

The system automatically distributes the list items equally among the registered agents.

Any remainder items are distributed sequentially to the first agents.

The final distributed lists are saved to MongoDB and displayed clearly on the dashboard, showing which agent received which items.

🛠 Technology Stack
Database: MongoDB

Backend: Node.js, Express.js

Frontend: React.js / Next.js

Authentication: JSON Web Tokens (JWT), Bcrypt.js for password hashing

File Handling: Multer for file upload, csv-parser / SheetJS (xlsx) for file parsing.

🎥 Video Demonstration
The video demonstration linked below provides a full walkthrough of the application's functionality:

[Link to Google Drive Video]
https://drive.google.com/drive/folders/1mBi5F3xCGjyi9-v80rc10TyQZ8ipWlee?usp=sharing

