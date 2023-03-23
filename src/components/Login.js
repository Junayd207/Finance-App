import React, {useState} from "react";
import {auth} from "../firebase"
import {signInWithEmailAndPassword} from "firebase/auth";
import '../css/Login.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import CloseIcon from '@mui/icons-material/Close';

function Login() {
/*---------------------- Initialise State Variables ----------------------*/    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidUser, setInvalidUser] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [tooManyAttempts, setTooManyAttempts] = useState(false)

/*---------------------- Signin Function ----------------------*/    
    const signIn = async () =>{
        resetValues()
        if(!email.match(/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+\.[a-zA-Z0-9_.+-]+)/)){
            setInvalidEmail(true)
            console.log("email format invalid")
        }
        else{
            try{
                await signInWithEmailAndPassword(auth,email,password).then
                    (async() => {
                        window.location.href='/dashboard';
                    }).catch((error) => {
                        if (error.code === "auth/user-not-found") {
                            setInvalidUser(true)
                        }
                        if (error.code === "auth/wrong-password") {
                            setWrongPassword(true)
                        }
                        if (error.code === "auth/too-many-requests") {
                            setTooManyAttempts(true)
                        }
                        console.error(error)
                    })
            } catch(error) {
                console.error(error)
            }
        }
    }

/*---------------------- Reset Error Box Values For Conditional Rendering ----------------------*/    
    function resetValues() {
        setInvalidEmail(false)
        setInvalidUser(false)
        setWrongPassword(false)
        setTooManyAttempts(false)
    }

/*---------------------- Error Box Element For Incorrect User Inputs ----------------------*/    
    const errorBox = (invalidUser || wrongPassword || invalidEmail || tooManyAttempts) ?
        <div className="error-box">
            <div className="display-flex-between">
                <p className="error-title">Error</p>
                <CloseIcon onClick={(e) => resetValues()} sx={{cursor: "pointer"}}/>
            </div>
            {invalidEmail && <p className="error-text">Invalid Email</p>}
            {invalidUser && <p className="error-text">User Not Found</p>}
            {wrongPassword && <p className="error-text">Password Incorrect, Please Try Again</p>}
            {tooManyAttempts && <p className="error-text">Too Many Attempts, Please Try Again Later</p>}

        </div> : null

/*---------------------- Return (Render Elements) ----------------------*/    
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