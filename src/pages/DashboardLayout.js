import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaWallet, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import UserMenu from '../components/UserMenu';
import TradingViewChart from '../components/TradingViewChart';
import NotificationBell from '../components/NotificationBell';
import SettingsMenu from '../components/SettingsMenu';
import SupportChat from '../components/SupportChat';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #1a1a1d;
  color: white;
`;

const Sidebar = styled.aside`
  width: 16rem;
  background-color: #2d2d30;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Logo = styled.span`
  font-size: 1.875rem;
  color: #26d0ce;
`;

const LogoLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? '#3d3d40' : 'transparent'};

  &:hover {
    background-color: #3d3d40;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  color: white;
  margin-top: auto;

  &:hover {
    background-color: #3d3d40;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
  border: none;
  color: white;

  &:hover {
    background-color: #3d3d40;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [symbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1");
  const [balance, setBalance] = useState(100);
  const [timer, setTimer] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [tradeAmount] = useState(5);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleTrade = (direction) => {
    if (timer) return;

    setOutcome(null);
    setTimer(3);
    let countdown = 3;

    const intervalId = setInterval(() => {
      countdown--;
      setTimer(countdown);

      if (countdown <= 0) {
        clearInterval(intervalId);
        setTimer(null);

        const win = Math.random() > 0.5;
        const profit = win ? tradeAmount * 0.8 : -tradeAmount;
        const result = win ? 'win' : 'lose';

        setBalance(prev => prev + profit);
        setOutcome(result);

        const trade = {
          direction,
          result,
          amount: profit.toFixed(2),
          time: new Date().toLocaleTimeString(),
          pair: symbol,
        };

        setHistory(prev => [trade, ...prev.slice(0, 9)]);

        // Store trade in Firestore
        addDoc(collection(db, "trades"), trade)
          .then(() => console.log("Trade saved to Firestore"))
          .catch((error) => console.error("Error saving trade:", error));
      }
    }, 1000);
  };

  return (
    <LayoutContainer>
      <Sidebar isCollapsed={isCollapsed}>
        <LogoContainer>
          <Logo>TradoX</Logo>
          {!isCollapsed && <LogoLabel>TradoX</LogoLabel>}
        </LogoContainer>

        <Nav>
          <NavItem 
            active={isActive('/dashboard')} 
            onClick={() => navigate('/dashboard')}
          >
            <FaHome />
            {!isCollapsed && <span>Home</span>}
          </NavItem>
          <NavItem 
            active={isActive('/trading')} 
            onClick={() => navigate('/trading')}
          >
            <FaChartLine />
            {!isCollapsed && <span>Trading</span>}
          </NavItem>
          <NavItem 
            active={isActive('/wallet')} 
            onClick={() => navigate('/wallet')}
          >
            <FaWallet />
            {!isCollapsed && <span>Wallet</span>}
          </NavItem>
          <NavItem 
            active={isActive('/history')} 
            onClick={() => navigate('/history')}
          >
            <FaHistory />
            {!isCollapsed && <span>History</span>}
          </NavItem>
        </Nav>

        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </LogoutButton>
      </Sidebar>

      <MainContent>
        <Header>
          <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? '→' : '←'}
          </ToggleButton>
          <UserMenu />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </MainContent>

      <SupportChat />
    </LayoutContainer>
  );
};

export default DashboardLayout; 