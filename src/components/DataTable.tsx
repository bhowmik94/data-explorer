import { Table } from "react-bootstrap";
import type { NormalizedRow } from "../dtos/utils";
import type { SortOrder, tableSort } from "../dtos/dashboard";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";

type DataTableProps = {
  rows: NormalizedRow[];
  columns: string[] | null;
  sortColumn: tableSort["column"];
  sortDirection: tableSort["order"];
  onSort: (column: string, direction: SortOrder) => void;
}

export default function DataTable({
  rows,
  columns,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps) {
  return (
    <Table bordered responsive>
      <thead>
        <tr>
          {rows.length != 0 && <th>#</th>}
          {columns && columns.map((col) => (
            <th key={col}>
              <div className="th-content">
                <span>{col} </span>
                <div className="sort-icons">
                  <span
                    onClick={() => onSort(col, "asc")}
                    className={
                      sortColumn === col && sortDirection === "asc"
                        ? "sort-icon active"
                        : "sort-icon"
                    }
                  >
                    <FaCaretUp />
                  </span>

                  <span
                    onClick={() => onSort(col, "desc")}
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
        {rows.map((row, idx) => (
          <tr
            key={idx}
            className={row.missingCols.size > 0 ? "table-warning" : ""}
          >
            <td>{idx + 1}</td>
            {columns && columns.map((col) => (
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
  );
}
