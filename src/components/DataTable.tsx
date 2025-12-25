import { Table } from "react-bootstrap";
import type { NormalizedRow } from "../dtos/utils";
import type { SortOrder, tableSort } from "../dtos/dashboard";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useState } from "react";
import "../styles/dataTable.css";
import Pagination from "react-bootstrap/Pagination";

type DataTableProps = {
  rows: NormalizedRow[];
  columns: string[] | null;
  sortColumn: tableSort["column"];
  sortDirection: tableSort["order"];
  onSort: (column: string, direction: SortOrder) => void;
};

export default function DataTable({
  rows,
  columns,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = pageSize * currentPage;

  const currentRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / pageSize);

  const windowSize = 2;
  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  const handlePagination = function (direction: string) {
    setCurrentPage((prevPage) => {
      switch (direction) {
        case "next":
          return Math.min(prevPage + 1, totalPages);

        case "prev":
          return Math.max(prevPage - 1, 1);

        case "last":
          return totalPages;

        case "first":
          return 1;

        default:
          return prevPage;
      }
    });
  };

  return (
    <>
      <Table bordered responsive>
        <thead>
          <tr>
            {rows.length != 0 && <th>#</th>}
            {columns &&
              columns.map((col) => (
                <th key={col}>
                  <div className="th-content">
                    <span>{col} </span>
                    <div className="sort-icons">
                      <span
                        onClick={() => {
                          onSort(col, "asc");
                          setCurrentPage(1);
                        }}
                        className={
                          sortColumn === col && sortDirection === "asc"
                            ? "sort-icon active"
                            : "sort-icon"
                        }
                      >
                        <FaCaretUp />
                      </span>

                      <span
                        onClick={() => {
                          onSort(col, "desc");
                          setCurrentPage(1);
                        }}
                        className={
                          sortColumn === col && sortDirection === "desc"
                            ? "sort-icon active"
                            : "sort-icon"
                        }
                      >
                        <FaCaretDown />
                      </span>
                    </div>
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => (
            <tr
              key={idx}
              className={row.missingCols.size > 0 ? "table-warning" : ""}
            >
              <td>{idx + 1}</td>
              {columns &&
                columns.map((col) => (
                  <td
                    key={col}
                    className={row.missingCols.has(col) ? "empty-cell" : ""}
                  >
                    {String(row.data[col])}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {rows.length != 0 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.First
            disabled={currentPage === 1}
            onClick={() => handlePagination("first")}
          />
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePagination("prev")}
          />

          <Pagination.Item
            active={currentPage === 1}
            onClick={() => setCurrentPage(1)}
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
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            );
          })}

          {end < totalPages - 1 && <Pagination.Ellipsis disabled />}

          {totalPages > 1 && (
            <Pagination.Item
              active={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </Pagination.Item>
          )}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePagination("next")}
          />
          <Pagination.Last
            disabled={currentPage === totalPages}
            onClick={() => handlePagination("last")}
          />
        </Pagination>
      )}
    </>
  );
}
