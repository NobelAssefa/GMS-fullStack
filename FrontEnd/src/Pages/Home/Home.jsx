import React from 'react'
import "./home.css"
import Chart from '../../Components/lineChart/Chart'
import PieChart from '../../Components/pieChart/pirchart'
import FeaturedInfo from '../../Components/featuredInfo/FeaturedInfo'
import { Userdata } from '../../Dummy Data'
import { pieChartData } from '../../Dummy Data'
import WidgetsSm from '../../Components/WidgetSm/WidgetsSm'
import WidgetsLg from '../../Components/WidgetLg/WidgetsLg'

export default function Home() {
  return (
    <div className='home'>
      <h1 className="dashboard-title">Dashboard</h1>
      <FeaturedInfo/>
      <div className="charts-container">
        <div className="chart-wrapper">
          <Chart data={Userdata} title="User Analytics" grid dataKey="Active User"/>
        </div>
        <div className="chart-wrapper">
          <PieChart data={pieChartData} title="Guest Analytics" grid dataKey="value"/>
        </div>
      </div>
      <div className="widgets">
        <WidgetsSm/>
        <WidgetsLg/>
      </div>
    </div>
  )
}
