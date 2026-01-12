import { useState } from "react";
import type { NormalizedRow } from "../dtos/utils";
import { useDataTable } from "../hooks/useDataTable";
import { groupByRoomType } from "../utils/chartHelpers";
import { DataBarChart } from "./BarChart";
import { ChartCard } from "./ChartCard";
import DataTable from "./DataTable";
import { Form } from "react-bootstrap";

export const Dashboard = ({ data }: { data: NormalizedRow[] }) => {
  const [showTable, setShowTable] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);

  const { displayData, handleSort, handleSearch, sortConfig } = useDataTable(data);
  console.log(displayData);
  const columns = displayData.length > 0 ? Object.keys(displayData[0].data) : [];
  const roomTypeData = groupByRoomType(displayData);

  return (
    <div className="dashboard-grid">
      <section className="section-styles">
        <div className="d-flex gap-2">
          <Form>
            <Form.Check
              type="switch"
              id="table-switch"
              label={showTable ? "Hide Table" : "Show Table"}
              checked={showTable}
              onChange={() => setShowTable((prev) => !prev)}
            />
          </Form>
          <Form>
            <Form.Check
              type="switch"
              id="chart-switch"
              label={showChart ? "Hide Chart" : "Show Chart"}
              checked={showChart}
              onChange={() => setShowChart((prev) => !prev)}
            />
          </Form>
        </div>
      </section>

      {showTable && (
        <>
          <h2>Data Table</h2>
          <section className="section-styles table-area p-4 border">
            <DataTable
              rows={displayData}
              columns={columns}
              sortColumn={sortConfig.column}
              sortDirection={sortConfig.order}
              onSort={handleSort}
              onSearch={handleSearch}
            />
          </section>
        </>
      )}

      {showChart && (
        <>
          <h2>Chart</h2>
          <section className="section-styles viz-area">
            <ChartCard title="Room Type Analysis">
              <DataBarChart data={roomTypeData} xAxisKey="name" barKey="count" color={"#8884d8"} />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  );
};
