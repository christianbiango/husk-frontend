import { Navigate, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LoginPage } from "@/pages/LoginPage";
import { NewSessionPage } from "@/pages/NewSessionPage";
import { SessionPage } from "@/pages/SessionPage";

function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />
      <Route
        path="/nouvelle-session"
        element={
          <AuthenticatedLayout>
            <NewSessionPage />
          </AuthenticatedLayout>
        }
      />
      <Route
        path="/session/:id"
        element={
          <AuthenticatedLayout>
            <SessionPage />
          </AuthenticatedLayout>
        }
      />
      <Route path="/" element={<Navigate to="/nouvelle-session" replace />} />
      <Route path="*" element={<Navigate to="/nouvelle-session" replace />} />
    </Routes>
  );
}

export default App;
