import React from 'react'
import '../../css/History.css';
import "../../App"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {nanoid} from "nanoid"


function History({data, round2dp}) {
    var transactionElements = []
    const doit = async() => {
        const transactionsArray = (data.transactions).slice(0, 50)
        transactionElements = transactionsArray.map(transaction => {
            let bgColor = ""
            if(transaction.category == "Shopping"){
                bgColor="#014F86"
            }
            else if(transaction.category == "Food&Drinks"){
                bgColor="#2A6f97"
            }
            else if(transaction.category == "Bills&Utilities"){
                bgColor="#2C7DA0"
            }
            else if(transaction.category == "Others"){
                bgColor="#468FAF"
            }
            else{
                bgColor="#38B000"
            }
            let typeColor=""
            if(transaction.type == "Expenditure"){
                typeColor="#ff8fa3"
            }
            else{
                typeColor="#38B000"
            }
            return(
            <div className="transactions-grid" key={nanoid()}>
                <div className="transactions-grid-item" key={nanoid()}
                    style={{backgroundColor:typeColor}}
                >{transaction.type}</div>
                <div className="transactions-grid-item transactions-grid-item-purpose" key={nanoid()}>{transaction.purchase ? transaction.purchase : transaction.source}</div>
                <div className="transactions-grid-item transactions-grid-item-category" key={nanoid()}
                    style={{backgroundColor:bgColor}}  
                >{transaction.category ? transaction.category : "Revenue"}</div>
                <div className="transactions-grid-item transactions-grid-item-sum" key={nanoid()}>£{transaction.sum}</div>
                <div className="transactions-grid-item border-right" key={nanoid()}>{transaction.date}</div>
            </div>
            )
        })
    }
    doit()

return (
    <main className="history">
        <div className="flex-direction-column">
            <h1 className="history-title">History</h1>
            <div className="history-boxes-container">
                <div className="recent-transactions-container">
                    <h3 className="recent-transactions-title">Recent Transactions</h3>
                    <div className="recent-transactions-grid-titles-container">
                        <div className="recent-transactions-grid-title">Type</div>
                        <div className="recent-transactions-grid-title">Purpose</div>
                        <div className="recent-transactions-grid-title">Category</div>
                        <div className="recent-transactions-grid-title">Sum</div>
                        <div className="recent-transactions-grid-title border-right">Date</div>
                    </div>
                    {transactionElements}
                </div>
                <div className="assets-overview">
                    <div className="assets-overview-title-container">
                        <h3 className="assets-overview-title">Balances</h3>
                        <LocalAtmIcon/>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Total:</h1>
                        <h1 className="assets-text">£{round2dp(data.balance)}</h1>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Savings:</h1>
                        <h1 className="assets-text">£{round2dp(data.savings)}</h1>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Investments:</h1>
                        <h1 className="assets-text">£{round2dp(data.investments)}</h1>
                    </div>
                </div>
            </div>
        </div>
    </main>
)
}

export default History