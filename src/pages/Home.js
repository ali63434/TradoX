import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaChartLine, FaWallet, FaHistory, FaUserCircle, FaTrophy, FaLightbulb, FaBitcoin, FaEthereum, FaDollarSign, FaStar, FaFire, FaGift, FaBell, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NotificationBell from '../components/NotificationBell';

// Animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(38, 208, 206, 0.5); }
  50% { box-shadow: 0 0 20px rgba(38, 208, 206, 0.8); }
  100% { box-shadow: 0 0 5px rgba(38, 208, 206, 0.5); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(120deg, #0f2027, #2c5364, #232526, #1a2980, #26d0ce);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 12s ease-in-out infinite;
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23232536' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 0;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  position: relative;
  background: linear-gradient(180deg, rgba(26, 26, 29, 0.95) 0%, rgba(26, 26, 29, 0.8) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #b0b8c1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #b0b8c1;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1.5px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  color: #b0b8c1;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1.5px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
    border-color: #26d0ce;
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1.75rem;
  box-shadow: 0 4px 15px rgba(38, 208, 206, 0.3);
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    animation: ${glowAnimation} 2s infinite;
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #b0b8c1;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const StartTradingButton = styled.button`
  background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(38, 208, 206, 0.4);
  }
`;

const SparklineContainer = styled.div`
  height: 50px;
  margin-top: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.5rem;
`;

const UserDetails = styled.div`
  color: #ffffff;
`;

const UserName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #b0b8c1;
`;

const MarketNewsContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 2rem 0;
  padding: 1rem 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
`;

const NewsScroll = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  min-width: max-content;
`;

const NewsItem = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 10px;
  padding: 1rem;
  min-width: 250px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PromoBanner = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0033cc 0%, #26d0ce 100%);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const PerformanceBadge = styled.div`
  background: ${props => {
    switch(props.level) {
      case 'Pro': return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
      case 'Intermediate': return 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
      default: return 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LeaderboardPreview = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserTip = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RecentHighlights = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const HighlightCard = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BalanceBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const BalanceCard = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CurrencySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CurrencyButton = styled.button`
  background: ${props => props.active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const MarketTicker = styled.div`
  width: 100%;
  overflow: hidden;
  background: rgba(26, 26, 29, 0.95);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
`;

const TickerScroll = styled.div`
  display: flex;
  gap: 2rem;
  animation: ticker 30s linear infinite;
  
  @keyframes ticker {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

const WinRateMeter = styled.div`
  width: 150px;
  height: 150px;
  margin: 1rem auto;
`;

const DailyChallenges = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
`;

const ChallengeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  
  &:last-child {
    border-bottom: none;
  }
`;

const AchievementsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const AchievementBadge = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  }
`;

const BalanceHistory = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  height: 200px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(26, 26, 29, 0.95);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
    border-color: #26d0ce;
  }
`;

const FeatureTitle = styled.h3`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(38, 208, 206, 0.4);
  }
`;

const Home = () => {
  const { currentUser } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [walletData] = useState([30, 40, 35, 50, 49, 60, 70, 91, 125]);
  const [historyData] = useState([20, 30, 25, 40, 39, 50, 60, 81, 115]);
  
  const [stats] = useState({
    balance: {
      available: 1000,
      frozen: 500,
      totalEarnings: 2500,
      currencies: {
        BTC: { available: 0.5, frozen: 0.2, totalEarnings: 1.2 },
        ETH: { available: 5, frozen: 2, totalEarnings: 12 },
        USDT: { available: 1000, frozen: 500, totalEarnings: 2500 }
      }
    },
    balanceHistory: [
      { date: 'Mon', value: 1000 },
      { date: 'Tue', value: 1200 },
      { date: 'Wed', value: 1150 },
      { date: 'Thu', value: 1300 },
      { date: 'Fri', value: 1400 },
      { date: 'Sat', value: 1350 },
      { date: 'Sun', value: 1500 }
    ],
    winRate: 75,
    dailyChallenges: [
      { task: 'Complete 5 trades', reward: '50 XP', progress: 3, total: 5 },
      { task: 'Win 3 trades', reward: '100 XP', progress: 2, total: 3 },
      { task: 'Trade 3 different pairs', reward: '75 XP', progress: 1, total: 3 }
    ],
    achievements: [
      { name: 'First Trade', icon: <FaStar />, unlocked: true },
      { name: 'Win Streak', icon: <FaFire />, unlocked: true },
      { name: 'Top Trader', icon: <FaTrophy />, unlocked: false },
      { name: 'Risk Taker', icon: <FaChartLine />, unlocked: false }
    ],
    competition: {
      rewards: [
        { place: '1', reward: '$100' },
        { place: '2', reward: '$50' },
        { place: '3', reward: '$25' }
      ],
      endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
      currentRank: 15,
      nextRank: 10,
      pointsToNext: 250,
      totalPoints: 750,
      xp: { current: 60, total: 100 }
    },
    actions: [
      { task: 'Complete 5 trades today', reward: '10 points', completed: false },
      { task: 'Win 3 trades', reward: '15 points', completed: false },
      { task: 'Trade 3 different pairs', reward: '20 points', completed: false }
    ],
    upcomingRewards: [
      { condition: 'Stay in Top 10 for 3 days', reward: '$25' },
      { condition: 'Complete 20 winning trades', reward: '$50' },
      { condition: 'Reach 1000 XP', reward: 'VIP Access' }
    ],
    milestones: [
      { goal: 'Complete 20 winning trades', progress: 15, reward: '$50' },
      { goal: 'Reach 1000 XP', progress: 750, reward: 'VIP Access' },
      { goal: 'Win 5 daily challenges', progress: 3, reward: '$100' }
    ],
    marketTicker: [
      { pair: 'BTC/USDT', price: '$50,000', change: '+2.5%' },
      { pair: 'ETH/USDT', price: '$3,000', change: '+1.8%' },
      { pair: 'BNB/USDT', price: '$400', change: '-0.5%' }
    ],
    performanceLevel: 'Intermediate',
    totalTrades: 150,
    currentBalance: '$2,500',
    totalProfitLoss: '+$500',
    dailyTips: ['Use stop-loss orders to manage risk effectively'],
    recentHighlights: [
      { title: 'Best Trade', value: '+$250', description: 'BTC/USDT' },
      { title: 'Win Rate', value: '75%', description: 'Last 7 days' },
      { title: 'Total Trades', value: '150', description: 'All time' }
    ],
    leaderboard: [
      { rank: 1, name: 'Trader1', profit: '+$1,200' },
      { rank: 2, name: 'Trader2', profit: '+$950' },
      { rank: 3, name: 'Trader3', profit: '+$800' }
    ]
  });

  const [marketNews] = useState([
    {
      title: 'Bitcoin Surges Past $50k',
      source: 'Crypto News',
      time: '2h ago',
      change: '+5.2%'
    },
    {
      title: 'Ethereum 2.0 Update',
      source: 'ETH News',
      time: '4h ago',
      change: '+3.1%'
    },
    {
      title: 'New Trading Pairs Added',
      source: 'Exchange Update',
      time: '6h ago',
      change: '0%'
    }
  ]);

  return (
    <PageContainer>
      <NotificationBell />
      
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Welcome to TradoX – Compete, Trade, Win!</HeroTitle>
          <HeroSubtitle>
            Join our trading competition platform where you can trade with virtual funds and win real prizes.
            Compete with traders worldwide and climb the leaderboard!
          </HeroSubtitle>
          <FeaturesGrid>
            <FeatureCard>
              <FaTrophy size={24} />
              <h3>Daily & Weekly Tournaments</h3>
              <p>Compete in regular trading contests with real prizes</p>
            </FeatureCard>
            <FeatureCard>
              <FaChartLine size={24} />
              <h3>Risk-Free Trading</h3>
              <p>Practice with virtual funds before trading real money</p>
            </FeatureCard>
            <FeatureCard>
              <FaGift size={24} />
              <h3>Earn Rewards & Badges</h3>
              <p>Win prizes and unlock achievements as you progress</p>
            </FeatureCard>
          </FeaturesGrid>
          <CTAButton as={Link} to="/trading">
            Get Started Now
          </CTAButton>
        </HeroSection>

        <UserInfo>
          <UserAvatar>
            <FaUserCircle />
          </UserAvatar>
          <UserDetails>
            <UserName>{currentUser?.email?.split('@')[0]}</UserName>
            <UserEmail>{currentUser?.email}</UserEmail>
            <PerformanceBadge level={stats.performanceLevel}>
              <FaTrophy />
              {stats.performanceLevel}
            </PerformanceBadge>
          </UserDetails>
        </UserInfo>

        <StatsContainer>
          <StatCard>
            <StatIcon>
              <FaChartLine />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Trades</StatLabel>
              <StatValue>{stats.totalTrades}</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaWallet />
            </StatIcon>
            <StatInfo>
              <StatLabel>Current Balance</StatLabel>
              <StatValue>{stats.currentBalance}</StatValue>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaHistory />
            </StatIcon>
            <StatInfo>
              <StatLabel>Total Profit/Loss</StatLabel>
              <StatValue style={{ color: stats.totalProfitLoss.startsWith('+') ? '#4ade80' : '#f87171' }}>
                {stats.totalProfitLoss}
              </StatValue>
            </StatInfo>
          </StatCard>
        </StatsContainer>

        <MarketNewsContainer>
          <NewsScroll>
            {marketNews.map((news, index) => (
              <NewsItem key={index}>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>{news.title}</div>
                <div style={{ 
                  color: news.change.startsWith('-') ? '#f87171' : 
                         news.change.startsWith('+') ? '#4ade80' : '#b0b8c1',
                  fontSize: '0.875rem'
                }}>
                  {news.change}
                </div>
              </NewsItem>
            ))}
          </NewsScroll>
        </MarketNewsContainer>

        <PromoBanner>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Join the Trading Challenge!
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            Win up to $100 in our weekly trading competition
          </p>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontWeight: 600,
            marginTop: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Learn More
          </button>
        </PromoBanner>

        <UserTip>
          <FaLightbulb style={{ color: '#FFD700', fontSize: '1.5rem' }} />
          <div>
            <div style={{ color: '#ffffff', fontWeight: 600 }}>Pro Tip</div>
            <div style={{ color: '#b0b8c1' }}>{stats.dailyTips[0]}</div>
          </div>
        </UserTip>

        <RecentHighlights>
          {stats.recentHighlights.map((highlight, index) => (
            <HighlightCard key={index}>
              <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>{highlight.title}</div>
              <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 600 }}>
                {highlight.value}
              </div>
              <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>{highlight.description}</div>
            </HighlightCard>
          ))}
        </RecentHighlights>

        <LeaderboardPreview>
          <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
            Global Leaderboard
          </div>
          {stats.leaderboard.map((trader, index) => (
            <LeaderboardItem key={index}>
              <div style={{ color: '#b0b8c1', width: '2rem' }}>#{trader.rank}</div>
              <div style={{ color: '#ffffff', flex: 1 }}>{trader.name}</div>
              <div style={{ color: '#4ade80' }}>{trader.profit}</div>
            </LeaderboardItem>
          ))}
        </LeaderboardPreview>

        <CardsContainer>
          <Card to="/trading">
            <CardIcon>
              <FaChartLine />
            </CardIcon>
            <CardTitle>Trading</CardTitle>
            <CardDescription>
              Access real-time market data, execute trades, and monitor your positions with our advanced trading interface.
            </CardDescription>
            <StartTradingButton>Start Trading</StartTradingButton>
          </Card>

          <Card to="/wallet">
            <CardIcon>
              <FaWallet />
            </CardIcon>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>
              Manage your funds, view transaction history, and track your portfolio performance in one secure place.
            </CardDescription>
            <SparklineContainer>
              <Sparklines data={walletData} width={200} height={50} margin={5}>
                <SparklinesLine color="#26d0ce" style={{ strokeWidth: 2 }} />
              </Sparklines>
            </SparklineContainer>
          </Card>

          <Card to="/history">
            <CardIcon>
              <FaHistory />
            </CardIcon>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Review your past trades, analyze your performance, and make data-driven decisions for future trades.
            </CardDescription>
            <SparklineContainer>
              <Sparklines data={historyData} width={200} height={50} margin={5}>
                <SparklinesLine color="#26d0ce" style={{ strokeWidth: 2 }} />
              </Sparklines>
            </SparklineContainer>
          </Card>
        </CardsContainer>

        <MarketTicker>
          <TickerScroll>
            {(stats?.marketTicker || []).map((item, index) => (
              <TickerItem key={index}>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{item?.pair || 'N/A'}</span>
                <span style={{ color: '#b0b8c1' }}>{item?.price || 'N/A'}</span>
                <span style={{ 
                  color: item?.change ? (
                    item.change.startsWith('+') ? '#4ade80' : 
                    item.change.startsWith('-') ? '#f87171' : '#b0b8c1'
                  ) : '#b0b8c1'
                }}>
                  {item?.change || '0%'}
                </span>
              </TickerItem>
            ))}
          </TickerScroll>
        </MarketTicker>

        <CurrencySelector>
          {Object.keys(stats.balance.currencies).map(currency => (
            <CurrencyButton
              key={currency}
              active={selectedCurrency === currency}
              onClick={() => setSelectedCurrency(currency)}
            >
              {currency === 'BTC' ? <FaBitcoin /> :
               currency === 'ETH' ? <FaEthereum /> :
               <FaDollarSign />}
              {currency}
            </CurrencyButton>
          ))}
        </CurrencySelector>

        <BalanceBreakdown>
          <BalanceCard>
            <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>Available Balance</div>
            <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 600 }}>
              {selectedCurrency} {stats.balance.available.toFixed(2)}
            </div>
          </BalanceCard>
          <BalanceCard>
            <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>Frozen Balance</div>
            <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 600 }}>
              {selectedCurrency} {stats.balance.frozen.toFixed(2)}
            </div>
          </BalanceCard>
          <BalanceCard>
            <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>Total Earnings</div>
            <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 600 }}>
              {selectedCurrency} {stats.balance.totalEarnings.toFixed(2)}
            </div>
          </BalanceCard>
        </BalanceBreakdown>

        <BalanceHistory>
          <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
            Balance History (7 Days)
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={stats.balanceHistory}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#26d0ce" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#26d0ce" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#b0b8c1" />
              <YAxis stroke="#b0b8c1" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(26, 26, 29, 0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#26d0ce"
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </BalanceHistory>

        <WinRateMeter>
          <CircularProgressbar
            value={stats.winRate}
            text={`${stats.winRate}%`}
            styles={buildStyles({
              pathColor: '#26d0ce',
              textColor: '#ffffff',
              trailColor: 'rgba(255,255,255,0.1)'
            })}
          />
          <div style={{ textAlign: 'center', color: '#b0b8c1', marginTop: '0.5rem' }}>
            Win Rate (7 Days)
          </div>
        </WinRateMeter>

        <DailyChallenges>
          <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem' }}>
            Daily Challenges
          </div>
          {stats.dailyChallenges.map((challenge, index) => (
            <ChallengeItem key={index}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#ffffff' }}>{challenge.task}</div>
                <div style={{ color: '#b0b8c1', fontSize: '0.875rem' }}>
                  Reward: {challenge.reward}
                </div>
              </div>
              <div style={{ color: '#26d0ce' }}>
                {challenge.progress}/{challenge.total}
              </div>
            </ChallengeItem>
          ))}
        </DailyChallenges>

        <AchievementsPanel>
          {stats.achievements.map((achievement, index) => (
            <AchievementBadge key={index}>
              <div style={{ 
                color: achievement.unlocked ? '#FFD700' : '#b0b8c1',
                fontSize: '1.5rem'
              }}>
                {achievement.icon}
              </div>
              <div style={{ 
                color: achievement.unlocked ? '#ffffff' : '#b0b8c1',
                fontSize: '0.875rem'
              }}>
                {achievement.name}
              </div>
            </AchievementBadge>
          ))}
        </AchievementsPanel>
      </ContentContainer>
    </PageContainer>
  );
};

export default Home; 