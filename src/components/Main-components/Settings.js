import React, {useState} from 'react';
import '../../css/Settings.css';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {updateDoc, doc} from "firebase/firestore";
import {db,auth} from "../../firebase";

function Settings({arrow, collapsed}) {

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
    <main className="settings"
        style={{
            filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
            opacity: !collapsed ? '0.5' : '1',
            pointerEvents: !collapsed ? 'none' : 'auto',
            transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
        }}
    >
        <div className = "flex-direction-column">
            <div className="settings-title">
                    {arrow}
                    <h1 className="settings-title">Settings</h1>
                </div>
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