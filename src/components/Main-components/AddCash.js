import React, {useState} from 'react';
import {updateDoc, doc, increment} from "firebase/firestore";
import {db,auth} from "../../firebase";
import '../../css/AddCash.css';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from '@mui/icons-material/Close';


function AddCash({data, todaysDate, round2dp, investmentsValue, currencySymbol, arrow, collapsed}) {
/*---------------------- Initialise State Variables ----------------------*/
    const [source, setSource] = useState("")
    const [sum, setSum] = useState("")
    const [date, setDate] = useState(todaysDate)
    const [sourceShort, setSourceShort] = useState(false)
    const [sumShort, setSumShort] = useState(false)
    const [dateShort, setDateShort] = useState(false)
/*------------ Add Cash And Add Transaction To Database Function ------------*/
    const addCash = async() => {
        resetErrorValues()
        if(source.length < 1){
            setSourceShort(true)
        }
        if(sum.length < 1 || parseFloat(sum) <= 0){
            setSumShort(true)
        }
        if(date.length < 1 || date > todaysDate){
            setDateShort(true)
        }
        if(source.length > 0 && sum.length > 0 && date.length > 0 && parseFloat(sum) > 0 && date <= todaysDate){
            let sortedByDate = [{type:"Add-Cash",source:source, sum:round2dp(sum), date:date, category:"Revenue"},...(data.transactions)]
            sortedByDate.sort(function(a,b){
                return new Date(b.date) - new Date(a.date)
            })
            await updateDoc(doc(db,"users",auth.currentUser.uid), {
                transactions: sortedByDate,
                balance: increment(round2dp(sum)),
                savings: increment(round2dp(sum))
            })
            resetValues()
        }
    }
/*---------- Reset User Input Values After Cash Added ----------*/
    function resetValues() {
        setSource("")
        setSum("")
    }

/*--------------- Reset Error Box Values For Conditional Rendering ---------------*/
function resetErrorValues(){
        setSourceShort(false)
        setSumShort(false)
        setDateShort(false)
    }

 /*--------------- Error Box Element For Incorrect User Inputs ---------------*/
    const errorBox = (sourceShort || sumShort || dateShort) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetErrorValues()} sx={{cursor: "pointer"}}/>
            </div>
            {sourceShort && <p className="error-text">Please Enter A Valid Source</p>}
            {sumShort && <p className="error-text">Please Enter A Valid Sum</p>}
            {dateShort && <p className="error-text">Please Select A Valid Date</p>}
        </div> : null
console.log(sum)
console.log(typeof sum)
 /*--------------- Add Cash Input Box ---------------*/
    const addCashInput = 
    <div className="addCash-functions-container">
        <div className="addCash-function">
            <h3 className="addCash-function-title">Add Cash</h3>
            {errorBox}
            <div className="source-input"> 
                <h1 className="source-input-text">Source:</h1>
                <input 
                    className="source-input-field"
                    value={source}
                    onChange={(event) => {
                        const inputValue = event.target.value;
                        if (inputValue.length <= 10) {
                          setSource(inputValue.slice(0, 10));
                        }
                    }}  
                />
            </div>
            <div className="sum-input"> 
                <h1 className="sum-input-text">Sum:</h1>
                <input 
                    className="sum-input-field"
                    type="number"
                    onKeyDown={(e) =>["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    value={sum}
                    onChange={(event) => {
                        const inputValue = event.target.value;
                        const regex = /^(?!0\d)\d*(\.\d{0,2})?$/;
                        if (inputValue === '' || (regex.test(inputValue) && parseFloat(inputValue) <= 10000000)) {
                            setSum(inputValue);
                        }
                    }}
                />
            </div>
            <div className="date-input"> 
                <input 
                    type="date"
                    className="date-input-field"
                    onChange={(event) => {setDate(event.target.value)}}
                    defaultValue={todaysDate}
                />
            </div>
            <div className="submit-addCash"> 
                <button className="submit-addCash-button" onClick={addCash}>Submit</button>
            </div>
        </div>
    </div>

/*--------------- Balances View Box ---------------*/
    const viewBalances = 
        <div className="addcash-assets-overview">
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

/*--------------- Return (Render Elements) ---------------*/
    return (
        <section className="addCash"
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="addCash-title">
                    {arrow}
                    <h1 className="addCash-title">Add Cash</h1>
                </div>
                <div className="addCash-boxes-container">
                    {addCashInput}
                    {viewBalances}
                </div>
            </div>
        </section>
    )
}

export default AddCash