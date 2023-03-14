import React, {useState} from 'react';
import {db,auth} from "../../firebase";
import { doc, updateDoc, increment } from "firebase/firestore"; 
import {nanoid} from "nanoid";
import '../../css/Dashboard.css';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CloseIcon from '@mui/icons-material/Close';

function Dashboard({data, todaysDate, round2dp, investmentsValue, currencySymbol, shopping, foodDrinks, billsUtilities, others,
                    arrow, collapsed}) {
/*---------------------- Initialise State Variables ----------------------*/
    const [purchase, setPurchase] = useState("")
    const [sum, setSum] = useState("")
    const [date, setDate] = useState(todaysDate)
    const [category, setCategory] = useState("")
    const [purchaseShort,setPurchaseShort] = useState(false)
    const [sumShort,setSumShort] = useState(false)
    const [dateShort,setDateShort] = useState(false)
    const [categoryShort,setCategoryShort] = useState(false)

/*------------ Get Transaction Data And Render It Into A Table (Upto 10) ------------*/
    var transactionElements = []
    let transactionsArray =[]
    const getTransactionsTable = async() => {
        if(data.transactions)
            transactionsArray = (data.transactions).slice(0, 9)
        transactionElements = transactionsArray.map(transaction => {
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
            <div className="transactions-grid" key={nanoid()}>
                <div className="transactions-grid-item" key={nanoid()}
                    style={{backgroundColor:typeColor}}
                >{transaction.type}</div>
                <div className="transactions-grid-item transactions-grid-item-purpose" key={nanoid()}>{transaction.purchase ? transaction.purchase : (transaction.source ? transaction.source : transaction.asset)}</div>
                <div className="transactions-grid-item transactions-grid-item-category" key={nanoid()}
                    style={{backgroundColor:bgColor}}  
                >{transaction.category ? transaction.category : "Revenue"}</div>
                <div className="transactions-grid-item transactions-grid-item-sum" key={nanoid()}>{currencySymbol}{transaction.sum}</div>
                <div className="transactions-grid-item border-right" key={nanoid()}>{transaction.date}</div>
            </div>
            )
        })
    }
    getTransactionsTable()

/*------------ Add Transaction To Database Function ------------*/
    const addExpenditure = async() => {
        resetErrorValues()
        if(purchase.length < 1){
            setPurchaseShort(true)
        }
        if(sum.length < 1){
            setSumShort(true)
        }
        if(date.length < 1){
            setDateShort(true)
        }
        if(category.length < 1){
            setCategoryShort(true)
        }
        if(purchase.length > 0 && sum.length > 0 && date.length > 0 && category.length > 0){
            let sortedByDate = [{type:"Expenditure", purchase:purchase, sum:round2dp(sum), date:date, category:category},...(data.transactions)]
            sortedByDate.sort(function(a,b){
                return new Date(b.date) - new Date(a.date)
            })
            await updateDoc(doc(db,"users",auth.currentUser.uid), {
                transactions: sortedByDate,
                balance: increment(-round2dp(sum)),
                savings: increment(-round2dp(sum)),
                shopping: (category === "Shopping" ? increment(round2dp(sum)): increment(0)),
                fooddrinks: (category === "Food&Drinks" ? increment(round2dp(sum)): increment(0)),
                billsutilities: (category === "Bills&Utilities" ? increment(round2dp(sum)): increment(0)),
                others: (category === "Others" ? increment(round2dp(sum)): increment(0))

            })
            resetValues()
            resetErrorValues()
        }
    }

/*---------- Reset User Input Values After Successful Transaction Added ----------*/
    function resetValues() {
        setPurchase("")
        setSum("")
        setDate(todaysDate)
        setCategory("")
    } 

/*--------------- Reset Error Box Values For Conditional Rendering ---------------*/
    function resetErrorValues(){
        setPurchaseShort(false)
        setSumShort(false)
        setDateShort(false)
        setCategoryShort(false)
    }

/*--------------- Error Box Element For Incorrect User Inputs ---------------*/
    const errorBox = (purchaseShort || sumShort || dateShort || categoryShort) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetErrorValues()} sx={{cursor: "pointer"}}/>
            </div>
            {purchaseShort && <p className="error-text">Please Enter A Valid Purchase</p>}
            {sumShort && <p className="error-text">Please Enter A Valid Sum</p>}
            {dateShort && <p className="error-text">Please Select A Date</p>}
            {categoryShort && <p className="error-text">Please Select A Category</p>}
        </div> : null

/*--------------- Top Row Account Balances ---------------*/
    const accountBalances = 
        <div className="account-balances">
            <div className="assets-value">
                <div className="assets-value-title-container">
                    <h3 className="assets-value-title">Balances</h3>
                    <LocalAtmIcon/>
                </div>
                <div className="assets-values-container">
                    <p className="assets-text">Total:</p>
                    <p className="assets-text">{currencySymbol}{round2dp(data.balance + investmentsValue)}</p>
                </div>
                <div className="assets-values-container">
                    <p className="assets-text">Savings:</p>
                    <p className="assets-text">{currencySymbol}{round2dp(data.savings)}</p>
                </div>
                <div className="assets-values-container">
                    <p className="assets-text">Investments:</p>
                    <p className="assets-text">{currencySymbol}{round2dp(investmentsValue)}</p>
                </div>
            </div>
            <div className="balance-flex-direction-column">
                <div>
                    <h1 className="monthly-expenses-title">Monthly Expenses</h1>
                </div>
                <div className="display-flex">
                    <div className="spend" style={{backgroundColor:"#014F86"}}>
                        <div className="spend-title-container">
                            <h3 className="spend-title">Shopping</h3>
                            <ShoppingCartIcon/>
                        </div>
                        <h1 className="spend-total">{currencySymbol}{round2dp(shopping)}</h1>
                    </div>
                    <div className="spend" style={{backgroundColor:"#2A6F97"}}>
                        <div className="spend-title-container">
                            <h3 className="spend-title" style={{minWidth:"120px"}}>Food & Drinks</h3>
                            <RestaurantIcon/>
                        </div>
                        <h1 className="spend-total">{currencySymbol}{round2dp(foodDrinks)}</h1>
                    </div>
                    <div className="spend" style={{backgroundColor:"#2C7DA0"}}>
                        <div className="spend-title-container">
                            <h3 className="spend-title" style={{minWidth:"120px"}}>Bills & Utilities</h3>
                            <HomeIcon/>
                        </div>
                        <h1 className="spend-total">{currencySymbol}{round2dp(billsUtilities)}</h1>
                    </div>
                    <div className="spend" style={{backgroundColor:"#468FAF"}}>
                        <div className="spend-title-container">
                            <h3 className="spend-title">Others</h3>
                            <AllInclusiveIcon/>
                        </div>
                        <h1 className="spend-total">{currencySymbol}{round2dp(others)}</h1>
                    </div>
                </div>
            </div> 
        </div>

/*--------------- Recent Transactions Grid ---------------*/
    const recentTransactions = 
        <div className="dashboard-recent-transactions-container">
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

/*------------ Add New Expenditure Input Box ------------*/
    const addNewExpenditure = 
        <div className="expenditures-container">
            <h3 className="addCash-expenditure-title">Add Expenditure</h3>
            {errorBox}
            <div className="purchase-input"> 
                <h1 className="purchase-input-text">Purchase:</h1>
                <input 
                    className="purchase-input-field"
                    onChange={(event) => {setPurchase(event.target.value)}}
                    value={purchase}
                />
            </div>
            <div className="expenditure-sum-input"> 
                <h1 className="expenditure-sum-input-text">Sum:</h1>
                <input 
                    className="expenditure-sum-input-field"
                    type="number"
                    onKeyDown={(e) =>["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    onChange={(event) => {setSum(event.target.value)}}
                    value={sum}
                />
            </div>
            <div className="expenditure-date-input"> 
                <input 
                    type="date"
                    className="expenditure-date-input-field"
                    onChange={(event) => {setDate(event.target.value)}}
                    defaultValue={todaysDate}
                />
            </div>
            <div className="expenditure-category">
                <h1 className="category-input-text">Category:</h1>
                <div className="category-input-field">
                    <input type="radio" value="Shopping" name="category"
                        checked={category === "Shopping"}
                        onChange={(event) => {setCategory(event.target.value)}}
                    />
                    <ShoppingCartIcon/>
                    <input type="radio" value="Food&Drinks" name="category"
                        checked={category === "Food&Drinks"}
                        onChange={(event) => {setCategory(event.target.value)}}
                    />
                    <RestaurantIcon/>
                    <input type="radio" value="Bills&Utilities" name="category"
                        checked={category === "Bills&Utilities"}
                        onChange={(event) => {setCategory(event.target.value)}}
                    />
                    <HomeIcon/>
                    <input type="radio" value="Others" name="category"
                        checked={category === "Others"}
                        onChange={(event) => {setCategory(event.target.value)}}
                    />
                    <AllInclusiveIcon/>
                </div>
            </div>
            <div className="submit-expenditure"> 
                <button className="submit-expenditure-button" onClick={addExpenditure}>Submit</button>
            </div>
        </div>
/*--------------- Return (Render Elements) ---------------*/
    return (
        <section className="dashboard" 
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="dashboard-title-container">
                    {arrow}
                    <h1 className="dashboard-title-text">Dashboard</h1>
                </div>
                <div className="dashboard-elements">
                    {accountBalances}
                    <div className="flex-direction-row">
                        {recentTransactions}
                        {addNewExpenditure}
                    </div>  
                </div>
            </div>
        </section>
    )
}

export default Dashboard