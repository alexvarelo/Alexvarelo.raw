import { FunctionComponent } from "react";

interface PaginationComponentProps {
  currentPage: number;
  nextPageDisabled: boolean;
  updatePage: (newPage: number) => void;
}

const PaginationComponent: FunctionComponent<PaginationComponentProps> = ({
  currentPage,
  nextPageDisabled,
  updatePage,
}) => {
  return (
    <div className="join">
      <button
        className="join-item btn"
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button className="join-item btn">Page {currentPage}</button>
      <button
        className="join-item btn"
        disabled={nextPageDisabled}
        onClick={() => updatePage(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
};

export default PaginationComponent;
