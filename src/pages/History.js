import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function History() {
  const trades = [
    {
      id: 1,
      symbol: 'BTCUSDT',
      type: 'buy',
      amount: 100,
      profit: 80,
      date: '2024-03-15 14:30:00',
      status: 'win'
    },
    {
      id: 2,
      symbol: 'ETHUSDT',
      type: 'sell',
      amount: 50,
      profit: -50,
      date: '2024-03-15 13:15:00',
      status: 'lose'
    },
    {
      id: 3,
      symbol: 'BTCUSDT',
      type: 'buy',
      amount: 75,
      profit: 60,
      date: '2024-03-15 12:00:00',
      status: 'win'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trade History</h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-4">Date</th>
                <th className="pb-4">Symbol</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Profit/Loss</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id} className="border-b border-gray-700">
                  <td className="py-4 text-gray-400">{trade.date}</td>
                  <td className="py-4 font-semibold">{trade.symbol}</td>
                  <td className="py-4">
                    <span className={`flex items-center gap-2 ${
                      trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.type === 'buy' ? <FaArrowUp /> : <FaArrowDown />}
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">${trade.amount}</td>
                  <td className={`py-4 font-semibold ${
                    trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      trade.status === 'win' 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 