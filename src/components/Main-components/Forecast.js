import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import '../../css/Forecast.css';

function Forecast({data, BTCDailyData, ETHDailyData, BNBDailyData, todaysDate, arrow, collapsed}) {
    const [portfolioValue, setPortfolioValue] = useState([])
    const [portfolioXValues, setPortfolioXValues] = useState([])
    const [nextPrices, setNextPrices] = useState([])
    const [dateArray, setDateArray] = useState([])


/*------------ Calculate Portfolio Value For Each Day And Perform Polynomial Regression ------------*/
    useEffect(() => {
        if(BTCDailyData && ETHDailyData && BNBDailyData && data){
            for (let i = 0; i < 31;i++){
                portfolioValue.push(data.BTC * BTCDailyData[i][1] + data.ETH * ETHDailyData[i][1] + data.BNB * BNBDailyData[i][1])
            }
        }
        // Define helper function to fit a polynomial regression model to the data
        function polynomialRegression(x, y, degree) {
            const results = {};

            const coefficients = [];
            for (let i = 0; i < degree + 1; i++) {
                coefficients.push(Array.from({ length: degree + 1 }, (_, j) => x.reduce((acc, _, k) => acc + (x[k] ** (i + j)), 0)));
            }

            const matrix = coefficients.map((row, i) => Array.from({ length: degree + 2 }, (_, j) => j === degree + 1 ? y.reduce((acc, _, k) => acc + (y[k] * x[k] ** i), 0) : row[j]));

            for (let i = 0; i < degree + 1; i++) {
                let maxElement = matrix[i][i];
                let maxRow = i;
                for (let j = i + 1; j < degree + 1; j++) {
                    if (Math.abs(matrix[j][i]) > Math.abs(maxElement)) {
                        maxElement = matrix[j][i];
                        maxRow = j;
                    }
                }
                for (let j = i; j < degree + 2; j++) {
                    const tmp = matrix[maxRow][j];
                    matrix[maxRow][j] = matrix[i][j];
                    matrix[i][j] = tmp;
                }
                for (let j = i + 1; j < degree + 1; j++) {
                    const c = -matrix[j][i] / matrix[i][i];
                    for (let k = i; k < degree + 2; k++) {
                        if (i === k) {
                            matrix[j][k] = 0;
                        } else {
                            matrix[j][k] += c * matrix[i][k];
                        }
                    }
                }
            }

            for (let i = degree; i >= 0; i--) {
                let a = matrix[i][degree + 1] / matrix[i][i];
                for (let j = i - 1; j >= 0; j--) {
                    matrix[j][degree + 1] -= matrix[j][i] * a;
                    matrix[j][i] = 0;
                }
                results[i] = a;
            }

            return results;
        }
        // Define helper function to evaluate a polynomial at a given point
        function evaluatePolynomial(x, coefficients) {
            let result = 0;
            for (const degree in coefficients) {
                result += coefficients[degree] * (x ** degree);
            }
            return result;
        }
        // Define historical stock prices
        if(portfolioValue.length > 30)
        {
            const prices = portfolioValue
            // Define input and output data
            const input = prices.slice(0, prices.length - 1);
            const output = prices.slice(1);

            // Compute the mean and standard deviation of the input and output data
            const inputMean = input.reduce((acc, x) => acc + x, 0) / input.length;
            const inputStd = Math.sqrt(input.reduce((acc, x) => acc + (x - inputMean) ** 2, 0) / input.length);
            const outputMean = output.reduce((acc, y) => acc + y, 0) / output.length;
            const outputStd = Math.sqrt(output.reduce((acc, y) => acc + (y - outputMean) ** 2, 0) / output.length);

            // Normalize the input and output data
            const normalizedInput = input.map((x) => (x - inputMean) / inputStd);
            const normalizedOutput = output.map((y) => (y - outputMean) / outputStd);

            // Fit a polynomial regression model to the normalized data
            const degree = 3;
            const modelCoefficients = polynomialRegression(normalizedInput, normalizedOutput, degree);

            // Use the polynomial regression model to predict the next 5 stock prices
            const numPredictions = 5;
            let lastInput = prices[prices.length - 1];
            nextPrices.push(portfolioValue[29])
            for (let i = 0; i < numPredictions; i++) {
                // Normalize the input value
                const normalizedInputValue = (lastInput - inputMean) / inputStd;

                // Compute the predicted output value using the polynomial regression model
                const normalizedOutputValue = evaluatePolynomial(normalizedInputValue, modelCoefficients);

                // Denormalize the predicted output value
                const nextPrice = normalizedOutputValue * outputStd + outputMean;

                // Add the predicted output value to the array of next prices
                nextPrices.push(nextPrice);

                // Update the input array with the predicted output value
                input.push(nextPrice);

                // Update the last input value
                lastInput = nextPrice;
            }
        }
        // Print the next 5 predicted stock prices
    }, [data,BTCDailyData,ETHDailyData,BNBDailyData])
/*------------ Collect X Axis Values For Portfolio Performance------------*/
    useEffect(() => {
        const doit = async () => {
            if(BTCDailyData && BTCDailyData.length > 1){
                for(let i = 0; i < BTCDailyData.length-1;i++){
                    var t = new Date(BTCDailyData[i][0]);
                    var formatted = moment(t).format("MMM Do")
                    portfolioXValues.push(formatted)
                }
            }
        }
        doit()
    },[BTCDailyData])
/*------------ Calculate X Axis Values For Forcasted Prices ------------*/
    useEffect(() => {
        const startDate = new Date(todaysDate); // Replace with your desired start date
        const numDays = 10;
        
        for (let i = 0; i <= numDays; i++) {
        const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const formattedDate = currentDate.toISOString().slice(0, 10);
        var formatted = moment(formattedDate).format("MMM Do")
        dateArray.push(formatted);
        }
    },[todaysDate])

/*--------------- Chart Of Portfolio Value And Forecast ---------------*/
    const forecastChart = 
        <div className="chart-container">
            <Plot
                data={[
                    {
                        x: portfolioXValues,
                        y: portfolioValue,
                        type:"scatter",
                        mode: "lines",
                        marker: {color:"#013A63"},
                        name: "Portfolio",
                    },
                    {
                        x: dateArray,
                        y: nextPrices,
                        type:"scatter",
                        mode: "lines",
                        line : {shape : 'linear', color:"#32a852", width: 2, dash : 'dot'},
                        name: "Forecast",
                    },
                ]}
                layout={{width:700,height:400,title:"Portfolio Performance + Forecast",paper_bgcolor:"#fff",plot_bgcolor:"#fff",xaxis:{title:"Date"},yaxis:{title:"Price"}}}
                
            />
        </div>
/*--------------- Return (Render Elements) ---------------*/
    return (
        <main className="forecast"
            style={{
                filter: !collapsed ? 'grayscale(100%)' : 'grayscale(0%)',
                opacity: !collapsed ? '0.5' : '1',
                pointerEvents: !collapsed ? 'none' : 'auto',
                transition: 'filter 0.5s, opacity 0.5s, pointer-events 0.5s',
            }}
        >
            <div className="flex-direction-column">
                <div className="forecast-title">
                    {arrow}
                    <h1 className="forecast-title">Forecast</h1>
                </div>
                {forecastChart}
            </div>
        </main>
    )
}

export default Forecast