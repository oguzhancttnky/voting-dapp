// SPDX-License-Identifier: 0BSD
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    struct Candidate {
        uint id;
        string name;
        address walletAddress;
    }
    address public owner;
    mapping(address => bool) public registeredVoter;
    mapping(address => bool) public registeredCandidate;
    mapping(address => bool) public hasVoted;
    mapping(uint => Candidate) public candidates;
    string public electionName;
    uint public candidatesCount;
    bool public electionStarted;
    bool public electionEnded;

    constructor(
        string memory _electionName,
        uint256 totalVotes
    ) ERC20("VotingToken", "VTO") {
        owner = msg.sender;
        electionName = _electionName;
        _mint(owner, totalVotes);
        approve(owner, totalVotes);
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyDuringElection() {
        require(electionStarted && !electionEnded, "Election is not active");
        _;
    }

    modifier onlyBeforeElection() {
        require(!electionStarted, "Election has already started");
        _;
    }

    modifier onlyAfterElection() {
        require(electionEnded, "Election is still active");
        _;
    }

    function isCandidate(address user) public view returns (bool) {
        return registeredCandidate[user];
    }

    function StartElection() public ownerOnly onlyBeforeElection {
        electionStarted = true;
    }

    function EndElection() public ownerOnly onlyDuringElection {
        electionEnded = true;
    }

    function AddCandidate(
        string memory _name,
        address candidate
    ) public ownerOnly onlyBeforeElection {
        require(
            registeredCandidate[candidate] == false,
            "Candidate already exists!"
        );
        registeredCandidate[candidate] = true;
        uint candidateId = candidatesCount++;
        candidates[candidateId] = Candidate(candidateId, _name, candidate);
    }

    function AddVoter(address voter) public ownerOnly onlyBeforeElection {
        require(registeredVoter[voter] == false, "Voter already registered");
        require(balanceOf(voter) == 0, "Every voter can have only 1 vote.");
        require(balanceOf(owner) != 0, "No votes left!");

        registeredVoter[voter] = true;
        transferFrom(owner, voter, 1);
    }

    function Vote(uint candidateId) public onlyDuringElection {
        require(registeredVoter[msg.sender], "You are not registered to vote");
        require(!hasVoted[msg.sender], "You have already voted");
        require(electionStarted, "Election must be started!");
        require(balanceOf(msg.sender) > 0, "No votes added to this voter!");
        require(!isCandidate(msg.sender), "Candidates can't vote!");
        require(
            isCandidate(candidates[candidateId].walletAddress),
            "Votes must be cast to a candidate!"
        );

        approve(msg.sender, 1);
        transferFrom(msg.sender, candidates[candidateId].walletAddress, 1);
        hasVoted[msg.sender] = true;
    }

    function Winner()
        public
        view
        onlyAfterElection
        returns (string memory, uint, uint)
    {
        uint winningVoteCount = 0;
        uint winningCandidateId = 0;

        for (uint i = 0; i <= candidatesCount; i++) {
            if (balanceOf(candidates[i].walletAddress) > winningVoteCount) {
                winningVoteCount = balanceOf(candidates[i].walletAddress);
                winningCandidateId = i;
            }
        }

        uint winningVotePercentage = (winningVoteCount * 100) / totalSupply();

        return (
            candidates[winningCandidateId].name,
            winningVoteCount,
            winningVotePercentage
        );
    }
}
