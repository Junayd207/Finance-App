import React, { useState, useEffect} from 'react';
import {Routes, Route} from "react-router-dom";
import {db, auth} from "./firebase";
import {doc, onSnapshot, query} from "firebase/firestore";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Sidebar from "./components/Main-components/Sidebar";
import Dashboard from "./components/Main-components/Dashboard";
import AddCash from './components/Main-components/AddCash';
import Investments from './components/Main-components/Investments';
import Forecast from './components/Main-components/Forecast';
import History from './components/Main-components/History';
import Analytics from './components/Main-components/Analytics';
import Settings from './components/Main-components/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";


function App() { 
/*---------------------- Initialise state variables ----------------------*/
    const [coins, setCoins] = useState([]);
    const [BTCDailyData, setBTCDailyData] = useState([]);
    const [ETHDailyData, setETHDailyData] = useState([]);
    const [BNBDailyData, setBNBDailyData] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState(null)
    const [data, setData] = useState({transactions:[], currencySymbol:"",})
    const [monthlyShopping, setMonthlyShopping] = useState(0)
    const [monthlyFoodDrinks, setMonthlyFoodDrinks] = useState(0)
    const [monthlyBillsUtilities, setMonthlyBillsUtilities] = useState(0)
    const [monthlyOthers, setMonthlyOthers] = useState(0)
    const [monthlyCashAdded, setMonthlyCashAdded] = useState(0)
    const [monthlyNetInvestment, setMonthlyNetInvestment] = useState(0)
    const [collapsed, setCollapsed] = useState(true)
    

    const arrow =   <div className="arrow" style={{ filter: "none", opacity: 1, pointerEvents: "auto" }} onClick={() => setCollapsed(!collapsed)}>
                        {collapsed && <ArrowForwardIosIcon/>}
                        {!collapsed && <ArrowBackIosNewIcon/>}
                    </div>
/*--------------- Calculate Todays Date In YY-MM-DD Format ---------------*/
    const d = new Date()
    let todaysDate = ""
    if((d.getMonth()+1) < 10){
        if(d.getDate() < 10)
            todaysDate = d.getFullYear() + "-0" + (d.getMonth()+1) + "-0" + d.getDate()
        else
            todaysDate = d.getFullYear() + "-0" + (d.getMonth()+1) + "-" + d.getDate()
    }
    else{
        if(d.getDate() < 10)
            todaysDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-0" + d.getDate()
        else
            todaysDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()
    }
    
/*-------------------- Function To Round Number To 2DP/4DP --------------------*/
    function round2dp(num){
        return Math.round(num*100) / 100
    }

    function round4dp(num){
        return Math.round(num*10000) / 10000
    }

/*------------------ useEffect Hook To Collect User Data ------------------*/
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(() => {
            unsub()
        const q = query(doc(db, "users", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let usersArr = querySnapshot.data()
            setData(usersArr)
        })
        return() => unsubscribe()
        })
    },[auth.currentUser])

    useEffect(() => {
        if (data && data.currencySymbol) {
            if(data.currencySymbol === "GBP" && currencySymbol !==  "£"){
                setCurrencySymbol(data.currencySymbol);
            }
            else if(data.currencySymbol === "USD" && currencySymbol !==  "$"){
                setCurrencySymbol(data.currencySymbol);
            }
            else if(data.currencySymbol === "EUR" && currencySymbol !==  "€"){
                setCurrencySymbol(data.currencySymbol);
            }
        }
    }, [data]);

/*useEffect Hook To Collect API Price Data With Dependancy To Refresh If Currency(£$€) Changes*/
    useEffect(() => {
        console.log("im the useeffect")
        const getData = async () => {
            try {
              const res = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${data.currencySymbol}&order=market_cap_desc&per_page=4&page=1&sparkline=true`
              );
              setCoins(res.data);
            } catch (error) {
              console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${data.currencySymbol}&days=30&interval=daily`
                );
                setBTCDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${data.currencySymbol}&days=30&interval=daily`
                );
                setETHDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=${data.currencySymbol}&days=30&interval=daily`
                );
                setBNBDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
        };
        if(data && data.currencySymbol){
            getData()
        }  
    }, [currencySymbol]);

    useEffect(() => {
        if (data && data.currencySymbol) {
            if (data.currencySymbol === "GBP")
                setCurrencySymbol("£");
            else if (data.currencySymbol === "USD")
                setCurrencySymbol("$");
            else if (data.currencySymbol === "EUR")
                setCurrencySymbol("€");
        }
    },[currencySymbol]);
/*--------------------- Calculate Total Value Of Investments ---------------------*/
    let investmentsValue = 0;
    if(data){investmentsValue = (round2dp(data.BTC * (coins[0] ? coins[0].current_price : 0) + 
                data.ETH * (coins[1] ? coins[1].current_price : 0) +
                data.BNB * (coins[3] ? coins[3].current_price : 0)))}

/*-------------- Calculate This Months Expenses For Each Catergory --------------*/
    let firstMonthDate = todaysDate.substring(0,8) + "01"
    useEffect(() => {
        if(data && data.transactions){
            const transactionsArray = (data.transactions)
            let shoppingArray = transactionsArray.filter(transaction => transaction.category === "Shopping" && transaction.date >= firstMonthDate)
            let foodDrinksArray = transactionsArray.filter(transaction => transaction.category === "Food&Drinks" && transaction.date >= firstMonthDate)
            let billsUtilitiesArray = transactionsArray.filter(transaction => transaction.category === "Bills&Utilities" && transaction.date >= firstMonthDate)
            let othersArray = transactionsArray.filter(transaction => transaction.category === "Others" && transaction.date >= firstMonthDate)
            let addCashArray = transactionsArray.filter(transaction => transaction.type === "Add-Cash" && transaction.date >= firstMonthDate)
            let buyInvestmentArray = transactionsArray.filter(transaction => transaction.category === "Buy" && transaction.date >= firstMonthDate)
            let sellInvestmentArray = transactionsArray.filter(transaction => transaction.category === "Sell" && transaction.date >= firstMonthDate)
            let shoppingCost = 0
            let foodDrinksCost = 0
            let billsUtilitiesCost = 0
            let othersCost = 0
            let totalCashAdded = 0
            let totalInvestmentsMade = 0
            let totalInvestmentsSold = 0
            for(const x of shoppingArray)
                shoppingCost += x.sum
            for(const x of foodDrinksArray)
                foodDrinksCost += x.sum
            for(const x of billsUtilitiesArray)
                billsUtilitiesCost += x.sum
            for(const x of othersArray)
                othersCost += x.sum
            for(const x of addCashArray)
                totalCashAdded += x.sum
            for(const x of buyInvestmentArray)
                totalInvestmentsMade += x.sum
            for(const x of sellInvestmentArray)
                totalInvestmentsSold += x.sum
            setMonthlyShopping(shoppingCost)
            setMonthlyFoodDrinks(foodDrinksCost)
            setMonthlyBillsUtilities(billsUtilitiesCost)
            setMonthlyOthers(othersCost)
            setMonthlyCashAdded(totalCashAdded)
            setMonthlyNetInvestment(totalInvestmentsMade - totalInvestmentsSold)
        }
    },[data])

/*--------------------Check if screen resolution resembles a mobile-----------------------*/
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
  window.addEventListener("resize", handleResize)
})
/*---------------- Depending On URL, Render Correct Website Routes ----------------*/
return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={
            <div className="dashboard">
                <Sidebar collapsed={collapsed}/>
                <Dashboard data={data} todaysDate={todaysDate} round2dp={round2dp} investmentsValue={investmentsValue} currencySymbol={currencySymbol}
                shopping={monthlyShopping} foodDrinks={monthlyFoodDrinks} billsUtilities={monthlyBillsUtilities} others={monthlyOthers} 
                arrow={arrow} collapsed={collapsed}/>
            </div>
        }/>
        <Route path="/addCash" element={
            <div className="addCash">
                <Sidebar collapsed={collapsed}/>
                <AddCash data={data} todaysDate={todaysDate} round2dp={round2dp} investmentsValue={investmentsValue} 
                currencySymbol={currencySymbol} arrow={arrow} collapsed={collapsed}/>
            </div>
        }/>
        <Route path="/investments" element={
            <div className="investments">
                <Sidebar collapsed={collapsed}/>
                <Investments todaysDate={todaysDate} data={data} coins={coins} round2dp={round2dp} investmentsValue={investmentsValue} 
                currencySymbol={currencySymbol} BTCDailyData = {BTCDailyData.prices} ETHDailyData = {ETHDailyData.prices} 
                BNBDailyData = {BNBDailyData.prices} arrow={arrow} collapsed={collapsed} round4dp={round4dp}/>
            </div>
        }/>
        <Route path="/forecast" element={
            <div className="forecast">
                <Sidebar collapsed={collapsed}/>
                <Forecast data={data} BTCDailyData = {BTCDailyData.prices} ETHDailyData = {ETHDailyData.prices} 
                BNBDailyData={BNBDailyData.prices} todaysDate={todaysDate} arrow={arrow} collapsed={collapsed} currencySymbol={currencySymbol}/>
            </div>
        }/>
        <Route path="/history" element={
            <div className="history">
                <Sidebar collapsed={collapsed}/>
                <History data={data} round2dp={round2dp} investmentsValue={investmentsValue} currencySymbol={currencySymbol}
                arrow={arrow} collapsed={collapsed}/>
            </div>
        }/>
        <Route path="/analytics" element={
            <div className="analytics">
                <Sidebar collapsed={collapsed}/>
                <Analytics round2dp={round2dp} monthlyShopping={monthlyShopping} monthlyFoodDrinks={monthlyFoodDrinks} 
                monthlyBillsUtilities={monthlyBillsUtilities} monthlyOthers={monthlyOthers} monthlyNetInvestment={monthlyNetInvestment}
                monthlyCashAdded={monthlyCashAdded} data={data} coins={coins} investmentsValue={investmentsValue} arrow={arrow}
                collapsed={collapsed}/>
            </div>
        }/>
        <Route path="/settings" element={
            <div className="settings">
                <Sidebar collapsed={collapsed}/>
                <Settings arrow={arrow} collapsed={collapsed}/>
            </div>
        }/>
      </Routes>
    </div>
  );
}

export default App;
