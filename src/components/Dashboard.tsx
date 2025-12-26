import type { NormalizedRow } from "../dtos/utils";
import { useDataTable } from "../hooks/useDataTable";
import { groupByRoomType } from "../utils/chartHelpers";
import { DataBarChart } from "./BarChart";
import { ChartCard } from "./ChartCard";
import DataTable from "./DataTable";

export const Dashboard = ({ data }: { data: NormalizedRow[] }) => {
  const { displayData, handleSort, handleSearch, sortConfig } = useDataTable(data);
  const columns = displayData.length > 0 ? Object.keys(displayData[0].data) : [];
  const roomTypeData = groupByRoomType(displayData);

  return (
    <div className="dashboard-grid">
      <section className="table-area">
        <DataTable
          rows={displayData}
          columns={columns}
          sortColumn={sortConfig.column}
          sortDirection={sortConfig.order}
          onSort={handleSort}
          onSearch={handleSearch}
        />
      </section>

      <section className="viz-area">
        <ChartCard title="Room Type Analysis">
          <DataBarChart data={roomTypeData} xAxisKey="name" barKey="count" color={"#8884d8"} />
        </ChartCard>
      </section>
    </div>
  );
};
