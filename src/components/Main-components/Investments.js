import React, {useState, useEffect} from 'react'
import '../../css/Investments.css';
import "../../App"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Plot from 'react-plotly.js';
import moment from 'moment';

function Investments({data, coins, round2dp, investmentsValue, currencySymbol, BTCDailyData, ETHDailyData, BNBDailyData}) {
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState("")
    const [buySell, setBuySell] = useState("")
    const [Xvalues, setXvalues] = useState([])
    const [Yvalues, setYvalues] = useState([])

    useEffect(() => {
        const doit = async () => {
            if(BTCDailyData && BTCDailyData.length > 1){
                for(let i = 0; i < BTCDailyData.length-1;i++){
                    var t = new Date(BTCDailyData[i][0]);
                    var formatted = moment(t).format("MMMs Do")
                    Xvalues.push(formatted)
                    Yvalues.push(BTCDailyData[i][1])
                }
            }
        }
        doit()
    },[BTCDailyData])




    /*console.log(Xvalues)
    console.log(Yvalues)
    console.log(BTCDailyData)*/

    const errorBox = <div></div>

    function addInvestment(){
        console.log("investment made")
    }

    let price = 0
    let sellableAmount = 0
    if(currency === "BTC"){
        price = round2dp(amount*coins[0].current_price)
        sellableAmount = data.BTC
    }
    else if(currency === "ETH"){
        price = round2dp(amount*coins[1].current_price)
        sellableAmount = data.ETH
    }
    else if(currency === "BNB"){
        price = round2dp(amount*coins[3].current_price)
        sellableAmount = data.BNB
    }



    const investmentMessage = (currency.length && buySell.length && amount > 0) ? 
    <div>
        <p className = "investment-confirmation-text" 
            style={((buySell === "Buy" && price <= data.savings) || (buySell === "Sell" && amount <= sellableAmount)) ? {color:"#ffffff"} : {color:"#922c2b"}}>
            {buySell} {amount} {currency} for {currencySymbol}{price}
        </p>
    </div> : null

    const assetChart = 
    <div className = "asset-chart">
        <Plot
            data={[
                {
                    x: Xvalues,
                    y: Yvalues,
                    type:"scatter",
                    mode: "lines",
                    marker: {color:"#013A63"},
                },
            ]}
            layout={{width:700,height:400,title:"a chart",paper_bgcolor:"#fff",plot_bgcolor:"#fff"}}
        />
    </div>

    return (
        <main className="investments">
            <div className="flex-direction-column">
                <h1 className="investments-title">Investments</h1>
                <div className="display-flex">
                    <div>
                        <div className="current-prices-container">
                            <div className="current-prices-title-container">
                                <h3 className="current-price-title">Current Prices</h3>
                                <CurrencyBitcoinIcon/>
                            </div>
                            <div className="current-price-values-container">
                                <div className="current-prices-overview-container">
                                    <h1 className="current-price-text">BTC:</h1>
                                    <h1 className="current-price-text">{currencySymbol}{coins[0] ? coins[0].current_price : ""}</h1>
                                </div>
                                <div className="current-prices-overview-container">
                                    <h1 className="current-price-text">ETH:</h1>
                                    <h1 className="current-price-text">{currencySymbol}{coins[1] ? coins[1].current_price : ""}</h1>
                                </div>
                                <div className="current-prices-overview-container">
                                    <h1 className="current-price-text">BNB:</h1>
                                    <h1 className="current-price-text">{currencySymbol}{coins[3] ? coins[3].current_price : ""}</h1>
                                </div>
                            </div>
                        </div>
                        {assetChart}
                    </div>
                    <div>
                        <div className="balance-overview">
                            <div className="balance-overview-title-container">
                                <h3 className="balance-overview-title">Balances</h3>
                                <LocalAtmIcon/>
                            </div>
                            <div className="balance-overview-container">
                                <h1 className="balance-text">Total:</h1>
                                <h1 className="balance-text">{currencySymbol}{round2dp(data.balance + investmentsValue)}</h1>
                            </div>
                            <div className="balance-overview-container">
                                <h1 className="balance-text">Savings:</h1>
                                <h1 className="balance-text">{currencySymbol}{round2dp(data.savings)}</h1>
                            </div>
                            <div className="balance-overview-container">
                                <h1 className="balance-text">Investments:</h1>
                                <h1 className="balance-text">{currencySymbol}{investmentsValue}</h1>
                            </div>
                        </div>
                        <div className="investments-overview">
                            <div className="investments-overview-title-container">
                                <h3 className="investments-overview-title">Investments</h3>
                                <ShowChartIcon/>
                            </div>
                            <div className="investments-overview-container">
                                <h1 className="investments-text">BTC: {data.BTC}</h1>
                                <h1 className="investments-text">{currencySymbol}{round2dp(data.BTC * (coins[0] ? coins[0].current_price : 0))}</h1>
                            </div>
                            <div className="investments-overview-container">
                                <h1 className="investments-text">ETH: {data.ETH}</h1>
                                <h1 className="investments-text">{currencySymbol}{round2dp(data.ETH * (coins[1] ? coins[1].current_price : 0))}</h1>
                            </div>
                            <div className="investments-overview-container">
                                <h1 className="investments-text">BNB: {data.BNB}</h1>
                                <h1 className="investments-text">{currencySymbol}{round2dp(data.BNB * (coins[3] ? coins[3].current_price : 0))}</h1>
                            </div>
                        </div>
                        <div className="make-investment-container">
                            <div className="make-investment-title-container">
                                <h3 className="make-investment-title">Make Investment</h3>
                                <SsidChartIcon/>
                            </div>
                            {errorBox}
                            <div className="transaction-type-container">
                                <h1 className="transaction-text">Transaction Type:</h1>
                                <select id="buysell" name="buysell" className="transaction-choice"
                                onChange={(event) => {setBuySell(event.target.value)}}>
                                    <option value="" disabled hidden></option>
                                    <option value="Buy">Buy</option>
                                    <option value="Sell">Sell</option>
                                </select>
                            </div>
                            <div className="transaction-type-container">
                                <h1 className="transaction-text">Currency:</h1>
                                <select id="currency" name="currency" className="transaction-choice" 
                                onChange={(event) => {setCurrency(event.target.value)}}>
                                    <option value="" disabled hidden></option>
                                    <option value="BTC">BTC</option>
                                    <option value="ETH">ETH</option>
                                    <option value="BNB">BNB</option>
                                </select>
                            </div>
                            <div className="investment-amount-input"> 
                                <h1 className="transaction-text">Amount:</h1>
                                <input 
                                    className="investment-amount-input-field"
                                    type="number"
                                    onKeyDown={(e) =>["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                    onChange={(event) => {setAmount(event.target.value)}}
                                    value={amount}
                                    maxLength="11"
                                />
                            </div>
                            {investmentMessage}
                            <div className="submit-investment"> 
                                <button className="submit-investment-button" onClick={addInvestment}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Investments