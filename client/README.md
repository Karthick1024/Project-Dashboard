# Project Management Dashboard

A responsive and interactive project management dashboard built using **React**, **Vite**, **Context API**, and **Bootstrap**. It features Kanban-style task organization, employee and project management with CRUD capabilities, and intuitive drag-and-drop support.

## ✨ Features

- 📋 **Project, Task, and Employee Management**
- 🧩 **Kanban Board** with drag-and-drop functionality
- 👥 Assign multiple or single employees to tasks/projects
- 🧠 State management using React Context API
- ⚡ Fast builds and HMR via Vite
- 📱 Fully responsive design using Bootstrap

## 📁 Project Structure

Projectdashboard/ └── client/ ├── public/ ├── src/ │ ├── assets/ │ ├── components/ │ ├── context/ │ ├── layouts/ │ ├── pages/ │ ├── routes/ │ ├── utils/ │ ├── App.jsx │ └── main.jsx ├── index.html ├── package.json ├── vite.config.js

shell
Copy
Edit

## 🚀 Getting Started



### Installation

```bash
cd Dashboard/client
npm install
Running the App
bash
Copy
Edit
npm run dev
This will start the development server on http://localhost:5173 (or similar).

🔧 Available Scripts
npm run dev - Start the dev server

npm run build - Build the app for production

npm run preview - Preview the production build

📦 Dependencies
Key libraries used:

react

react-dom

react-router-dom

bootstrap

classnames

react-beautiful-dnd

🧠 State Management
This project uses React Context API to manage:

Employee state

Project state

Task state

Located in src/context/.


Also the delpoyed link in vercel

https://project-dashboard-puce.vercel.app/dashboard