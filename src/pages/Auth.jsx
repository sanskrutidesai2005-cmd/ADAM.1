import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import PersonalDetailsForm from './PersonalDetailsForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-sky-600 rounded-full mb-4 shadow-lg shadow-sky-200">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800">ADAM</h1>
          <p className="text-slate-500 mt-2">Your Personal Health Companion</p>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="flex border-b border-slate-200">
            <TabButton
              title="Login"
              isActive={activeTab === 'login'}
              onClick={() => setActiveTab('login')}
            />
            <TabButton
              title="Create Account"
              isActive={activeTab === 'register'}
              onClick={() => setActiveTab('register')}
            />
          </div>

          <div className="p-8">
            {activeTab === 'login' ? <LoginForm navigate={navigate} /> : <RegisterForm navigate={navigate} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-1/2 py-4 text-center font-semibold transition-colors duration-300 focus:outline-none ${
      isActive
        ? 'text-sky-600 border-b-2 border-sky-600'
        : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {title}
  </button>
);

const LoginForm = ({ navigate }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const users = JSON.parse(localStorage.getItem('adam_users') || '[]');
    const user = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);

    if (user) {
      localStorage.setItem('adam_auth_token', 'mock_token_123');
      localStorage.setItem('adam_current_user', JSON.stringify(user));
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
      <p className="text-slate-500 mt-1 mb-6">Enter your credentials to access your account</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <InputField label="Email" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          placeholder="••••••••"
          icon={Lock}
          rightIcon={passwordVisible ? EyeOff : Eye}
          onRightIconClick={() => setPasswordVisible(!passwordVisible)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right">
          <a href="#" className="text-sm font-medium text-sky-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const validatePassword = (password) => {
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  return validations;
};

const RegisterForm = ({ navigate }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    dob: '',
    height: '',
    weight: '',
    blood_group: '',
    gender: '',
  });

  const handleDetailsInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const validations = validatePassword(password);
    setPasswordValidations(validations);
    const allValid = Object.values(validations).every(Boolean);
    setIsFormValid(fullName.trim() !== '' && email.trim() !== '' && allValid);
  }, [fullName, email, password]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    // Mock successful registration
    setStep(2);
  };

  const onDetailsComplete = () => {
    const newUser = {
      email,
      password, // In a real app, you should hash the password
      name: fullName,
      ...personalDetails
    };

    const users = JSON.parse(localStorage.getItem('adam_users') || '[]');
    users.push(newUser);
    localStorage.setItem('adam_users', JSON.stringify(users));

    console.log('User saved to local storage:', newUser);
    console.log('All users in local storage:', users);

    localStorage.setItem('adam_auth_token', 'mock_token_123');
    localStorage.setItem('adam_current_user', JSON.stringify(newUser));
    navigate('/');
  }

  if (step === 2) {
    return <PersonalDetailsForm 
              onComplete={onDetailsComplete}
              formData={personalDetails}
              onInputChange={handleDetailsInputChange} 
            />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
      <p className="text-slate-500 mt-1 mb-6">Start your health journey today</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <InputField label="Full Name" type="text" placeholder="John Doe" icon={User} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <InputField label="Email" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          placeholder="••••••••"
          icon={Lock}
          rightIcon={passwordVisible ? EyeOff : Eye}
          onRightIconClick={() => setPasswordVisible(!passwordVisible)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <PasswordValidationItem isValid={passwordValidations.length} text="At least 8 characters" />
          <PasswordValidationItem isValid={passwordValidations.uppercase} text="One uppercase letter" />
          <PasswordValidationItem isValid={passwordValidations.lowercase} text="One lowercase letter" />
          <PasswordValidationItem isValid={passwordValidations.number} text="One number" />
          <PasswordValidationItem isValid={passwordValidations.special} text="One special character" />
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

const PasswordValidationItem = ({ isValid, text }) => (
  <div className={`flex items-center gap-2 ${isValid ? 'text-green-600' : 'text-slate-500'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-green-600' : 'bg-slate-300'}`}></div>
    <span>{text}</span>
  </div>
);

const InputField = ({ label, type, placeholder, icon: Icon, rightIcon: RightIcon, onRightIconClick, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      />
      {RightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button type="button" onClick={onRightIconClick} className="focus:outline-none">
            <RightIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default AuthPage;
