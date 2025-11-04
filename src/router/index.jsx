import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Spinner from "../components/Spinner";

// Eager-loaded small pages
import Login from "../pages/adminEditors/Login";
import ForgotPassword from "../pages/adminEditors/ForgotPassword";
import ResetPassword from "../pages/adminEditors/ResetPassword";
import CompletedAccounts from "../pages/completedCustomers/CompletedAccounts";
import Find100ThDay from "../pages/dashboard/Find100ThDay";
import AgeCalculator from "../pages/dashboard/AgeCalculator";

// Lazy-loaded bigger pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const CustomerList = lazy(() => import("../pages/customers/CustomerList"));
const CustomerRecordsList = lazy(() => import("../pages/customersRecords/CustomerRecordsList"));
const AddCustomer = lazy(() => import("../pages/customers/AddCustomer"));
const AddEditor = lazy(() => import("../pages/editors/AddEditor"));
const EditorsList = lazy(() => import("../pages/editors/EditorsList"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },

      // Dashboard
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Spinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Customers
      {
        path: "customers",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <Suspense fallback={<Spinner />}>
              <CustomerList />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-customer",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <Suspense fallback={<Spinner />}>
              <AddCustomer />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "records/:customerId",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <Suspense fallback={<Spinner />}>
              <CustomerRecordsList />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Editors
      {
        path: "editors",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<Spinner />}>
              <EditorsList />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "add-editor",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<Spinner />}>
              <AddEditor />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Other pages
      {
        path: "completed-accounts",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CompletedAccounts />
          </ProtectedRoute>
        ),
      },
      { path: "days", element: <Find100ThDay /> },
      { path: "age", element: <AgeCalculator /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
