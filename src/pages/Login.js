import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from "styled-components";
import logo from '../assets/logo.jpg';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(120deg, #0f2027, #2c5364, #232526, #1a2980, #26d0ce);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 12s ease-in-out infinite;
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const LoginContainer = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 20px;
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 410px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255,255,255,0.08);
  position: relative;
  z-index: 1;
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem 1.5rem 0.75rem;
  }
`;

const LogoGlow = styled.img`
  display: block;
  margin: 0 auto 1.5rem auto;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  box-shadow: 0 0 32px 8px #26d0ce99, 0 0 0 4px #0033cc33;
  transition: box-shadow 0.4s;
  background: #121214;
  &:hover {
    box-shadow: 0 0 48px 16px #26d0cecc, 0 0 0 8px #0033cc55;
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.p`
  color: #b0b8c1;
  font-size: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(38, 38, 43, 0.98);
  border: 1.5px solid #232536;
  border-radius: 10px;
  color: #ffffff;
  padding: 13px 14px;
  font-size: 15px;
  width: 100%;
  box-shadow: 0 1.5px 8px 0 rgba(0,0,0,0.04);
  transition: border 0.2s, box-shadow 0.2s;
  &::placeholder {
    color: #7a7a8c;
  }
  &:focus {
    outline: none;
    border-color: #26d0ce;
    box-shadow: 0 0 0 2px #26d0ce55;
  }
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  accent-color: #26d0ce;
`;

const CheckboxLabel = styled.label`
  color: #b0b8c1;
  font-size: 14px;
`;

const ForgotPassword = styled(Link)`
  color: #b0b8c1;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #26d0ce;
    text-decoration: underline;
  }
`;

const LoginButtonGlow = keyframes`
  0% { box-shadow: 0 0 0 0 #26d0ce55; }
  50% { box-shadow: 0 0 16px 4px #26d0cecc; }
  100% { box-shadow: 0 0 0 0 #26d0ce55; }
`;

const LoginButton = styled.button`
  background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 13px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px 0 #0033cc22;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  animation: ${LoginButtonGlow} 2.5s infinite;
  &:hover {
    background: linear-gradient(90deg, #26d0ce 0%, #0033cc 100%);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 24px 0 #26d0ce55;
  }
  &:active {
    background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
    transform: scale(0.98);
    box-shadow: 0 1px 6px 0 #0033cc33;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: none;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 1.2rem 0 1rem 0;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #232536;
  }
`;

const DividerText = styled.span`
  background: rgba(26, 26, 29, 0.95);
  color: #b0b8c1;
  padding: 0 1rem;
  font-size: 14px;
  position: relative;
`;

const GoogleButton = styled(LoginButton)`
  background: #232536;
  background-image: none;
  color: #ffffff;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 12px 0 #23253633;
  animation: none;
  &:hover {
    background: #232536;
    color: #26d0ce;
    box-shadow: 0 4px 24px 0 #26d0ce33;
  }
  &:disabled {
    background: #232536;
    color: #b0b8c1;
    box-shadow: none;
  }
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #ffffff;
`;

const Footer = styled.footer`
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #232536;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #b0b8c1;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #26d0ce;
    text-decoration: underline;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Age21Plus = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  background-color: #232536;
  padding: 4px 8px;
  border-radius: 6px;
`;

const Copyright = styled.span`
  color: #b0b8c1;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.12);
  color: #ff4444;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 1.5px 8px 0 rgba(255,0,0,0.04);
`;

const StyledLink = styled(Link)`
  color: #26d0ce;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: #0033cc;
    text-decoration: underline;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255,255,255,0.08);
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b0b8c1;
  font-size: 24px;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    color: #ffffff;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(38, 208, 206, 0.12);
  color: #26d0ce;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 1.5px 8px 0 rgba(38, 208, 206, 0.04);
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      setResetError(error.message || 'Failed to send password reset email. Please try again.');
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to TradoX
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 