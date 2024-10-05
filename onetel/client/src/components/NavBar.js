import React, { Component } from 'react';
import { Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BsWhatsapp } from 'react-icons/bs';
import logo from '../images/lo.png';
import "./Navbar.css";

class NavBar extends Component {

  logout(e) {
    e.preventDefault();
    localStorage.removeItem('usertoken'); // Remove JWT token
    localStorage.removeItem('user');      // Remove Facebook user data
    window.location = '/login';
  }

  render() {
    // Check if logged in using either JWT token or Facebook user data
    const isLoggedIn = localStorage.usertoken || localStorage.getItem('user');

    const loginRegLink = (
      <nav className="navbar navbar-expand-lg" id="navbarNav">
        <ul className="navbar-nav">
          <li className='nav-item'>
            <a className="nav-link" style={{ color: '#1dff1d' }} href="/login">Login</a>
          </li>
          <li className='nav-item'>
            <a className="nav-link" style={{ color: 'red' }} href="/register">Register</a>
          </li>
        </ul>
      </nav>
    );

    const userLink = (
      <nav className="navbar navbar-expand-lg" id="navbarNav">
        <ul className="navbar-nav">
          <li className='nav-item'>
            <a className="nav-link" href="/profile">Profile</a>
          </li>
          <NavDropdown title="Service" id="collasible-nav-dropdown" className='tog'>
            <NavDropdown.Item href="/repairCus">Repair Item</NavDropdown.Item>
            <NavDropdown.Item href="/Addwarrenty">Warrenty Claim</NavDropdown.Item>
            <NavDropdown.Item href="/rentitemdisplay">Rent Item</NavDropdown.Item>
            <NavDropdown.Item href="/AddReturn">Return Item</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="https://wa.me/+94785748316" style={{ color: "green" }}>
              <BsWhatsapp />&nbsp;WhatsApp
            </NavDropdown.Item>
          </NavDropdown>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <li className='nav-item'>
            <a className="btn btn-danger" onClick={this.logout.bind(this)} href="">Logout</a>
          </li>
        </ul>
      </nav>
    );

    return (
      <nav className="navbar navbar-expand-lg navbarNav">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><img className='logs' src={logo} alt="logo" />&nbsp;&nbsp;ONETEL</a>
          <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon bg-white"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/chat">ChatBot</a>
              </li>
            </ul>
            {isLoggedIn ? userLink : loginRegLink}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
