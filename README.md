# 🚀 **MERN Stack Machine Test — Admin & Agent Management App**

---

## 📋 **Project Overview**

This is a **MERN Stack Application** built as part of a **machine test**.  
It provides a complete solution for **Admin Login**, **Agent Management**, and **CSV Upload & Distribution** of data among agents.

---

### 💡 **The App Enables**
- 🔐 Secure **Admin login** using JWT authentication  
- 👥 Adding & managing **agents**  
- 📤 Uploading and validating **CSV files**  
- ⚖️ Automatically distributing list items equally among all agents  
- 🧾 Displaying each agent’s assigned data on the dashboard  

---

## 🧩 **Features**

### 🧑‍💼 **1. Admin User Login**
- Login using **Email** and **Password**
- Authentication handled with **JWT tokens**
- Redirects to dashboard on success
- Proper error messages for invalid credentials

---

### 👥 **2. Agent Creation & Management**
- Admin can create agents with:
  - **Name**
  - **Email**
  - **Mobile Number** (with country code)
  - **Password**
- Data securely stored in **MongoDB**
- Agents visible on the **dashboard**

---

### 📂 **3. Upload CSV & Distribute Lists**
- Accepts only **.csv**, **.xlsx**, **.xls** formats  
- Validates file structure:
  - `FirstName`
  - `Phone`
  - `Notes`
- Distributes items equally among 5 agents  
  - Example: 25 items → 5 per agent  
  - Remaining rows distributed sequentially  
- Data stored in MongoDB  
- Each agent can view their assigned items on the frontend  

---

## 🔐 **Login Credentials**

### 🧑‍💼 **Admin Account**
| **Email** | **Password** |
|------------|---------------|
| as6119552@gmail.com | Abhi2002@ |

### 👤 **Agent Accounts**
| **Email** | **Password** |
|------------|---------------|
| ayush@gmail.com | 12345678 |
| arnabdas@gmail.com | 12345678 |

> ⚠️ Use these credentials to log in and test the app functionality.

---

## 🛠️ **Tech Stack**

| **Layer** | **Technology** |
|------------|----------------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (JSON Web Token) |
| File Handling | Multer, CSV Parser |

---

## ⚙️ **Setup Instructions**

### 🧱 **1. Clone the Repository**
```bash
git clone https://github.com/Abhishek-IEM/Machine-Test-Mern-Stack.git
cd Machine-Test-Assignment

## ⚙️ **2. Setup the Backend**
cd backend
npm install


Create a .env file in the backend folder and add:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the backend server:

npm start

💻 3. Setup the Frontend
cd frontend
npm install
npm start


The app will start at:
👉 Frontend: http://localhost:5173
👉 Backend: http://localhost:8000

🧠 Validation & Error Handling

✅ Input validation for all fields (Email, Password, Mobile Number)

✅ File type and structure validation for uploads

✅ Proper error messages for login failures

✅ 404 & 500 level error handling with clean messages

📽️ Demo Video

🎥 Click Here to Watch on Google Drive
https://drive.google.com/drive/folders/1mBi5F3xCGjyi9-v80rc10TyQZ8ipWlee?usp=sharing



