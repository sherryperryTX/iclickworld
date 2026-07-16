import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AgentLoginPage() {
  return (
    <div className="container" style={{ padding: "56px 0", maxWidth: 420 }}>
      <h1>Agent Login</h1>
      <p style={{ color: "#555", fontSize: 14, marginTop: -8 }}>
        For CLICKpoint Realty agents. New accounts need approval before they
        can access the tool launcher.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
