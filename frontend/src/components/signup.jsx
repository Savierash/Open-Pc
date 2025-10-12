import React from "react";
import BackgroundLogo from "../assets/BACKGROUND 1.png";

const Signup = () => {
  return (
    <div className="signup" style={{ backgroundImage: `url(${BackgroundLogo})` }}>
      <h2>Sign Up</h2>
      <form>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
