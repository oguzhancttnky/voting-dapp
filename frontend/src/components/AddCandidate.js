import React, { useState } from 'react';

const AddCandidate = ({ contract, account }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateAddress, setCandidateAddress] = useState('');

  const addCandidate = async () => {
    await contract.methods.AddCandidate(candidateName, candidateAddress).send({ from: account });
    alert('Candidate added successfully!');
  };

  return (
    <div>
      <h2>Add Candidate</h2>
      <input
        type="text"
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Candidate Address"
        value={candidateAddress}
        onChange={(e) => setCandidateAddress(e.target.value)}
      />
      <button onClick={addCandidate}>Add Candidate</button>
    </div>
  );
};

export default AddCandidate;
