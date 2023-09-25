import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserContext from './context/UserContext';
import api from './api';
import Header from './components/Header'; // hypothetical Header component
import Footer from './components/Footer'; // hypothetical Footer component
import Login from './components/Login';
import Register from './components/Register';
import InstrumentList from './components/InstrumentList';
import InstrumentBooking from './components/InstrumentBooking';

import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const BASE_URL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(`${BASE_URL}/user/me`);

        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Header />
        <div className="container">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/instruments/:instrumentId" component={InstrumentBooking} />
            <Route path="/instruments" component={InstrumentList} />
            <Route path="/" exact component={InstrumentList} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
