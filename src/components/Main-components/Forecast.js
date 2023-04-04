import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import '../../css/Forecast.css';
import { PolynomialRegression } from 'ml-regression';



function Forecast({data, BTCDailyData, ETHDailyData, BNBDailyData, todaysDate, arrow, collapsed, currencySymbol}) {
    const [portfolioValue, setPortfolioValue] = useState([])
    const [portfolioXValues, setPortfolioXValues] = useState([])
    const [nextPrices, setNextPrices] = useState([])
    const [dateArray, setDateArray] = useState([])
    const [isMobile, setIsMobile] = useState(false)
 
/*------------ Determine If Screen Resembles A Mobile ------------*/
    const handleResize = () => {
      if (window.innerWidth < 800) {
          setIsMobile(true)
      } else {
          setIsMobile(false)
      }
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
    },[])
/*------------ Calculate Portfolio Value For Each Day And Perform Polynomial Regression ------------*/
    useEffect(() => {
        //Collect Data and store in PortfolioValue Array
        if(BTCDailyData && ETHDailyData && BNBDailyData && data){
            if(data.BTC + data.ETH + data.BNB === 0){
                for (let i = 0; i < 31;i++){
                    portfolioValue.push(0)
                }
            }
            for (let i = 0; i < 31;i++){
                portfolioValue.push(data.BTC * BTCDailyData[i][1] + data.ETH * ETHDailyData[i][1] + data.BNB * BNBDailyData[i][1])
            }
        }
        //Function to fit a polynomial regression model to the data
        function polynomialRegression(x, y, maxDegree) {
            let degree = 1
            let bestCoefficients = new Array(maxDegree + 1).fill(0)
            let bestError = Infinity
          
            while (degree <= maxDegree) {
                const coefficients = []
                for (let i = 0; i <= degree; i++) {
                    coefficients.push(
                        x.reduce((acc, _, k) => acc + (x[k] ** i) * y[k], 0)
                    )
                }
                const matrix = [];
                for (let i = 0; i <= degree; i++) {
                    matrix.push([])
                    for (let j = 0; j <= degree; j++) {
                        matrix[i].push(x.reduce((acc, _, k) => acc + (x[k] ** (i + j)), 0))
                    }
                    matrix[i].push(coefficients[i])
                }
                //Solve the system of linear equations using Gaussian elimination
                for (let i = 0; i < degree; i++) {
                    for (let j = i + 1; j <= degree; j++) {
                        const c = matrix[j][i] / matrix[i][i]
                        for (let k = i + 1; k <= degree + 1; k++) {
                            matrix[j][k] -= c * matrix[i][k]
                        }
                    }
                }
                const coefficientsVector = new Array(degree + 1)
                for (let i = degree; i >= 0; i--) {
                    let sum = 0
                    for (let j = i + 1; j <= degree; j++) {
                        sum += matrix[i][j] * coefficientsVector[j]
                    }
                    coefficientsVector[i] = (matrix[i][degree + 1] - sum) / matrix[i][i]
                }
          
                //Evaluate the model on the training data and compute the error
                const predictions = x.map((xi) =>
                    coefficientsVector.reduce((acc, ci, i) => acc + ci * xi ** i, 0)
                )
                const error = y.reduce((acc, yi, i) => acc + (yi - predictions[i]) ** 2, 0)
          
                //Update the best coefficients if the error is lower
                if (error < bestError) {
                    bestCoefficients = coefficientsVector
                    bestError = error
                }
                degree++
            }
          
            const results = {};
            for (let i = 0; i <= maxDegree; i++) {
                results[i] = bestCoefficients[i] || 0
            }

            return results
        }
        //Define helper function to evaluate a polynomial at a given point
        function evaluatePolynomial(x, coefficients) {
            let result = 0
            for (const degree in coefficients) {
                result += coefficients[degree] * (x ** degree)
            }
            
            return result
        }
        //Define historical stock prices
        if(portfolioValue.length > 30)
        {
            //Define input and output data
            const prices = portfolioValue
            const input = prices.slice(0, prices.length - 1)
            const output = prices.slice(1)

            //Compute the mean and standard deviation of the input and output data
            const inputMean = input.reduce((acc, x) => acc + x, 0) / input.length
            const inputStd = Math.sqrt(input.reduce((acc, x) => acc + (x - inputMean) ** 2, 0) / input.length)
            const outputMean = output.reduce((acc, y) => acc + y, 0) / output.length
            const outputStd = Math.sqrt(output.reduce((acc, y) => acc + (y - outputMean) ** 2, 0) / output.length)

            //Normalize the input and output data
            const normalizedInput = input.map((x) => (x - inputMean) / inputStd)
            const normalizedOutput = output.map((y) => (y - outputMean) / outputStd)

            //Fit a polynomial regression model to the normalized data
            const degree = 5
            const modelCoefficients = polynomialRegression(normalizedInput, normalizedOutput, degree)

            //use the polynomial regression model to predict the next 5 stock prices
            const numPredictions = 5
            let lastInput = prices[prices.length - 1]
            nextPrices.push(portfolioValue[29])//so the 2 line charts link
            for (let i = 0; i < numPredictions; i++) {
                //Normalize the input value
                const normalizedInputValue = (lastInput - inputMean) / inputStd

                //Compute the predicted output value using the polynomial regression model
                const normalizedOutputValue = evaluatePolynomial(normalizedInputValue, modelCoefficients)

                //Denormalize the predicted output value
                const nextPrice = normalizedOutputValue * outputStd + outputMean

                //Add the predicted output value to the array of next prices
                nextPrices.push(nextPrice)

                //Update the input array with the predicted output value
                input.push(nextPrice)

                //Update the last input value
                lastInput = nextPrice
            }
        }
        //Print the next 5 predicted stock prices
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
                layout={{width:(isMobile ? 350 : 700),height:(isMobile ? 250 : 400),title:"Portfolio Performance + Forecast",paper_bgcolor:"#fff",plot_bgcolor:"#fff",xaxis:{title:"Date"},yaxis:{title:"Value (" + currencySymbol+")"}}}
                
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