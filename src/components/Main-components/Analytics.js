import React from 'react';
import Plot from 'react-plotly.js';
import '../../css/Analytics.css';

function Analytics({round2dp, monthlyShopping, monthlyFoodDrinks, monthlyBillsUtilities, monthlyOthers,
     monthlyNetInvestment, monthlyCashAdded, data, coins, investmentsValue, arrow, collapsed}) {

    let netsaved = round2dp(monthlyCashAdded - monthlyNetInvestment - monthlyShopping - monthlyFoodDrinks - monthlyBillsUtilities - monthlyOthers)
/*--------------- Data Visualization elements ---------------*/
    var monthlyExpenditure = [{
        type:"pie",
        values: [round2dp(monthlyNetInvestment),round2dp(monthlyShopping),round2dp(monthlyFoodDrinks),
            round2dp(monthlyBillsUtilities),round2dp(monthlyOthers),(netsaved > 0 ? round2dp(netsaved): 0)],
        labels: ["Investments","Shopping","Food&Drinks","Bills&Utilities","Others","Saved"],
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true
    }]

    var investmentBreakdown = [{
        type:"pie",
        values: [round2dp(data.BTC * (coins[0] ? coins[0].current_price : 0)),
                round2dp(data.ETH * (coins[1] ? coins[1].current_price : 0)),
                round2dp(data.BNB * (coins[3] ? coins[3].current_price : 0))],
        labels: ["BTC","ETH","BNB"],
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true
    }]

    var assetBreakdown = [{
        type:"pie",
        values: [data.savings, investmentsValue],
        labels: ["Savings","Investments"],
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true
    }]

    var recommended = [{
        type:"pie",
        values: [50,30,20],
        labels: ["Expenses","Savings","Investments"],
        textinfo: "label+percent",
        textposition: "inside",
        automargin: true
    }]
/*--------------- Return (Render Elements) ---------------*/
    return (
        <main className="analytics"
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="analytics-title">
                    {arrow}
                    <h1 className="analytics-title">Analytics</h1>
                </div>
                <div className="analytics-content">
                    <div className="display-flex">
                        <div className="grid-container">
                            <div className="pie-chart">
                                <Plot data={monthlyExpenditure} layout={{height: 250,width: 350,title:"Monthly Expenses",margin: {"t":-1, "b": 10, "l": 10, "r": 10},}}/>
                            </div>
                            <div className="pie-chart">
                                <Plot data={investmentBreakdown} layout={{height: 250,width: 350,title:"Investment Breakdown",margin: {"t":-1, "b": 10, "l": 10, "r": 10},}}/>
                            </div>
                            <div className="pie-chart">
                                <Plot data={assetBreakdown} layout={{height: 250,width: 350,title:"Asset Allocation",margin: {"t":-1, "b": 10, "l": 10, "r": 10},}}/>
                            </div>
                            <div className="pie-chart">
                                <Plot data={recommended} layout={{height: 250,width: 350,title:"Recommended",margin: {"t":-1, "b": 10, "l": 10, "r": 10},}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default Analytics