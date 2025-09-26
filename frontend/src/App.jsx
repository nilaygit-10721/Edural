import { Routes, Route } from "react-router-dom";
import CTA from "./components/CTA";
import Features from "./components/Features";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowITWorks";
import Navbar from "./components/Navbar";
import FAQ from "./components/AnimatedTestimonials";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import "./i18n";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Labs from "./components/Labs";
import ProgressPanel from "./components/ProgressPanel";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <HowItWorks />
              <FAQ />
              <CTA />
            </>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Additional Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/progress" element={<ProgressPanel />} />

        {/* Tools Page (where login redirects) */}
        <Route
          path="/tools"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Tools Page</h1>
                <p className="text-gray-600">
                  This is where users are redirected after login.
                </p>
                <p className="text-gray-600 mt-2">
                  User ID: {localStorage.getItem("userId")}
                </p>
              </div>
            </div>
          }
        />
      </Routes>

      {/* Chatbot visible on every page */}
      <Chatbot />
    </>
  );
}

export default App;
