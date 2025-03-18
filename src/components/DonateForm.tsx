import React, { useState } from "react";

const DonateForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (amount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to process donation.");
      }

      setSuccess(true);
      setAmount(0);
      setMessage("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Donate</h2>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message (optional):</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Thank you for your donation!</p>
      )}
      <button type="submit">Donate</button>
    </form>
  );
};

export default DonateForm;
