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
import Profile from './components/Main-components/Profile';
import Settings from './components/Main-components/Settings';
import axios from "axios";

function App() { 
/*---------------------- Initialise state variables ----------------------*/
    const [coins, setCoins] = useState([]);
    const [BTCDailyData, setBTCDailyData] = useState([]);
    const [ETHDailyData, setETHDailyData] = useState([]);
    const [BNBDailyData, setBNBDailyData] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState("")
    const [data, setData] = useState({})
    const [monthlyShopping, setMonthlyShopping] = useState(0)
    const [monthlyFoodDrinks, setMonthlyFoodDrinks] = useState(0)
    const [monthlyBillsUtilities, setMonthlyBillsUtilities] = useState(0)
    const [monthlyOthers, setMonthlyOthers] = useState(0)

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
    
/*-------------------- Function To Round Number To 2DP --------------------*/
    function round2dp(num){
        return Math.round(num*100) / 100
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

/*useEffect Hook To Collect API Price Data With Dependancy To Refresh If Currency(£$€) Changes*/
    useEffect(() => {
        const getData = async () => {
            try {
              const res = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${data.currency}&order=market_cap_desc&per_page=4&page=1&sparkline=true`
              );
              setCoins(res.data);
            } catch (error) {
              console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${data.currency}&days=30&interval=daily`
                );
                setBTCDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${data.currency}&days=30&interval=daily`
                );
                setETHDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
            try {
                const rest = await axios.get(
                  `https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=${data.currency}&days=30&interval=daily`
                );
                setBNBDailyData(rest.data);
            } catch (error) {
                console.error(error);
            }
        };
        if(data.currency){
            if(data.currency === "GBP")
                setCurrencySymbol("£")
            else if(data.currency === "USD")
                setCurrencySymbol("$")
            else if(data.currency === "EUR")
                setCurrencySymbol("€")
            getData()
        }  
    }, [data.currency]);

/*--------------------- Calculate Total Value Of Investments ---------------------*/
    let investmentsValue = (round2dp(data.BTC * (coins[0] ? coins[0].current_price : 0) + 
                data.ETH * (coins[1] ? coins[1].current_price : 0) +
                data.BNB * (coins[3] ? coins[3].current_price : 0)))

/*-------------- Calculate This Months Expenses For Each Catergory --------------*/
    let firstMonthDate = todaysDate.substring(0,8) + "01"
    useEffect(() => {
        if(data.transactions){
            const transactionsArray = (data.transactions)
            let shoppingArray = transactionsArray.filter(transaction => transaction.category === "Shopping" && transaction.date >= firstMonthDate)
            let foodDrinksArray = transactionsArray.filter(transaction => transaction.category === "Food&Drinks" && transaction.date >= firstMonthDate)
            let billsUtilitiesArray = transactionsArray.filter(transaction => transaction.category === "Bills&Utilities" && transaction.date >= firstMonthDate)
            let othersArray = transactionsArray.filter(transaction => transaction.category === "Others" && transaction.date >= firstMonthDate)
            let shoppingCost = 0
            let foodDrinksCost = 0
            let billsUtilitiesCost = 0
            let othersCost = 0
            for(const x of shoppingArray)
                shoppingCost += x.sum
            for(const x of foodDrinksArray)
                foodDrinksCost += x.sum
            for(const x of billsUtilitiesArray)
                billsUtilitiesCost += x.sum
            for(const x of othersArray)
                othersCost += x.sum
            setMonthlyShopping(shoppingCost)
            setMonthlyFoodDrinks(foodDrinksCost)
            setMonthlyBillsUtilities(billsUtilitiesCost)
            setMonthlyOthers(othersCost)
        }
    },[data.transactions])

/*---------------- Depending On URL, Render Correct Website Routes ----------------*/
return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={
            <div className="dashboard">
                <Sidebar />
                <Dashboard data={data} todaysDate={todaysDate} round2dp={round2dp}  investmentsValue={investmentsValue} currencySymbol={currencySymbol}
                shopping={monthlyShopping} foodDrinks={monthlyFoodDrinks} billsUtilities={monthlyBillsUtilities} others={monthlyOthers}/>
            </div>
        }/>
        <Route path="/addCash" element={
            <div className="addCash">
                <Sidebar/>
                <AddCash  data={data}  todaysDate={todaysDate} round2dp={round2dp}  investmentsValue={investmentsValue} currencySymbol={currencySymbol}/>
            </div>
        }/>
        <Route path="/investments" element={
            <div className="investments">
                <Sidebar/>
                <Investments todaysDate={todaysDate} data={data} coins={coins} round2dp={round2dp} investmentsValue={investmentsValue} currencySymbol={currencySymbol}
                            BTCDailyData = {BTCDailyData.prices} ETHDailyData = {ETHDailyData.prices} BNBDailyData = {BNBDailyData.prices}/>
            </div>
        }/>
        <Route path="/forecast" element={
            <div className="forecast">
                <Sidebar/>
                <Forecast data={data} BTCDailyData = {BTCDailyData.prices} ETHDailyData = {ETHDailyData.prices} BNBDailyData={BNBDailyData.prices}  todaysDate={todaysDate}/>
            </div>
        }/>
        <Route path="/history" element={
            <div className="history">
                <Sidebar/>
                <History data={data} round2dp={round2dp} investmentsValue={investmentsValue} currencySymbol={currencySymbol}/>
            </div>
        }/>
        <Route path="/profile" element={
            <div className="profile">
                <Sidebar/>
                <Profile/>
            </div>
        }/>
        <Route path="/settings" element={
            <div className="settings">
                <Sidebar/>
                <Settings/>
            </div>
        }/>
      </Routes>
    </div>
  );
}

export default App;
