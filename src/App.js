import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {createMemoryHistory} from 'history';
import Login from './components/login';
import "./i18.js";
import Register from './components/register';
import Dashboard from './components/dashboard';
import Reset from './components/reset';

function App() {

  const history = createMemoryHistory();

  return (
    <>
      <Router location={history.location} navigator={history}>
        <Routes>
          <Route path="/login" element = {<Login />}/>
          <Route path="/register" element = {<Register />}/>
          <Route path="/dashboard" element = {<Dashboard />}/>
          <Route path="/reset" element = {<Reset />}/>
          <Route path="/" element = {<Login />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
