export default function Register() {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input placeholder="First Name" />
      <input placeholder="Last Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <select>
        <option value="USER">User</option>
        <option value="EMPLOYEE">Employee</option>
      </select>

      <button>Register</button>
    </div>
  );
}
