import { Button, Table } from "react-bootstrap";
import type { NormalizedRow } from "../dtos/utils";
import type { SortOrder, tableSort } from "../types/common";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useState } from "react";
import TablePagination from "./Pagination";
import TableSearch from "./TableSearch";

type DataTableProps = {
  rows: NormalizedRow[];
  columns: string[] | null;
  sortColumn: tableSort["column"];
  sortDirection: tableSort["order"];
  onSort: (column: string, direction: SortOrder) => void;
  onSearch: (query: string) => void;
  onReset: () => void;
};

export default function DataTable({
  rows,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onSearch,
  onReset,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // TODO: add custom pagination page size implementation
  const [searchText, setSearchText] = useState("");

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = pageSize * currentPage;

  const currentRows = rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rows.length / pageSize);

  const handleSearch = (searchTerm: string) => {
    onSearch(searchTerm);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="outline-primary"
          onClick={() => {
            onReset();
            setSearchText('');
            setCurrentPage(1);
          }}
        >
          Reset
        </Button>
        <TableSearch
          searchText={searchText}
          onSetSearchText={(text: string) => {
            setSearchText(text);
          }}
          onSearch={handleSearch}
        />
      </div>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>#</th>
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
                        className={sortColumn === col && sortDirection === "asc" ? "sort-icon active" : "sort-icon"}
                      >
                        <FaCaretUp />
                      </span>

                      <span
                        onClick={() => {
                          onSort(col, "desc");
                          setCurrentPage(1);
                        }}
                        className={sortColumn === col && sortDirection === "desc" ? "sort-icon active" : "sort-icon"}
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
            <tr key={idx} className={row.missingCols.size > 0 ? "table-warning" : ""}>
              <td>{(currentPage - 1) * pageSize + idx + 1}</td>
              {columns &&
                columns.map((col) => (
                  <td key={col} className={row.missingCols.has(col) ? "empty-cell" : ""}>
                    {String(row.data[col])}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );
}
