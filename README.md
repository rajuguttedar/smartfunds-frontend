
# YMG SmartFunds Frontend

This is the **frontend application** for the YMG SmartFunds system. It is built with **React.js** and **Vite**, and uses modern libraries for routing, state management, and API interactions.

---

# 📦 Features

- Authentication (Login, Forgot Password, Reset Password)
- Dashboard with stats
- CRUD operations for Editors and Customers
- Customer daily collection records
- Dark/Light mode toggle
- Pagination and search functionality
- Responsive design

---

## 📁 Folder Structure (Frontend)

frontend/
│── src/
│   ├── api/                 # Axios instance for API calls
│   │    └── axios.js
│   │
│   ├── assets/              # images, icons, static files
│   │
│   ├── components/          # reusable UI components
│   │    ├── Footer.jsx
│   │    └── ProtectedRoute.jsx
│   │    └── SideBar.jsx.jsx
│   │
│   ├── context/             # AuthContext for authentication state
│   │    └── AuthContext.jsx
│   │
│   ├── pages/               # All main pages
│   │    ├── Login.jsx
│   │    ├── ForgotPassword.jsx
│   │    ├── ResetPassword.jsx
│   │    ├── Dashboard.jsx
│   │    ├── AddEditor.jsx
│   │    ├── EditorsList.jsx
│   │    ├── AddCustomer.jsx
│   │    ├── CustomerList.jsx
│   │    ├── AddCustomerRecords.jsx
│   │    └── CustomerRecordsList.jsx
│   │    └── Pagination.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
└── package.json
|__ vite.config.js

---

## 1. Clone the repository:
git clone <repo-url>

## 2. Navigate to the frontend directory
cd frontend

## 3. Install dependencies
npm install

## 4. Create a .env file
VITE_API_URL=http://localhost:5000/api  for locally testing purpose use this after developed use backend url instead this.

## 5. Start development server
---

# Dependencies used:

axios – for API calls

framer-motion – animations and transitions

jwt-decode – decode JWT tokens

react-hot-toast – notifications

react-icons – icon components

react-router-dom – routing

recharts – charts

lucide-react – icons

clsx – conditional classNames

---

# 🔐 Authentication Flow

Login.jsx handles authentication via backend API.

JWT token is stored in localStorage (accessToken).

AuthContext.jsx manages authentication state globally.

ProtectedRoute.jsx ensures only logged-in users can access dashboard and customer/editor pages.

---

# 📜 Detailed Page & Component Descriptions
## 🔐 Login.jsx

Handles user login via email and password.

- On success → saves JWT token and navigates to Dashboard.

- On failure → shows toast notification.

- Key functions:

  await api.post("/auth/login", { email, password });

## 🧾 Dashboard.jsx

Displays an overview of:

- Daily collection

- Pending amounts

- Completed accounts (admin only)

- Bar chart: “Daily Collection vs Pending”

### Libraries:
  recharts, framer-motion

## 👤 AddEditor.jsx

Used by admin to create new editors.

- Simple form with name, email, and password.

- On submit → API POST request.

### API Used:

POST /api/editors

## 👥 EditorsList.jsx

- Displays all editors with options to edit/delete.
- Pagination handled using Pagination.jsx.
- Only admin can delete.

## 💰 AddCustomer.jsx

- Compact, clean customer creation form.
- Each row contains 2–3 related fields.
- Form is centered and styled neatly.

### Fields:

-* Account No, Name

* Start Date, End Date

* Total Days, Total Amount, Daily Collection, Mobile

### API:

POST /api/customers
Headers: { Authorization: Bearer <token> }


✅ On success, calls onSubmit() from parent to update the table live.

## 📋 CustomerList.jsx

Displays paginated list of customers.
Includes:

- Search by name

- Clickable rows (navigate to customer record)

- Red pending amount

- “Add Customer” button opens modal form

### API:

GET /api/customers

### Pagination Props:

<Pagination
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  totalPages={totalPages}
/>

### Extra Behavior:

- Clicking phone number → opens dialpad in mobile.

- Clicking elsewhere on row → navigates to customer records page.

## 🧾 AddCustomerRecords.jsx

Used to add a new record for a customer’s daily payment.

### API:

POST /api/customers/:id/records

## 📊 CustomerRecordsList.jsx

Displays individual customer’s records.

- Shows date, received amount, and pending amount.

- Calculates based on startDate → today.

# Components

## 🔄 Pagination.jsx

Simple and reusable component.

### Props:

currentPage
setCurrentPage
totalPages


### Displays:

< Prev | 1 | 2 | 3 | Next >

## 🧭 Sidebar.jsx

Main navigation sidebar:

- Links: Dashboard, Customers, Editors, Logout

- Dark/Light theme toggle

- Uses lucide-react icons

- Responsive for mobile

# 🔒 ProtectedRoute.jsx

Restricts access to protected pages.

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

If no token → redirects to /login.

# 🌐 axios.js

Global Axios instance for all API requests.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

# 🧠 AuthContext.jsx

Handles:

- Login/Logout

- User data persistence

- Token decoding with jwt-decode

### Usage:

const { user, logout } = useAuth();


# 🧪 Unit Test Suggestions (For Future)

If you add Jest/React Testing Library:

### Component                   What to Test
- Login.jsx                   Valid credentials navigate to dashboard
- AddCustomer.jsx	            Submits API correctly
- CustomerList.jsx	        Pagination renders correct rows
- AuthContext.jsx	            Token stored and user persisted
- ProtectedRoute.jsx	        Redirects unauthenticated users


# 🪄 UI/UX Standards

- Always center modals vertically.

- Use Tailwind utility classes consistently.

- Buttons → rounded, hover:bg-opacity-80.

- toast.success() and toast.error() for all async calls.

## Dark Mode

Managed in Sidebar.jsx with dark state.

Applies dark: Tailwind classes globally.

## 🌈 Future Improvements

Role-based route protection

Charts for financial trends

Export records to Excel/CSV

Admin dashboard summary filters

Mobile-first dashboard cards

---

## 📌 Best Practices

Always wrap API calls with try/catch.

Keep AuthContext updated with user info on login.

Use ProtectedRoute for sensitive pages.

Keep form components reusable.

Maintain consistent Tailwind classes for styling.

---

## ⚡ Future Enhancements

Add role-based access control for pages

Implement unit tests for components and API calls

Optimize lazy loading for heavy components

Enhance mobile responsiveness

Add export to CSV for customer records

## ✨ Author

Raju Guttedar
Frontend Developer | MERN Stack

# 🛠 Tech Focus: React.js, Tailwind CSS, Express.js, MongoDB
