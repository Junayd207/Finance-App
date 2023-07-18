import React, {useState} from "react";
import {auth,db} from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import {createUserWithEmailAndPassword} from "firebase/auth";
import '../css/Signup.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import CloseIcon from '@mui/icons-material/Close';

function Signup() {
/*---------------------- Initialise State Variables ----------------------*/    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordShort, setPasswordShort] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [isUnique, setIsUnique] = useState(true)
/*---------------------- Signup Function ----------------------*/    
    const signup = async () =>{
        resetValues()
        if(!email.match(/([a-zA-Z0-9_.+-]{2,}@[a-zA-Z0-9_.+-]{2,}\.[a-zA-Z0-9_.+-]{2,})/)){
            setInvalidEmail(true)
            console.log("email format invalid")
        }
        if(password.length < 6){
            setPasswordShort(true)
            console.log("password too short")
        }
        if(password !== confirmPassword && password.length > 5){
            setPasswordsMatch(true)
            console.log("passwords dont match")
        }   
        else{
            try{
                if(password === confirmPassword){
                    await createUserWithEmailAndPassword(auth,email,password).then
                    (async() => {
                        await setDoc(doc(db,"users",auth.currentUser.uid),{balance:0, savings:0, investments:0, email:email, transactions:[], shopping:0, fooddrinks:0, billsutilities:0, others:0,currencySymbol:"GBP",BTC:0,ETH:0,BNB:0})
                        window.location.href='/dashboard'
                    }).catch((error) => {
                        if (error.code === "auth/email-already-in-use") {
                            setIsUnique(false)
                    }console.error(error)})
                }
            } catch(error) {
                console.error(error)
            }
        }
    }
/*---------------------- Reset Error Box Values For Conditional Rendering ----------------------*/    
    function resetValues() {
        setPasswordShort(false)
        setPasswordsMatch(false)
        setInvalidEmail(false)
        setIsUnique(true)
    }
/*---------------------- Error Box Element For Incorrect User Inputs ----------------------*/    
    const errorBox = (!isUnique || passwordShort || passwordsMatch || invalidEmail) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetValues()} sx={{cursor: "pointer"}}/>
            </div>
            {invalidEmail && <p className="error-text">Invalid email</p>}
            {passwordShort && <p className="error-text">Password too short, must be at least 6 characters</p>}
            {passwordsMatch && <p className="error-text">Passwords do not match</p>}
            {!isUnique && <p className="error-text">Sorry, email already in use</p>}
        </div> : null
/*---------------------- Return (Render Elements) ----------------------*/    
    return (
        <main className="signup">
            <h1 className="signup-title">My Finance Pal</h1>
            {errorBox}
            <div className="username-input"> 
                <PortraitOutlinedIcon sx={{ fontSize: 30, color:"#000000", padding:2}}/>
                <div className="display-flex-column">
                    <h1 className="username-text">Email</h1>
                    <input 
                        className="username-input-field"
                        onChange={(event) => {setEmail(event.target.value)}}
                    />
                </div>
            </div>
            <div className="password-input">
                <LockOutlinedIcon sx={{ fontSize: 30, color:"#000000", padding:2}}/>
                <div className="display-flex-column">
                    <h1 className="password-text">Password</h1>
                    <input 
                        className="password-input-field" 
                        type="password" 
                        onChange={(event) => {setPassword(event.target.value)}}
                    />
                </div> 
            </div>
            <div className="password-input">
                <LockOutlinedIcon sx={{ fontSize: 30, color:"#000000", padding:2}}/>
                <div className="display-flex-column">
                    <h1 className="password-text">Confirm Password</h1>
                    <input 
                        className="password-input-field" 
                        type="password"
                        onChange={(event) => {setConfirmPassword(event.target.value)}}
                    />
                </div> 
            </div>
            <button className="signup-button" onClick={signup}>
                Signup
            </button>
            <p className="existing-account-text">Already Have An Account? <a className="login-link" href="/">login</a></p>
        </main>
    );
}

export default Signup;