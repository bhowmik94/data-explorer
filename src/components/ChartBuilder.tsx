import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import type { ChartBuilderProps } from "../types/charts";
import { METRIC_OPTIONS } from "../constants/chartOptions";
import { INITIAL_CHART_CONFIG } from "../constants/chartDefaults";

export const ChartBuilder = ({ columns, onBuild }: ChartBuilderProps) => {
  const [formData, setFormData] = useState(INITIAL_CHART_CONFIG);

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitChartForm = () => {
    if (!formData.groupBy) return;
    onBuild(formData);
  };
  return (
    <div className="chart-builder p-3 border">
      <h5 className="mb-3">Chart Settings</h5>

      <Row className="g-3 align-items-end">
        <Col md={9}>
          <Row>
            {/* Group By Selection */}
            <Col md={4}>
              <Form.Group controlId="groupBySelect">
                <Form.Label className="small">Group By (Categorical)</Form.Label>
                <Form.Select name="groupBy" value={formData.groupBy} onChange={handleDropdownChange}>
                  <option value="">Select column...</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Metric Selection */}
            <Col md={4}>
              <Form.Group controlId="metricSelect">
                <Form.Label className="small">Metric</Form.Label>
                <Form.Select name="metric" value={formData.metric} onChange={handleDropdownChange}>
                  {METRIC_OPTIONS.map((metric) => (
                    <option key={metric.value} value={metric.value}>
                      {metric.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Value Column Selection */}
            {["sum", "avg"].includes(formData.metric) && (
              <Col md={4}>
                <Form.Group controlId="valueColmnSelect">
                  <Form.Label className="small">Value Column (Numeric)</Form.Label>
                  <Form.Select name="valueColumn" value={formData.valueColumn} onChange={handleDropdownChange}>
                    <option value="">Select column...</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Col>

        {/* Action Button */}
        <Col md={3}>
          <Button variant="primary" className="w-100" disabled={!formData.groupBy} onClick={submitChartForm}>
            Generate
          </Button>
        </Col>
      </Row>
    </div>
  );
};
