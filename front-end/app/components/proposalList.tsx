import { IWeRepoLocalStorage } from "~/context/we-repo";
import { Proposal } from "../interfaces/proposals";
import { ProposalCard } from "./proposalCard";

interface ProposalListProps {
  proposals: Proposal[];
  loadingProposals: boolean;
}

export function ProposalList({
  proposals,
  loadingProposals,
}: ProposalListProps) {
  console.log("proposals", proposals);
  return (
    <div>
      {proposals.length > 0 ? (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {proposals.map((proposal) => (
            <ProposalCard
              proposal={proposal}
              key={proposal.id + proposal.type}
            />
          ))}
        </div>
      ) : null}

      {proposals.length === 0 && !loadingProposals ? (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <h2 className="text-2xl font-bold text-center">No proposals found</h2>
          <p className="text-lg text-center">
            There are no proposals available at the moment. Please check back
            later.
          </p>
        </div>
      ) : null}

      {loadingProposals ? (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="bg-[linear-gradient(270deg,#f9a826,#00f5c0,#ff92e5)] opacity-10 h-64 bg-[length:600%_600%] animate-gradient rounded-2xl shadow-md w-full"></div>
          ))}{" "}
        </div>
      ) : null}
    </div>
  );
}
