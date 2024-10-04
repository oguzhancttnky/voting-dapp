import React, { useState } from 'react';

const Winner = ({ contract }) => {
  const [winner, setWinner] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const getWinner = async () => {
    const result = await contract.methods.Winner().call();
    const total = await contract.methods.totalSupply().call();
    setWinner(result);
    setTotalSupply(total);
  };

  return (
    <div>
      <h2>Election Result</h2>
      <button onClick={getWinner}>Get Winner</button>
      {winner && (
        <div>
          <p>Winner: {winner[0]}</p>
          <p>Winner Vote Count: {winner[1].toString()}</p>
          <p>Winner Vote Percentage: {winner[2].toString()}%</p>
          <p>Total Votes: {totalSupply.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default Winner;
