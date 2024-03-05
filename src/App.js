import React, { useState } from 'react';
import './App.css'; // Import CSS file for styling
import Payment from './Payment'; // Import Payment component

function App() {
  const [count, setCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 2) {
      setCount(count - 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPayment(true);
    // Handle form submission
  };

  return (
    <div className="page-container">
      <div className="container">
        <header className="App-header">
          <h1 className="main-heading">PocketPals</h1>
          <h2 className="sub-heading">Your effortless solution for splitting group expenses! Effortlessly split bills and settle debts within your circles.</h2>
          {!showPayment ? (
            <div className="box">
              <h3>Settle up!</h3>
              <div className="counter">
                <button onClick={handleDecrement}>-</button>
                <span>{count}</span>
                <button onClick={handleIncrement}>+</button>
              </div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="description">Enter a description:</label>
                <input type="text" id="description" />
                <button type="submit">Go!</button>
              </form>
            </div>
          ) : (
            <Payment count={count} />
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
