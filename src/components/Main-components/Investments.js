import React, {useState, useEffect} from 'react';
import {updateDoc, doc, increment} from "firebase/firestore";
import {db,auth} from "../../firebase";
import '../../css/Investments.css';
import Plot from 'react-plotly.js';
import moment from 'moment';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import CloseIcon from '@mui/icons-material/Close';

function Investments({todaysDate ,data, coins, round2dp, investmentsValue, currencySymbol, BTCDailyData, ETHDailyData, 
                    BNBDailyData, arrow, collapsed}) {

const [isMobile, setIsMobile] = useState(true)
//choose the screen size 
const handleResize = () => {
  if (window.innerWidth < 780) {
      setIsMobile(true)
  } else {
      setIsMobile(false)
  }
}
// create an event listener
useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
})

// finally you can render components conditionally if isMobile is True or False 
/*---------------------- Initialise State Variables ----------------------*/    
    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState("BTC")
    const [buySell, setBuySell] = useState("Buy")
    const [Yvalues, setYvalues] = useState([])
    const [asset, setAsset] = useState("BTC")
    const [AssetXValues,setAssetXValues] = useState([])
    const [BTCYValues,setBTCYValues] = useState([])
    const [ETHYValues,setETHYValues] = useState([])
    const [BNBYValues,setBNBYValues] = useState([])
    const [insufficientFunds,setInsufficientFunds] = useState(false)
    const [insufficientAssets,setInsufficientAssets] = useState(false)
    const [amountEntered,setAmountEntered] = useState(false)
    console.log(BTCYValues)

/*---------------------- Collect And Store Appropriate Asset Price Values ----------------------*/
    useEffect(() => {
        const doit = async () => {
            if(BTCDailyData && BTCDailyData.length > 1){
                for(let i = 0; i < BTCDailyData.length-1;i++){
                    var t = new Date(BTCDailyData[i][0]);
                    var formatted = moment(t).format("MMM Do")
                    AssetXValues.push(formatted)
                    BTCYValues.push(BTCDailyData[i][1])
                }
            }
        }
        doit()
        setYvalues(BTCYValues)
    },[BTCDailyData])

    useEffect(() => {
        const doit = async () => {
            if(ETHDailyData && ETHDailyData.length > 1){
                for(let i = 0; i < ETHDailyData.length-1;i++){
                    var u = new Date(ETHDailyData[i][0]);
                    ETHYValues.push(ETHDailyData[i][1])
                }
            }
        }
        doit()
    },[ETHDailyData])

    useEffect(() => {
        const doit = async () => {
            if(BNBDailyData && BNBDailyData.length > 1){
                for(let i = 0; i < BNBDailyData.length-1;i++){
                    var v = new Date(BNBDailyData[i][0]);
                    BNBYValues.push(BNBDailyData[i][1])
                }
            }
        }
        doit()
    },[BNBDailyData])

/*--------------- Function To Add Investment And Update Database Accordingly ---------------*/
    const addInvestment = async() => {
        if(amount === 0){
            setAmountEntered(true)
        }
        else if(buySell === "Buy" && price > data.savings){
            setInsufficientFunds(true)
        }
        else if(buySell === "Sell" && amount > sellableAmount){
            setInsufficientAssets(true)
        }
        else{
            let sortedByDate = [{type:"Investment",asset:currency,category:buySell, sum:round2dp(price), date:todaysDate},...(data.transactions)]
            sortedByDate.sort(function(a,b){
                return new Date(b.date) - new Date(a.date)
            })
            if(buySell === "Buy")
            {
                await updateDoc(doc(db,"users",auth.currentUser.uid), {
                    [currency]: increment(round2dp(amount)),
                    balance: increment(round2dp(-price)),
                    savings: increment(round2dp(-price)),
                    transactions: sortedByDate,
                })
            }
            else{
                await updateDoc(doc(db,"users",auth.currentUser.uid), {
                    [currency]: increment(round2dp(-amount)),
                    balance: increment(round2dp(price)),
                    savings: increment(round2dp(price)),
                    transactions: sortedByDate,
                })
            }
            resetValues()
            setAmount(0)
        }
    }

/*-------------- Function To Change Coordinates Based On Asset Chosen --------------*/    
    function changeAsset(event){
        setAsset(event)
        if(event === "BTC"){
            setYvalues(BTCYValues)
        }
        else if(event === "ETH"){
            setYvalues(ETHYValues)
        }
        else if(event === "BNB"){
            setYvalues(BNBYValues)
        }
    }

/*---------- Calculate Price And Sellable Amount Of Chosen Asset ----------*/    
    let price = 0
    let sellableAmount = 0
    if(currency === "BTC" && coins[0]){
        price = round2dp(amount*coins[0].current_price)
        sellableAmount = round2dp(data.BTC)
    }
    else if(currency === "ETH"){
        price = round2dp(amount*coins[1].current_price)
        sellableAmount = round2dp(data.ETH)
    }
    else if(currency === "BNB"){
        price = round2dp(amount*coins[3].current_price)
        sellableAmount = round2dp(data.BNB)
    }

/*---------- Reset User Input Values After Successful Transaction Added ----------*/
    function resetValues(){
        setInsufficientAssets(false)
        setInsufficientFunds(false)
        setAmountEntered(false)
    }

/*--------------- Chart Of Selected Asset ---------------*/
    const assetChart = 
        <div className = "asset-chart">
            <Plot
                data={[
                    {
                        x: AssetXValues,
                        y: Yvalues,
                        type:"scatter",
                        mode: "lines",
                        marker: {color:"#013A63"},
                    },
                ]}
                layout={{width:(isMobile ? 350 : 700),height:(isMobile ? 250 : 400),title:asset + " Daily Chart",paper_bgcolor:"#fff",plot_bgcolor:"#fff",xaxis:{title:"Date"},yaxis:{title:[asset]+" (" + currencySymbol+")"}}}
                config={{responsive:true}}
            />
            <div className="asset-choice">
                    <select id="asset" name="asset" className="asset-choice-input" value={asset}
                        onChange={(event) => {changeAsset(event.target.value)}}>
                        <option value="" disabled hidden></option>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="BNB">BNB</option>
                    </select>
            </div>
        </div>

/*--------------- Preview Investment Message ---------------*/
    const investmentMessage = (currency.length && buySell.length && amount > 0) ? 
        <div>
            <h1 className = "investment-confirmation-text" 
                style={(buySell === "Buy") ? 
                    {color:"#32DF4C", backgroundColor: '#c7f9cc', borderColor:"#32DF4C"} : 
                    {color:"#922c2b", backgroundColor: '#ffdce0', borderColor:"#922c2b"}}
            >
                {buySell} {amount} {currency} for {currencySymbol}{price}
            </h1>
        </div> : null

/*--------------- Error Box Element For Incorrect User Inputs ---------------*/
    const errorBox = (insufficientAssets || insufficientFunds || amountEntered) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetValues()} sx={{cursor: "pointer"}}/>
            </div>
            {amountEntered && <p className="error-text">Enter A Valid Amount</p>}
            {insufficientAssets && <p className="error-text">Insufficient Assets</p>}
            {insufficientFunds && <p className="error-text">Insufficient Funds</p>}
        </div> : null

/*--------------- Current Asset Prices Box ---------------*/
    const currentAssetPrices = 
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

/*--------------- Balances View Box ---------------*/
    const viewBalances = 
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

/*--------------- Investments View Box ---------------*/
    const investmentsOverview = 
        <div className="investments-overview">
            <div className="investments-overview-title-container">
                <h3 className="investments-overview-title">Investments</h3>
                <ShowChartIcon/>
            </div>
            <div className="investments-overview-container">
                <h1 className="investments-text">BTC: {round2dp(data.BTC)}</h1>
                <h1 className="investments-text">{currencySymbol}{round2dp(data.BTC * (coins[0] ? coins[0].current_price : 0))}</h1>
            </div>
            <div className="investments-overview-container">
                <h1 className="investments-text">ETH: {round2dp(data.ETH)}</h1>
                <h1 className="investments-text">{currencySymbol}{round2dp(data.ETH * (coins[1] ? coins[1].current_price : 0))}</h1>
            </div>
            <div className="investments-overview-container">
                <h1 className="investments-text">BNB: {round2dp(data.BNB)}</h1>
                <h1 className="investments-text">{currencySymbol}{round2dp(data.BNB * (coins[3] ? coins[3].current_price : 0))}</h1>
            </div>
        </div>

/*--------------- Make Investment Box ---------------*/
    const makeInvestment =
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
                    onChange={(event) => {
                        const inputValue = event.target.value;
                        const regex = /^(?!0\d)\d*(\.\d{0,4})?$/;
                        if (inputValue === '' || (regex.test(inputValue) && parseFloat(inputValue) <= 100)) {
                            setAmount(inputValue);
                        }
                    }}             
                    value={amount}
                />
            </div>
            {investmentMessage}
            <div className="submit-investment"> 
                <button className="submit-investment-button" onClick={addInvestment}>Submit</button>
            </div>
        </div>

/*--------------- Return (Render Elements) ---------------*/
    return (
        <main className="investments"
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="investments-title">
                    {arrow}
                    <h1 className="investments-title">Investments</h1>
                </div>
                <div className="display-flex">
                    <div className="chart-and-asset-values"style={{height:(isMobile ? "440px" : "580px")}}>
                        {currentAssetPrices}
                        {assetChart}
                    </div>  
                    <div className="investmentBoxes">
                        {viewBalances}
                        {investmentsOverview}
                        {makeInvestment}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Investments