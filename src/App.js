import React, { useState, useEffect} from 'react'
import './App.css';
import Login from "./components/Login"
import Signup from "./components/Signup"
import Sidebar from "./components/Main-components/Sidebar"
import Dashboard from "./components/Main-components/Dashboard"
import AddCash from './components/Main-components/AddCash';
import Investments from './components/Main-components/Investments';
import Forecast from './components/Main-components/Forecast';
import History from './components/Main-components/History';
import Profile from './components/Main-components/Profile';
import Settings from './components/Main-components/Settings';

import {Routes, Route} from "react-router-dom"
import {db, auth} from "./firebase"
import {getDoc, doc, onSnapshot, QuerySnapshot, query, collection} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue} from "firebase/database";

function App() {
    const [data, setData] = useState({})

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(() => {
            unsub()
        const q = query(doc(db, "users", auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let usersArr = querySnapshot.data()
            setData(usersArr)
        })
        return() => unsubscribe()
        })
    },[auth.currentUser])
    console.log(data)

/*
    async function fetchData() {
            if(auth.currentUser){
                const docRef = doc(db, "users", auth.currentUser.uid)
                const docSnap = await getDoc(docRef)
                setData(docSnap.data())
            }
        }
    fetchData()
*/


    /*const q = query(doc(db, "users", auth.currentUser.uid))
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let usersArr = []
                querySnapshot.forEach(doc => {
                    usersArr.push({...doc.data()})
                })
                setData(usersArr)
            })
            return() => unsubscribe()*/


  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={
            <div className="dashboard">
                <Sidebar />
                <Dashboard data={data}/>
            </div>
        }/>
        <Route path="/addCash" element={
            <div className="addCash">
                <Sidebar/>
                <AddCash  data={data}/>
            </div>
        }/>
        <Route path="/investments" element={
            <div className="investments">
                <Sidebar/>
                <Investments/>
            </div>
        }/>
        <Route path="/forecast" element={
            <div className="forecast">
                <Sidebar/>
                <Forecast/>
            </div>
        }/>
        <Route path="/history" element={
            <div className="history">
                <Sidebar/>
                <History/>
            </div>
        }/>
        <Route path="/profile" element={
            <div className="profile">
                <Sidebar/>
                <Profile/>
            </div>
        }/>
        <Route path="/settings" element={
            <div className="settings">
                <Sidebar/>
                <Settings/>
            </div>
        }/>
      </Routes>
    </div>
  );
}

export default App;
