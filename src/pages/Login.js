import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from "styled-components";
import logo from '../assets/logo.jpg';
import { signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

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
    }
    setLoading(false);
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
    <PageContainer>
      <LoginContainer>
        <LogoSection>
          <LogoGlow src={logo} alt="TradoX Logo" />
          <Title>Welcome to TradoX</Title>
          <Subtitle>
            Haven't registered yet?{" "}
            <StyledLink to="/register">Sign up</StyledLink>
          </Subtitle>
        </LogoSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </FormGroup>

          <FormOptions>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <CheckboxLabel htmlFor="remember">Remember me</CheckboxLabel>
            </CheckboxContainer>
            <ForgotPassword as="button" onClick={() => setShowResetModal(true)}>
              Forgot password?
            </ForgotPassword>
          </FormOptions>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </LoginButton>

          <Divider>
            <DividerText>Or log in with</DividerText>
          </Divider>

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
            {loading ? "Signing in..." : "Sign in with Google"}
          </GoogleButton>
        </Form>

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
      </LoginContainer>

      {showResetModal && (
        <ModalOverlay onClick={() => setShowResetModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setShowResetModal(false)}>&times;</CloseButton>
            <Title>Reset Password</Title>
            {resetSuccess ? (
              <SuccessMessage>
                Password reset email sent. Please check your inbox.
              </SuccessMessage>
            ) : (
              <>
                {resetError && <ErrorMessage>{resetError}</ErrorMessage>}
                <Form onSubmit={handlePasswordReset}>
                  <FormGroup>
                    <Label htmlFor="resetEmail">Email address</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={resetLoading}
                    />
                  </FormGroup>
                  <LoginButton type="submit" disabled={resetLoading}>
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </LoginButton>
                </Form>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default LoginPage; 