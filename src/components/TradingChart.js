import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createChart } from 'lightweight-charts';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #0f172a;
  position: relative;
`;

const ExpirationLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(38, 208, 206, 0.5);
  z-index: 1;
`;

const ExpirationLabel = styled.div`
  position: absolute;
  top: 10px;
  left: ${props => props.left}px;
  background: rgba(38, 208, 206, 0.1);
  color: #26d0ce;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
`;

const TradingChart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#0f172a' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#1e293b' },
          horzLines: { color: '#1e293b' },
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

      // Sample data
      const data = [
        { time: '2024-01-01', open: 100, high: 105, low: 98, close: 103 },
        { time: '2024-01-02', open: 103, high: 107, low: 102, close: 105 },
        { time: '2024-01-03', open: 105, high: 108, low: 104, close: 106 },
        { time: '2024-01-04', open: 106, high: 110, low: 105, close: 108 },
        { time: '2024-01-05', open: 108, high: 112, low: 107, close: 109 },
      ];

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
  }, []);

  return (
    <ChartContainer ref={chartContainerRef}>
      <ExpirationLine style={{ left: '75%' }} />
      <ExpirationLabel left={chartContainerRef.current?.clientWidth * 0.75 - 30}>
        S15
      </ExpirationLabel>
    </ChartContainer>
  );
};

export default TradingChart; 