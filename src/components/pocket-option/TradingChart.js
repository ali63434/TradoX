import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const TradingChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('trading-chart').getContext('2d');
    const config = {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: 'Price',
          data: Array.from({ length: 24 }, () => Math.random() * 100),
          borderColor: '#0060FF',
          backgroundColor: 'rgba(0, 96, 255, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-[400px] bg-white dark:bg-[#1C1C25] rounded-[15px] p-4">
      <canvas id="trading-chart"></canvas>
    </div>
  );
};

export default TradingChart;