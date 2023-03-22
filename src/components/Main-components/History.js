import React,{useState} from 'react';
import {nanoid} from "nanoid";
import '../../css/History.css';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function History({data, round2dp, investmentsValue, currencySymbol, arrow, collapsed}) {
/*---------------------- Initialise State Variables ----------------------*/
    const [type, setType] = useState("All")
    const [category, setCategory] = useState("All")

/*------------ Get Transaction Data And Render It Into A Table (Upto 50) ------------*/
    var transactionElements = []
    const getTransactionsTable = async() => {
        const transactionsArray = (data.transactions).slice(0, 50)
        let result = transactionsArray.filter(transaction => category === "All" ? transaction : (transaction.category === category))
        result = result.filter(transaction => type === "All" ? transaction : (transaction.type === type))
        if(result.length > 0)
        {
            transactionElements = result.map(transaction => {
                let bgColor = ""
                if(transaction.category === "Shopping"){
                    bgColor="#014F86"
                }
                else if(transaction.category === "Food&Drinks"){
                    bgColor="#2A6f97"
                }
                else if(transaction.category === "Bills&Utilities"){
                    bgColor="#2C7DA0"
                }
                else if(transaction.category === "Others"){
                    bgColor="#468FAF"
                }
                else if(transaction.category === "Sell"){
                    bgColor="#ff8fa3"
                }
                else{
                    bgColor="#38B000"
                }
                let typeColor=""
                if(transaction.type === "Expenditure"){
                    typeColor="#ff8fa3"
                }
                else{
                    typeColor="#38B000"
                }
                return(
                <div className="history-transactions-grid" key={nanoid()}>
                    <div className="history-transactions-grid-item" key={nanoid()}
                        style={{backgroundColor:typeColor}}
                    >{transaction.type}</div>
                    <div className="history-transactions-grid-item transactions-grid-item-purpose" key={nanoid()}>{transaction.purchase ? transaction.purchase : (transaction.source ? transaction.source : transaction.asset)}</div>
                    <div className="history-transactions-grid-item transactions-grid-item-category" key={nanoid()}
                        style={{backgroundColor:bgColor}}  
                    >{transaction.category ? transaction.category : "Revenue"}</div>
                    <div className="history-transactions-grid-item transactions-grid-item-sum" key={nanoid()}>{currencySymbol}{transaction.sum}</div>
                    <div className="history-transactions-grid-item border-right" key={nanoid()}>{transaction.date}</div>
                </div>
                )
            })
        }
        else{
            transactionElements = 
            <h1 className="no-transaction-text">No Transactions Yet</h1>
        }
    }
    getTransactionsTable()

/*--------------- Recent Transactions Grid ---------------*/
    const recentTransactions = 
        <div className="history-recent-transactions-container">
            <h3 className="history-recent-transactions-title">Recent Transactions</h3>
            <div className="history-recent-transactions-grid-titles-container">
                <div className="history-recent-transactions-grid-title">Type</div>
                <div className="history-recent-transactions-grid-title">Purpose</div>
                <div className="history-recent-transactions-grid-title">Category</div>
                <div className="history-recent-transactions-grid-title">Sum</div>
                <div className="history-recent-transactions-grid-title border-right">Date</div>
            </div>
            <div className="history-transaction-elements">
                {transactionElements}
            </div>
        </div>

/*--------------- Balances View Box ---------------*/
    const viewBalances = 
        <div className="assets-overview">
            <div className="assets-overview-title-container">
                <h3 className="assets-overview-title">Balances</h3>
                <LocalAtmIcon/>
            </div>
            <div className="assets-overview-container">
                <h1 className="assets-text">Total:</h1>
                <h1 className="assets-text">{currencySymbol}{round2dp(data.balance + investmentsValue)}</h1>
            </div>
            <div className="assets-overview-container">
                <h1 className="assets-text">Savings:</h1>
                <h1 className="assets-text">{currencySymbol}{round2dp(data.savings)}</h1>
            </div>
            <div className="assets-overview-container">
                <h1 className="assets-text">Investments:</h1>
                <h1 className="assets-text">{currencySymbol}{round2dp(investmentsValue)}</h1>
            </div>
        </div>

/*--------------- Filter Grid Input ---------------*/
    const filterGrid =
        <div className="filter-transactions-container">
            <div className="filter-transactions-title-container">
                <h3 className="filter-transactions-title">Filter</h3>
                <FilterAltIcon/>
            </div>
            <div className="filter-inputs-container">
                <div className="filter-type">
                    <h3 className="filter-type-title">Type:</h3>
                    <select id="type" name="type" className="type-choice" value={type}
                    onChange={(event) => {setType(event.target.value)}}>
                        <option value="" disabled hidden></option>
                        <option value="All">All</option>
                        <option value="Expenditure">Expenditure</option>
                        <option value="Investment">Investment</option>
                        <option value="Add-Cash">Add-Cash</option>
                    </select>
                </div>
                <div className="filter-category">
                    <h3 className="filter-category-title">Category:</h3>
                    <select id="category" name="category" className="category-choice" value={category}
                    onChange={(event) => {setCategory(event.target.value)}}>
                        <option value="" disabled hidden></option>
                        <option value="All">All</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Food&Drinks">Food&Drinks</option>
                        <option value="Bills&Utilities">Bills&Utilities</option>
                        <option value="Others">Others</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                    </select>
                </div>
            </div>
        </div>

/*--------------- Return (Render Elements) ---------------*/
    return (
        <main className="history"
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="history-title">
                    {arrow}
                    <h1 className="history-title">History</h1>
                </div>
                <div className="history-boxes-container">
                    {recentTransactions}
                    <div className="history-values-container">
                        {viewBalances}
                        {filterGrid}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default History