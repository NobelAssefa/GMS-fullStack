import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  PieChart, Pie, Sector, Cell,
  ResponsiveContainer,
} from "recharts";
import "./chart.css";

export default function Chart({ title, data, dataKey, grid }) {
  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#018080" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
