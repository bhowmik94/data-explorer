import { useEffect, useState } from "react";
import type { NormalizedRow } from "../dtos/utils";
import { useDataTable } from "../hooks/useDataTable";
import { generateBarChartData } from "../utils/chartHelpers";
import { DataBarChart } from "./BarChart";
import { ChartCard } from "./ChartCard";
import DataTable from "./DataTable";
import { ChartBuilder } from "./ChartBuilder";
import { Form } from "react-bootstrap";
import type { ChartConfig, BarChartData } from "../types/charts";
import { INITIAL_CHART_CONFIG } from "../constants/chartDefaults";

interface ChartState {
  data: BarChartData[];
  config: ChartConfig;
}

export const Dashboard = ({ data }: { data: NormalizedRow[] }) => {
  const [showTable, setShowTable] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [chartState, setChartState] = useState<ChartState>({ data: [], config: INITIAL_CHART_CONFIG });

  // Reset state whenever the 'data' array changes
  useEffect(() => {
    setShowTable(true);
    setShowChart(false);
    setChartState({ data: [], config: INITIAL_CHART_CONFIG });
  }, [data]);

  const { displayData, handleSort, handleSearch, sortConfig } = useDataTable(data);
  const columns = displayData.length > 0 ? Object.keys(displayData[0].data) : [];

  const handleChartBuild = (chartConfig: ChartConfig) => {
    const data = generateBarChartData(displayData, chartConfig.groupBy, chartConfig.metric, chartConfig.valueColumn);
    setShowChart(true);
    setChartState({ data, config: chartConfig });
  };

  return (
    <div className="dashboard-grid">
      <section className="section-styles">
        <ChartBuilder columns={columns} onBuild={handleChartBuild} />
      </section>

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
            <ChartCard title={chartState.config.groupBy + ' analysis'}>
              <DataBarChart
                data={chartState.data}
                metric={chartState.config.metric}
                xAxisKey="columnName"
                barKey="numericMetric"
                color={"#8884d8"}
              />
            </ChartCard>
          </section>
        </>
      )}
    </div>
  );
};
