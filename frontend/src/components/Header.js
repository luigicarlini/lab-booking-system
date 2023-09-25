// This is a hypothetical Header component that contains a navigation bar and displays the logged-in user's name if available.
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

function Header() {
  const { user } = useContext(UserContext);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Instrument Booking</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/instruments">Instruments</Link>
            </li>
          </ul>
          <span className="navbar-text">
            {user ? `Welcome, ${user.name}` : <Link to="/login">Login</Link>}
          </span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
