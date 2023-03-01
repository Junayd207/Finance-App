import React, {useState} from 'react'
import '../../css/AddCash.css';
import "../../App"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {updateDoc, doc, increment} from "firebase/firestore";
import {db,auth} from "../../firebase";
import CloseIcon from '@mui/icons-material/Close';


function AddCash({data, todaysDate, round2dp, investmentsValue, currencySymbol}) {
    const [source, setSource] = useState("")
    const [sum, setSum] = useState("")
    const [date, setDate] = useState(todaysDate)
    
    function resetValues() {
        setSource("")
        setSum("")
    }

    const addCash = async() => {
        if(source.length < 1){
            setSourceShort(true)
        }
        if(sum.length < 1){
            setSumShort(true)
        }
        if(date.length < 1){
            setDateShort(true)
        }
        if(source.length > 0 && sum.length > 0 && date.length > 0){
            await updateDoc(doc(db,"users",auth.currentUser.uid), {
                transactions: [{type:"Add-Cash",source:source, sum:round2dp(sum), date:date},...(data.transactions)],
                balance: increment(round2dp(sum)),
                savings: increment(round2dp(sum))
            })
            resetValues()
        }
    }

    const [sourceShort, setSourceShort] = useState(false)
    const [sumShort, setSumShort] = useState(false)
    const [dateShort, setDateShort] = useState(false)

    function resetErrorValues(){
        setSourceShort(false)
        setSumShort(false)
        setDateShort(false)
    }
 
    const errorBox = (sourceShort || sumShort || dateShort) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetErrorValues()} sx={{cursor: "pointer"}}/>
            </div>
            {sourceShort && <p className="error-text">Please Enter A Valid Source</p>}
            {sumShort && <p className="error-text">Please Enter A Valid Sum</p>}
            {dateShort && <p className="error-text">Please Select A Date</p>}
        </div> : null

    return (
    <section className="addCash">
        <div className="flex-direction-column">
            <h1 className="addCash-title">Add Cash</h1>
            <div className="addCash-boxes-container">
                <div className="addCash-functions-container">
                    <div className="addCash-function">
                        <h3 className="addCash-function-title">Add Cash</h3>
                        {errorBox}
                        <div className="source-input"> 
                            <h1 className="source-input-text">Source:</h1>
                            <input 
                                className="source-input-field"
                                value={source}
                                onChange={(event) => {setSource(event.target.value)}}
                            />
                        </div>
                        <div className="sum-input"> 
                            <h1 className="sum-input-text">Sum:</h1>
                            <input 
                                className="sum-input-field"
                                type="number"
                                onKeyDown={(e) =>["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                value={sum}
                                onChange={(event) => {setSum(event.target.value)}}
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
            </div>
        </div>
    </section>
)
}

export default AddCash