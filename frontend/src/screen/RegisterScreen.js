import { registerUser } from "../api.js";

const RegisterScreen = {
  after_render: ()=> {
    document.getElementById('register-form').addEventListener('submit', async (e)=> {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const data = ({name,email,password})
      const sentRegisterData = await registerUser(data);
      if (sentRegisterData.status === 201){
        window.location.href = '/';

      }else{
        return(sentRegisterData.status)
      }
    })
  },

  render: ()=> {
    return`
      <div class="register-container">
        <form id="register-form">
          <ul class="form-items">
            <li>
              <h2>Create Your Account</h2>
            </li>
            <li>
              <label for="name">Full Name</label>
              <input type="text" name="name" id="name" placeholder="Enter your name">
            </li>
            <li>
              <label for="email">Email Address</label>
              <input type="email" name="email" id="email" placeholder="Enter your email">
            </li>
            <li>
              <label for="password">Password</label>
              <input type="password" name="password" id="password" placeholder="Enter your password">
            </li>
            <li>
              <button type="submit">Sign Up</button>
            </li>
            <li>
              <p>Already have an account? <a href="/login">Log In</a></p>
            </li>
          </ul>
        </form>
      </div>
    `
  }
}

export default RegisterScreen;