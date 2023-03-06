import React, {useState} from 'react';
import '../../css/Settings.css';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {updateDoc, doc} from "firebase/firestore";
import {db,auth} from "../../firebase";

function Settings() {

const [currency,setCurrency] = useState("")
console.log(currency)


function resetValues(){
    setCurrency("")
}
const changeCurrency = async() => {
    if(currency.length === 0){

    }
    else{
        await updateDoc(doc(db,"users",auth.currentUser.uid), {
            currency: currency
        })
        resetValues()
    }
}

return (
    <main className="settings">
        <div className = "flex-direction-column">
            <h1 className="settings-title">Settings</h1>
            <div className= "currency-choice-container">
                <div className="currency-text-container">
                    <h1 className="currency-text">Currency</h1>
                    <CurrencyExchangeIcon/>
                </div>
                <select id="currency" name="currency" className="currency-choice" value={currency}
                onChange={(event) => {setCurrency(event.target.value)}}>
                    <option value="" disabled hidden></option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                </select>
            </div>
            <button className="submit-currency-button" onClick={changeCurrency}>Submit</button>
        </div>
    </main>
)
}

export default Settings