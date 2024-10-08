import React, { Component } from 'react';
import { login, AdminLogin } from './userFuntion';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      // First, check for admin login
      const adminLoginResult = await AdminLogin(user);
      if (adminLoginResult) {
        toast.success('Admin Login');
        window.location.href = '/admin';
        return;
      }

      // // If not admin, check other user login types
      // if (this.state.email === 'run@email.com' && this.state.password === '1234') {
      //   window.location.href = '/delivery/person';
      // } else {
        const loginResult = await login(user);
        if (loginResult) {
          window.location.href = '/profile';
        } else {
          toast.error('Invalid login credentials');
        }
      
    } catch (error) {
      console.error('Login error:', error);
      window.alert('Error occurred during login');
    }
  }

  render() {
    return (
      <div className="container">
        <ToastContainer />
        <h2>
          <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow loginds">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <h6 className="h6 mb-3 font-weight-normal text-center">
                  <p className="h2 mb-5" align="left">
                    Login
                  </p>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <br />
                    <br />
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      name="email"
                      placeholder="Enter Email"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                  </div>
                  <br />
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <br />
                    <br />
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      name="password"
                      placeholder="Enter Password"
                      value={this.state.password}
                      onChange={this.onChange}
                    />
                  </div>
                  <br />
                  <br />
                  <button className="btn logbtn">Sign in</button>
                  <br />
                  <br />
                  <br />
                  <Link className="link" to="/register">
                    Haven't an account?
                  </Link>
                </h6>
              </form>
            </div>
          </div>
        </h2>
      </div>
    );
  }
}
