import React, {useState, useEffect} from 'react'
import '../../css/Dashboard.css';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import {db,auth} from "../../firebase";
import { doc, updateDoc, increment } from "firebase/firestore"; 
import CloseIcon from '@mui/icons-material/Close';


function Dashboard({data, todaysDate}) {

    const [purchase, setPurchase] = useState("")
    const [sum, setSum] = useState("")
    const [date, setDate] = useState(todaysDate)
    const [category, setCategory] = useState("")

    console.log(date)
    function resetValues() {
        setPurchase("")
        setSum("")
        setDate(todaysDate)
        setCategory("")
    } 

    const [purchaseShort,setPurchaseShort] = useState(false)
    const [sumShort,setSumShort] = useState(false)
    const [dateShort,setDateShort] = useState(false)
    const [categoryShort,setCategoryShort] = useState(false)

    function resetErrorValues(){
        setPurchaseShort(false)
        setSumShort(false)
        setDateShort(false)
        setCategoryShort(false)
    }

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
            await updateDoc(doc(db,"users",auth.currentUser.uid), {
                transactions: [{type:"expenditure", purchase:purchase, sum:sum, date:date, category:category},...(data.transactions)],
                balance: increment(-sum),
                savings: increment(-sum)
            })
            resetValues()
            resetErrorValues()
        }
    }

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

  return (
    <section className="dashboard">
        <div className="flex-direction-column">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="account-balances">
                <div className="assets-value">
                    <div className="assets-value-title-container">
                        <h3 className="assets-value-title">Balances</h3>
                        <LocalAtmIcon/>
                    </div>
                    <div className="assets-values-container">
                        <p className="assets-text">Total:</p>
                        <p className="assets-text">£{data.balance}</p>
                    </div>
                    <div className="assets-values-container">
                        <p className="assets-text">Savings:</p>
                        <p className="assets-text">£{data.savings}</p>
                    </div>
                    <div className="assets-values-container">
                        <p className="assets-text">Investments:</p>
                        <p className="assets-text">£{data.investments}</p>
                    </div>
                </div>
                <div className="spend" style={{backgroundColor:"#014F86"}}>
                    <div className="spend-title-container">
                        <h3 className="spend-title">Shopping</h3>
                        <ShoppingCartIcon/>
                    </div>
                    <h1 className="spend-total">£345</h1>
                </div>
                <div className="spend" style={{backgroundColor:"#2A6F97"}}>
                    <div className="spend-title-container">
                        <h3 className="spend-title" style={{minWidth:"120px"}}>Food & Drinks</h3>
                        <RestaurantIcon/>
                    </div>
                    <h1 className="spend-total">£79</h1>
                </div>
                <div className="spend" style={{backgroundColor:"#2C7DA0"}}>
                    <div className="spend-title-container">
                        <h3 className="spend-title" style={{minWidth:"120px"}}>Bills & Utilities</h3>
                        <HomeIcon/>
                    </div>
                    <h1 className="spend-total">£912</h1>
                </div>
                <div className="spend" style={{backgroundColor:"#468FAF"}}>
                    <div className="spend-title-container">
                        <h3 className="spend-title">Others</h3>
                        <AllInclusiveIcon/>
                    </div>
                    <h1 className="spend-total">£415</h1>
                </div>
            </div>
            <div className="flex-direction-row">
                <div className="recent-transactions-container">
                    <h3 className="recent-transactions-title">Recent Transactions</h3>
                </div>
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
                                <input type="radio" value="shopping" name="category"
                                    checked={category === "shopping"}
                                    onChange={(event) => {setCategory(event.target.value)}}
                                />
                                <ShoppingCartIcon/>
                                <input type="radio" value="food&drinks" name="category"
                                    checked={category === "food&drinks"}
                                    onChange={(event) => {setCategory(event.target.value)}}
                                />
                                <RestaurantIcon/>
                                <input type="radio" value="bills&utilities" name="category"
                                    checked={category === "bills&utilities"}
                                    onChange={(event) => {setCategory(event.target.value)}}
                                />
                                <HomeIcon/>
                                <input type="radio" value="others" name="category"
                                    checked={category === "others"}
                                    onChange={(event) => {setCategory(event.target.value)}}
                                />
                                <AllInclusiveIcon/>
                            </div>
                        </div>
                        <div className="submit-expenditure"> 
                            <button className="submit-expenditure-button" onClick={addExpenditure}>Submit</button>
                        </div>
                </div>
            </div>  
        </div>
    </section>
  )
}

export default Dashboard