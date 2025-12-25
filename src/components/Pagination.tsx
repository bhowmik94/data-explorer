import Pagination from "react-bootstrap/Pagination";

type DataTableProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
};

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps) {
  const windowSize = 2;
  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  const handleDirection = function (direction: string) {
    onPageChange((prev) => {
      switch (direction) {
        case "first":
          return 1;
        case "prev":
          return Math.max(prev - 1, 1);
        case "next":
          return Math.min(prev + 1, totalPages);
        case "last":
          return totalPages;
        default:
          return prev;
      }
    });
  };

  return (
    <>
      <Pagination className="justify-content-center mt-3">
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => handleDirection("first")}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handleDirection("prev")}
        />

        <Pagination.Item
          active={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>

        {start > 2 && <Pagination.Ellipsis disabled />}

        {Array.from({ length: end - start + 1 }, (_, i) => {
          const page = start + i;
          return (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Pagination.Item>
          );
        })}

        {end < totalPages - 1 && <Pagination.Ellipsis disabled />}

        {totalPages > 1 && (
          <Pagination.Item
            active={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        )}

        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handleDirection("next")}
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => handleDirection("last")}
        />
      </Pagination>
    </>
  );
}
