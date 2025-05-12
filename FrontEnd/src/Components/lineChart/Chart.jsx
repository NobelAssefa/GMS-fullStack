import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./chart.css";
import axios from 'axios';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export default function Chart() {
  const [visitData, setVisitData] = useState([]);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await axios.get('/api/visit/getvisits', { withCredentials: true });
        const visits = response.data;

        // Get last 6 months of data
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = subMonths(new Date(), i);
          return {
            month: format(date, 'MMM'),
            year: format(date, 'yyyy'),
            startDate: startOfMonth(date),
            endDate: endOfMonth(date)
          };
        }).reverse();

        // Process visit data
        const processedData = last6Months.map(({ month, year, startDate, endDate }) => {
          const monthVisits = visits.filter(visit => {
            const visitDate = new Date(visit.visit_date);
            return visitDate >= startDate && visitDate <= endDate;
          });

          return {
            name: `${month} ${year}`,
            "Total Visits": monthVisits.length,
            "Approved Visits": monthVisits.filter(v => v.is_approved).length,
            "Completed Visits": monthVisits.filter(v => v.checked_out).length
          };
        });

        setVisitData(processedData);
      } catch (error) {
        console.error('Error fetching visit data:', error);
      }
    };

    fetchVisitData();
  }, []);

  return (
    <div className="chart">
      <h3 className="chartTitle">Visit Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visitData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Total Visits" 
            stroke="#0D623F" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Approved Visits" 
            stroke="#204B98" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Completed Visits" 
            stroke="#FA5046" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
