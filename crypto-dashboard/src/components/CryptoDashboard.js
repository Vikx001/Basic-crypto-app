import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import './CryptoDashboard.css';

Chart.register(...registerables, CandlestickController, CandlestickElement);

const CryptoDashboard = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartType, setChartType] = useState('line');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crypto');
        const prices = response.data.map((coin) => coin.current_price);
        const coinLabels = response.data.map((coin) => coin.name);
        setData(prices);
        setLabels(coinLabels);
        setCryptoData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching the crypto data', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.length > 0 && labels.length > 0) {
      const chartConfig = {
        type: chartType,
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cryptocurrency Prices',
              data: data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuad',
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14,
                },
              },
            },
            title: {
              display: true,
              text: 'Cryptocurrency Market Prices',
              color: '#333',
              font: {
                size: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: { size: 16 },
              bodyFont: { size: 14 },
              callbacks: {
                label: function (context) {
                  return `$${context.raw.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Cryptocurrency',
                color: '#333',
                font: {
                  size: 16,
                },
              },
              grid: {
                display: false,
              },
              ticks: {
                color: '#333',
              },
            },
            y: {
              type: chartType === 'bar' ? 'logarithmic' : 'linear',
              beginAtZero: false,
              title: {
                display: true,
                text: 'Price (USD)',
                color: '#333',
                font: {
                  size: 16,
                },
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.3)',
              },
              ticks: {
                color: '#333',
                callback: function (value) {
                  return `$${value}`;
                },
              },
            },
          },
        },
      };

      if (chartType === 'candlestick') {
        chartConfig.type = 'candlestick';
        chartConfig.data.datasets[0] = {
          label: 'Cryptocurrency Prices',
          data: cryptoData.map((coin) => ({
            x: new Date(coin.last_updated),
            o: coin.current_price - coin.price_change_24h,
            h: coin.high_24h,
            l: coin.low_24h,
            c: coin.current_price,
          })),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        };
        chartConfig.options.scales = {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Date',
              color: '#333',
              font: {
                size: 16,
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#333',
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Price (USD)',
              color: '#333',
              font: {
                size: 16,
              },
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.3)',
            },
            ticks: {
              color: '#333',
            },
          },
        };
      }

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, chartConfig);
    }
  }, [data, labels, chartType, cryptoData]);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin === selectedCoin ? null : coin);
    if (coin !== selectedCoin) {
      const filteredData = [coin.current_price];
      const filteredLabels = [coin.name];
      const chartConfig = {
        type: chartType === 'candlestick' ? 'candlestick' : 'line',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: `${coin.name} Price`,
              data: filteredData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuad',
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14,
                },
              },
            },
            title: {
              display: true,
              text: `${coin.name} Price`,
              color: '#333',
              font: {
                size: 20,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: { size: 16 },
              bodyFont: { size: 14 },
              callbacks: {
                label: function (context) {
                  return `$${context.raw.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Cryptocurrency',
                color: '#333',
                font: {
                  size: 16,
                },
              },
              grid: {
                display: false,
              },
              ticks: {
                color: '#333',
              },
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Price (USD)',
                color: '#333',
                font: {
                  size: 16,
                },
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.3)',
              },
              ticks: {
                color: '#333',
              },
            },
          },
        },
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, chartConfig);
    } else {
      // Reset to default chart
      setData(cryptoData.map((coin) => coin.current_price));
      setLabels(cryptoData.map((coin) => coin.name));
    }
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div className="CryptoDashboard">
      <h1>Crypto Dashboard</h1>
      {error ? <p className="error">{error}</p> : null}
      <div className="chart-type-selector">
        <label htmlFor="chartType">Select Chart Type:</label>
        <select id="chartType" value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="candlestick">Candlestick Chart</option>
        </select>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} id="cryptoChart"></canvas>
      </div>
      <div className="crypto-icons">
        {cryptoData.map((coin) => (
          <div key={coin.id} className="crypto-icon" onClick={() => handleCoinClick(coin)}>
            <img src={coin.image} alt={coin.name} className="crypto-image" />
            <p>{coin.symbol.toUpperCase()}</p>
          </div>
        ))}
      </div>
      {selectedCoin && (
        <div className="crypto-details">
          <div key={selectedCoin.id} className="crypto-card">
            <img src={selectedCoin.image} alt={selectedCoin.name} className="crypto-image" />
            <h2>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</h2>
            <p>Current Price: ${selectedCoin.current_price.toLocaleString()}</p>
            <p>Market Cap: ${selectedCoin.market_cap.toLocaleString()}</p>
            <p>Total Volume: ${selectedCoin.total_volume.toLocaleString()}</p>
            <p>High 24h: ${selectedCoin.high_24h.toLocaleString()}</p>
            <p>Low 24h: ${selectedCoin.low_24h.toLocaleString()}</p>
            <p>Price Change 24h: ${selectedCoin.price_change_24h.toLocaleString()}</p>
            <p>Price Change % 24h: {selectedCoin.price_change_percentage_24h.toFixed(2)}%</p>
          </div>
          <div className="comparison-window">
            <h3>Comparison</h3>
            {cryptoData
              .filter((coin) => coin.id !== selectedCoin.id)
              .map((coin) => (
                <div key={coin.id} className="comparison-item">
                  <p>{coin.name}: ${coin.current_price.toLocaleString()}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
