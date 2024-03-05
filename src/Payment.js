import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function Payment({ count }) {
  const [names, setNames] = useState(Array(count).fill(""));
  const [descriptions, setDescriptions] = useState(Array(count).fill(""));
  const [payments, setPayments] = useState(Array(count).fill(0));
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const handleNameChange = (index, name) => {
    const updatedNames = [...names];
    updatedNames[index] = name;
    setNames(updatedNames);
  };

  const handleDescriptionChange = (index, description) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = description;
    setDescriptions(updatedDescriptions);
  };

  const handlePaymentChange = (index, amount) => {
    const updatedPayments = [...payments];
    updatedPayments[index] = amount;
    setPayments(updatedPayments);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      setImage(reader.result);
      const { data: { text } } = await Tesseract.recognize(reader.result, 'eng', {
        tessedit_create_hocr: '1',
        hocr: true
      });

      setExtractedText(text);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const splitBill = () => {
    const totalAmount = payments.reduce((acc, curr) => acc + curr, 0);
    const individualShare = totalAmount / count;
    const debts = Array(count).fill(0).map((_, debtorIndex) => {
      const debt = individualShare - payments[debtorIndex];
      const creditors = [];
      payments.forEach((payment, creditorIndex) => {
        if (payment > individualShare) {
          creditors.push(names[creditorIndex]);
        }
      });
      return { debtor: names[debtorIndex], creditors, amount: Math.abs(debt) };
    });
    return debts.filter(debt => debt.creditors.length > 0);
  };

  const debts = splitBill();

  return (
    <div className="split-bill">
      <h2>Split the Bill</h2>
      <p>Enter the names, descriptions, and amounts paid by each person:</p>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="person">
          <div className="input-container">
            <label htmlFor={`name-${index}`}>Name:</label>
            <input
              type="text"
              id={`name-${index}`}
              value={names[index]}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <label htmlFor={`description-${index}`}>What:</label>
            <input
              type="text"
              id={`description-${index}`}
              value={descriptions[index]}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
            />
            <label htmlFor={`payment-${index}`}>Amount paid:</label>
            <input
              type="number"
              id={`payment-${index}`}
              value={payments[index]}
              onChange={(e) => handlePaymentChange(index, parseFloat(e.target.value))}
            />
          </div>
        </div>
      ))}
      <div className="ocr-section">
        <h2>OCR Bill Image</h2>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {image && <img src={image} alt="Uploaded" className="image-preview" />}
        <div className="extracted-text">{extractedText}</div>
      </div>
      <h3>Who pays whom how much:</h3>
      <ul>
        {debts.map((debt, index) => (
          <li key={index}>{debt.debtor} owes {debt.creditors.join(', ')} ₹{debt.amount.toFixed(2)}</li>
        ))}
      </ul>
      <style jsx>{`
        .split-bill {
          font-family: Arial, sans-serif;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 18px;
          margin-bottom: 10px;
          margin-top: 0;
        }

        p {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .person {
          margin-bottom: 20px;
        }

        .input-container {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        label {
          display: block;
          font-size: 16px;
          margin-bottom: 6px;
        }

        input[type="text"],
        input[type="number"] {
          width: 100%;
          border: none;
          font-size: 18px;
          padding: 8px;
          box-sizing: border-box;
          margin-bottom: 10px;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin-top: 10px;
        }

        li {
          font-size: 18px;
          margin-bottom: 6px;
        }

        .ocr-section {
          margin-top: 20px;
        }

        .ocr-section h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .image-preview {
          max-width: 100%;
          display: block;
          margin: 20px auto;
          border-radius: 5px;
        }

        .extracted-text {
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

export default Payment;
