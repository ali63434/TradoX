import { useState } from 'react';
import styled from 'styled-components';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const PanelContainer = styled.div`
  background: #1e293b;
  padding: 20px;
  border-top: 1px solid #334155;
`;

const TimeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TimeButton = styled.button`
  background: ${props => props.active ? '#26d0ce' : '#334155'};
  color: ${props => props.active ? '#0f172a' : '#94a3b8'};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#26d0ce' : '#475569'};
  }
`;

const AmountInput = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  color: #94a3b8;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  background: #334155;
  border: 1px solid #475569;
  color: #f8fafc;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #26d0ce;
  }
`;

const PayoutInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #94a3b8;
  font-size: 14px;
`;

const TradeButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const TradeButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.buy {
    background: #26d0ce;
    color: #0f172a;

    &:hover {
      background: #22b8b6;
    }
  }

  &.sell {
    background: #ef4444;
    color: #f8fafc;

    &:hover {
      background: #dc2626;
    }
  }
`;

const TradePanel = () => {
  const [selectedTime, setSelectedTime] = useState('1m');
  const [amount, setAmount] = useState('100');

  const timeOptions = [
    { value: '1m', label: '1M' },
    { value: '5m', label: '5M' },
    { value: '15m', label: '15M' },
    { value: '30m', label: '30M' },
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '1d', label: '1D' },
  ];

  const handleTrade = (type) => {
    console.log(`Placing ${type} trade for ${amount} with ${selectedTime} expiry`);
  };

  return (
    <PanelContainer>
      <TimeSelector>
        {timeOptions.map(option => (
          <TimeButton
            key={option.value}
            active={selectedTime === option.value}
            onClick={() => setSelectedTime(option.value)}
          >
            {option.label}
          </TimeButton>
        ))}
      </TimeSelector>

      <AmountInput>
        <InputLabel>Amount</InputLabel>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
      </AmountInput>

      <PayoutInfo>
        <span>Payout</span>
        <span>${(parseFloat(amount) * 0.85).toFixed(2)}</span>
      </PayoutInfo>

      <TradeButtons>
        <TradeButton className="buy" onClick={() => handleTrade('buy')}>
          <FaArrowUp />
          Buy
        </TradeButton>
        <TradeButton className="sell" onClick={() => handleTrade('sell')}>
          <FaArrowDown />
          Sell
        </TradeButton>
      </TradeButtons>
    </PanelContainer>
  );
};

export default TradePanel; 