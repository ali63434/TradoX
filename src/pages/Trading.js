import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaWallet, FaChevronDown, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TradingViewChart from '../components/TradingViewChart';

const Trading = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedType, setSelectedType] = useState('spot');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('');
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1");
  const [balance, setBalance] = useState(100);
  const [timer, setTimer] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [tradeAmount] = useState(5);

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
      }
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{symbol}</span>
          <FaChevronDown />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaClock />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-lg font-bold">${balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 mb-4 h-[400px]">
        <TradingViewChart symbol={symbol} interval={interval} />
      </div>

      <div className="flex flex-col items-center md:flex-row md:justify-center gap-4">
        <button 
          onClick={() => handleTrade("buy")} 
          className="bg-green-500 hover:bg-green-600 px-8 py-2 rounded-lg font-bold text-white transition"
        >
          BUY
        </button>
        <button 
          onClick={() => handleTrade("sell")} 
          className="bg-red-500 hover:bg-red-600 px-8 py-2 rounded-lg font-bold text-white transition"
        >
          SELL
        </button>
      </div>

      {timer !== null && (
        <div className="text-center mt-4 text-lg font-semibold">
          Trade ends in: {timer}s
        </div>
      )}

      {outcome && (
        <div className={`text-center mt-2 text-lg font-bold ${outcome === 'win' ? 'text-green-400' : 'text-red-400'}`}>
          You {outcome === 'win' ? 'Won!' : 'Lost!'}
        </div>
      )}
    </div>
  );
};

export default Trading; 