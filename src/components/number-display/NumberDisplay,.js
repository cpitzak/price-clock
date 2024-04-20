import React, { useEffect, useState } from 'react';
import styles from './NumberDisplay.module.css';

const NumberDisplay = () => {
  const [bitcoinPriceDigits, setBitcoinPriceDigits] = useState([]);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        if (data.bitcoin && data.bitcoin.usd) {
          // Convert the price to a string and split into individual digits
          const priceDigits = data.bitcoin.usd.toString().split('').map(digit => digit === '.' ? '.' : parseInt(digit));
          setBitcoinPriceDigits(priceDigits);
        }
      } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        setBitcoinPriceDigits(['Error']); // Display error in UI
      }
    };

    const seconds = 60 * 1000;
    fetchBitcoinPrice(); // Fetch immediately on component mount
    const intervalId = setInterval(fetchBitcoinPrice, seconds); // Fetch every 5000 milliseconds (5 seconds)

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className={styles.container}>
      {bitcoinPriceDigits.length > 0 ? (
        bitcoinPriceDigits.map((digit, index) => (
          <div key={index} className={styles.numberBox}>
            <span className={styles.number}>{digit}</span>
          </div>
        ))
      ) : (
        <div className={styles.numberBox}>
          <span className={styles.number}>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default NumberDisplay;
