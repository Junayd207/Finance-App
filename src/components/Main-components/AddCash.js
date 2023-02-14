import React, {useState} from 'react'
import '../../css/AddCash.css';
import "../../App"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import {updateDoc, doc, increment} from "firebase/firestore";
import {db,auth} from "../../firebase";

function AddCash({data}) {
    const [source, setSource] = useState("")
    const [sum, setSum] = useState("")
    const [date, setDate] = useState("")

    function resetValues() {
        setSource("")
        setSum("")
    }
    console.log("the length is " + sum.length)

    const addCash = async() => {
        await updateDoc(doc(db,"users",auth.currentUser.uid), {
            transactions: [{type:"addCash",source:source, sum:parseInt(sum), date:date},...(data.transactions)],
            balance: increment(parseInt(sum)),
            savings: increment(parseInt(sum))
        })
        resetValues()
    }

    return (
    <section className="addCash">
        <div className="flex-direction-column">
            <h1 className="addCash-title">Add Cash</h1>
            <div className="addCash-boxes-container">
                <div className="addCash-functions-container">
                    <div className="addCash-function">
                        <h3 className="addCash-function-title">Add Cash</h3>
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
                                value={sum}
                                onChange={(event) => {setSum(event.target.value)}}
                            />
                        </div>
                        <div className="date-input"> 
                            <input 
                                type="date"
                                className="date-input-field"
                                onChange={(event) => {setDate(event.target.value)}}
                            />
                        </div>
                        <div className="submit-addCash"> 
                            <button className="submit-addCash-button" onClick={addCash}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="assets-overview">
                    <div className="assets-overview-title-container">
                        <h3 className="assets-overview-title">Balances</h3>
                        <LocalAtmIcon/>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Total:</h1>
                        <h1 className="assets-text">£{data.balance}</h1>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Savings:</h1>
                        <h1 className="assets-text">£{data.savings}</h1>
                    </div>
                    <div className="assets-overview-container">
                        <h1 className="assets-text">Investments:</h1>
                        <h1 className="assets-text">£{data.investments}</h1>
                    </div>
                </div>
            </div>
        </div>
    </section>
)
}

export default AddCash