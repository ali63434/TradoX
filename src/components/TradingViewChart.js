import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewChart = ({ symbol, interval }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#0b1320' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#192231' },
          horzLines: { color: '#192231' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26d0ce',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#26d0ce',
        wickDownColor: '#ef4444',
      });

      // Generate random data for demonstration
      const generateData = () => {
        const data = [];
        let basePrice = 100;
        const now = new Date();
        // 100 candles, 1 minute apart
        for (let i = 0; i < 100; i++) {
          // Each candle is 1 minute apart
          const time = Math.floor((now.getTime() - (100 - i) * 60000) / 1000); // UNIX timestamp in seconds
          const open = basePrice;
          const high = basePrice + Math.random() * 10;
          const low = basePrice - Math.random() * 10;
          const close = low + Math.random() * (high - low);
          data.push({
            time, // UNIX timestamp in seconds
            open,
            high,
            low,
            close,
          });
          basePrice = close;
        }
        return data;
      };

      const data = generateData();
      candlestickSeries.setData(data);
      chart.timeScale().fitContent();

      chartRef.current = chart;

      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [symbol, interval]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-[400px] bg-[#0b1320] rounded shadow-md"
    />
  );
};

export default TradingViewChart; 