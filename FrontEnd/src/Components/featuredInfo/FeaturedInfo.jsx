import React from 'react'
import "./featured.css"
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
export default function FeaturedInfo() {
  return (
    <div className="featured">
        <div className="featuredItem revenue">
            <span className="featuredTitle">Revenue</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">$2,415</span>
                <span className="featureMoneyRate">
                    -11.4 
                    <ArrowDownwardOutlinedIcon className="featuredName negative"/>
                </span>
            </div>
            <div className="featureSub">Compared to Last year</div>
        </div>
        <div className="featuredItem sales">
            <span className="featuredTitle">Sales</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">$2,415</span>
                <span className="featureMoneyRate">
                    -1.4 
                    <ArrowDownwardOutlinedIcon className="featuredName negative"/>
                </span>
            </div>
            <div className="featureSub">Compared to Last year</div>
        </div>
        <div className="featuredItem cost">
            <span className="featuredTitle">Cost</span>
            <div className="featuredMoneyContainer">
                <span className="featureMoney">$2,415</span>
                <span className="featureMoneyRate">
                    +4.4 
                    <ArrowUpwardOutlinedIcon className="featuredName"/>
                </span>
            </div>
            <div className="featureSub">Compared to Last year</div>
        </div>
    </div>
  )
}
