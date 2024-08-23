import { loginUser } from "../api.js";

const loginScreen = {
  after_render: () => {
    document.getElementById('signin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const login = await loginUser({ email, password });
      if (login.status === 200) {
        console.log(login.message)
        window.location.href = "/"
      } else {
        return (login.message)
      }
    })
  },

  render: () => {
    return `
      <div class="login-container">
        <form id="signin-form">
          <ul class="form-items">
            <li>
              <h2>Sign In</h2>
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
              <button type="submit" class="primary">Sign In</button>
            </li>
            <li>
              <div>
                New User?
                <a href="/register" data-link>Create your account</a>
              </div>
            </li>
          </ul>
        </form>
      </div>
    `
  }
}

export default loginScreen;