import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PermitGuide = lazy(() => import("./pages/PermitGuide"));
const Contractors = lazy(() => import("./pages/Contractors"));
const FinancialPlanning = lazy(() => import("./pages/FinancialPlanning"));
const Payments = lazy(() => import("./pages/Payments"));
const Login = lazy(() => import("./pages/Login"));
const DesignCatalogue = lazy(() => import("./pages/DesignCatalogue"));
const PlanEditor = lazy(() => import("./pages/PlanEditor"));
const Documents = lazy(() => import("./pages/Documents"));
const Messages = lazy(() => import("./pages/Messages"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-bg-light">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-bg-light font-sans text-slate-900">
      <Header />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/catalogue"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <DesignCatalogue />
                  </Suspense>
                }
              />
              <Route
                path="/project/tasks"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Tasks />
                  </Suspense>
                }
              />
              <Route
                path="/project/tasks/:taskId"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <TaskDetails />
                  </Suspense>
                }
              />
              <Route
                path="/editor"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PlanEditor />
                  </Suspense>
                }
              />
              <Route
                path="/guide"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PermitGuide />
                  </Suspense>
                }
              />
              <Route
                path="/contractors"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Contractors />
                  </Suspense>
                }
              />
              <Route
                path="/finance"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <FinancialPlanning />
                  </Suspense>
                }
              />
              <Route
                path="/payments"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Payments />
                  </Suspense>
                }
              />
              <Route
                path="/documents"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Documents />
                  </Suspense>
                }
              />
              <Route
                path="/messages"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Messages />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
