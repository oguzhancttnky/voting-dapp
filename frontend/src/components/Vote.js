import React, { useState, useEffect } from 'react';

const Vote = ({ contract, account }) => {
  const [candidateId, setCandidateId] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidatesArray = [];

        for (let i = 0; i < candidatesCount; i++) {
          const candidate = await contract.methods.candidates(i).call();
          candidatesArray.push({
            id: candidate.id.toString(),
            name: candidate.name,
            walletAddress: candidate.walletAddress,
          });
        }

        setCandidates(candidatesArray);
      } catch (error) {
        console.error('Error loading candidates:', error);
      }
    };

    if (contract) {
      loadCandidates();
    }
  }, [contract]);

  const voteForCandidate = async () => {
    if (candidateId) {
      await contract.methods.Vote(candidateId).send({ from: account });
      alert('Voted successfully!');
    } else {
      alert('Please select a candidate!');
    }
  };

  return (
    <div className="container">
      <h2>Vote for a Candidate</h2>
      {candidates.length === 0 ? (
        <p>No candidates available.</p>
      ) : (
        <>
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                <strong>{candidate.name}</strong> (ID: {candidate.id})
              </li>
            ))}
          </ul>
          <div>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            >
              <option value="">Select a candidate</option>
              {candidates.map((candidate, index) => (
                <option key={index} value={candidate.id}>
                  {candidate.name} (ID: {candidate.id})
                </option>
              ))}
            </select>
          </div>
          <button onClick={voteForCandidate}>Vote</button>
        </>
      )}
    </div>
  );
};

export default Vote;
