import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

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

const RegisterContainer = styled.div`
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

const RegisterButtonGlow = keyframes`
  0% { box-shadow: 0 0 0 0 #26d0ce55; }
  50% { box-shadow: 0 0 16px 4px #26d0cecc; }
  100% { box-shadow: 0 0 0 0 #26d0ce55; }
`;

const RegisterButton = styled.button`
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
  animation: ${RegisterButtonGlow} 2.5s infinite;
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

const GoogleButton = styled(RegisterButton)`
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

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, username);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account. Please try again.');
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

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join TradoX and start trading
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
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
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
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Or sign up with
          </p>
        </div>

        <GoogleButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon>
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
            </svg>
          </GoogleIcon>
          {loading ? "Signing up..." : "Sign up with Google"}
        </GoogleButton>

        <Footer>
          <FooterLinks>
            <FooterLink href="#">Contact Us</FooterLink>
            <FooterLink href="#">Anti-Money Laundering & KYC Policy</FooterLink>
            <FooterLink href="#">Payment Policy</FooterLink>
            <FooterLink href="#">Terms & Conditions</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Risk Disclosure</FooterLink>
          </FooterLinks>
          <FooterInfo>
            <Age21Plus>21+</Age21Plus>
            <Copyright>©2024 TradoX. All rights reserved.</Copyright>
          </FooterInfo>
        </Footer>
      </div>
    </div>
  );
} 