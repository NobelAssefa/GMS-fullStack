import React, { useState, useEffect } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import "./piechart.css";
import axios from 'axios';

const COLORS = ['#0D623F', '#204B98', '#FA5046', '#FFA726'];

export default function PieChartComponent() {
    const [visitStats, setVisitStats] = useState([]);

    useEffect(() => {
        const fetchVisitStats = async () => {
            try {
                const response = await axios.get('/api/visit/getvisits', { withCredentials: true });
                const visits = response.data;

                const stats = [
                    {
                        name: 'Approved',
                        value: visits.filter(v => v.is_approved && !v.checked_in).length
                    },
                    {
                        name: 'Checked In',
                        value: visits.filter(v => v.checked_in && !v.checked_out).length
                    },
                    {
                        name: 'Checked Out',
                        value: visits.filter(v => v.checked_out).length
                    },
                    {
                        name: 'Pending',
                        value: visits.filter(v => !v.is_approved).length
                    }
                ];

                setVisitStats(stats);
            } catch (error) {
                console.error('Error fetching visit stats:', error);
            }
        };

        fetchVisitStats();
    }, []);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="chart">
            <h3 className="chartTitle">Visit Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={visitStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {visitStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name) => [`${value} visits`, name]}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => (
                            <span style={{ color: '#666', fontSize: '12px' }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}