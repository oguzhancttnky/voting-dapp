const StartElection = ({ contract, account }) => {
  const startElection = async () => {
    await contract.methods.StartElection().send({ from: account });
    alert('Election started!');
  };

  const endElection = async () => {
    await contract.methods.EndElection().send({ from: account });
    alert('Election ended!');
  };

  return (
    <div>
      <h2>Manage Election</h2>
      <button onClick={startElection}>Start Election</button>
      <button onClick={endElection}>End Election</button>
    </div>
  );
};

export default StartElection;
