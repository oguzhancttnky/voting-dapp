import React, { useState } from 'react';

const AddVoter = ({ contract, account }) => {
  const [voterAddress, setVoterAddress] = useState('');

  const addVoter = async () => {
    await contract.methods.AddVoter(voterAddress).send({ from: account });
    alert('Voter added successfully!');
  };

  return (
    <div>
      <h2>Add Voter</h2>
      <input
        type="text"
        placeholder="Voter Address"
        value={voterAddress}
        onChange={(e) => setVoterAddress(e.target.value)}
      />
      <button onClick={addVoter}>Add Voter</button>
    </div>
  );
};

export default AddVoter;
