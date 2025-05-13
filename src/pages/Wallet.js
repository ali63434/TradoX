import React, { useState } from 'react';
import { FaPlus, FaMinus, FaExchangeAlt } from 'react-icons/fa';

export default function Wallet() {
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState('');
  const [transactions] = useState([
    { id: 1, type: 'deposit', amount: 500, date: '2024-03-15', status: 'completed' },
    { id: 2, type: 'withdrawal', amount: 200, date: '2024-03-14', status: 'completed' },
    { id: 3, type: 'trade', amount: 50, date: '2024-03-13', status: 'completed' },
  ]);

  const handleDeposit = () => {
    if (!amount || amount <= 0) return;
    setBalance(prev => prev + Number(amount));
    setAmount('');
  };

  const handleWithdraw = () => {
    if (!amount || amount <= 0 || amount > balance) return;
    setBalance(prev => prev - Number(amount));
    setAmount('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="text-gray-400 mb-2">Total Balance</div>
        <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Deposit</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-gray-700 rounded px-4 py-2"
            />
            <button
              onClick={handleDeposit}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Deposit
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Withdraw</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-gray-700 rounded px-4 py-2"
            />
            <button
              onClick={handleWithdraw}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2"
            >
              <FaMinus /> Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded">
              <div className="flex items-center gap-3">
                <FaExchangeAlt className="text-gray-400" />
                <div>
                  <div className="font-semibold capitalize">{transaction.type}</div>
                  <div className="text-sm text-gray-400">{transaction.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </div>
                <div className="text-sm text-gray-400 capitalize">{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 