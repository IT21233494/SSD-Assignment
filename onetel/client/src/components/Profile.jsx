import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import './profile.css';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      picture: '', // for Facebook user profile picture
    };
  }

  componentDidMount() {
    const token = localStorage.usertoken;

    // Check if a token exists (email/password login)
    if (token) {
      try {
        const decode = jwt_decode(token);
        this.setState({
          first_name: decode.first_name,
          last_name: decode.last_name,
          email: decode.email,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      // If no token, check if the user is logged in via Facebook
      const fbUser = JSON.parse(localStorage.getItem('user'));

      if (fbUser) {
        this.setState({
          first_name: fbUser.name.split(' ')[0], // Use the first part of the name
          last_name: fbUser.name.split(' ').slice(1).join(' '), // Rest of the name
          email: fbUser.email,
          picture: fbUser.picture, // Facebook profile picture
        });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5 profile">
          <div className="col-sm-8 mx-auto">
            <h6 className="text-center">Profile</h6>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>First Name:</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{this.state.email}</td>
              </tr>
              {this.state.picture && (
                <tr>
                  <td>Profile Picture:</td>
                  <td>
                    <img src={this.state.picture} alt="Profile" className="img-fluid" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
