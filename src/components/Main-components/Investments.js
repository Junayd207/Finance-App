import React from 'react'
import '../../css/Investments.css';
import "../../App"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

function Investments({data, coins, round2dp}) {
    console.log(coins)
    return (
        <main className="investments">
            <div className="flex-direction-column">
                <h1 className="investments-title">Investments</h1>
                <h1>btc price: £{coins[0]? coins[0].current_price:""}</h1>
                <h1>eth price: £{coins[1]? coins[1].current_price:""}</h1>
                <h1>bnb price: £{coins[3]? coins[3].current_price:""}</h1>

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
        </main>
    )
}

export default Investments