import React, {useState} from "react";
import '../css/Login.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {db, auth} from "../firebase"
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
  } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [invalidEmail, setInvalidEmail] = useState(false)
    const [passwordIncorrect, setpasswordIncorrect] = useState(false)

    function resetValues() {
        setInvalidEmail(false)
        setpasswordIncorrect(false)
    }

    const signIn = async () =>{
        resetValues()
        if(!email.match(/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+\.[a-zA-Z0-9_.+-]+)/)){
            setInvalidEmail(true)
            console.log("email format invalid")
        }
        else{
            try{
                await signInWithEmailAndPassword(auth,email,password).then
                    (() => {
                        window.location.href='/dashboard';
                    }).catch((error) => {
                        if (error.code == "auth/user-not-found") {
                            alert("user not found")
                        }
                        console.error(error)
                    })
            } catch(error) {
                console.error(error)
            }
        }
    }

    const errorBox = (passwordIncorrect || invalidEmail) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetValues()} sx={{cursor: "pointer"}}/>
            </div>
            {invalidEmail && <p className="error-text">Invalid email</p>}
            {passwordIncorrect && <p className="error-text">Password incorrect, please try again</p>}
        </div> : null


return (
    <main className="login">
        <h1 className="login-title">My Finance Pal</h1>
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
        <button className="login-button" onClick={signIn}>Login</button>
        <p className="no-account-text">Don’t Have An Account? <a className="signup-link" href="/signup">Register</a></p>
    </main>
  );
}

export default Login;