// src/pages/SignUpForm.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAuth } from "../../context/AuthContext";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email || !password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (!isChecked) {
      setError("Vous devez accepter les conditions.");
      return;
    }
    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
      navigate("/signin", { state: { message: "Compte créé. Veuillez vous connecter." } });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign Up</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div><Label>First Name*</Label><Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
                <div><Label>Last Name*</Label><Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
              </div>
              <div><Label>Email*</Label><Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div>
                <Label>Password*</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <p className="text-gray-500 dark:text-gray-400">I accept the terms and conditions</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-50">
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="mt-5"><p className="text-sm text-center text-gray-700 dark:text-gray-400">Already have an account? <Link to="/signin" className="text-brand-500 hover:text-brand-600">Sign In</Link></p></div>
        </div>
      </div>
    </div>
  );
}