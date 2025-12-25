import { Table } from "react-bootstrap";
import type { NormalizedRow } from "../dtos/utils";
import type { SortOrder, tableSort } from "../dtos/dashboard";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useState } from "react";
import TablePagination from "./Pagination";

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

  return (
    <>
      <Table responsive>
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
              <td>{(currentPage - 1) * pageSize + idx + 1}</td>
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
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
