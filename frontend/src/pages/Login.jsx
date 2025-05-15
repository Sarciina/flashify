import LoginForm from '../components/LoginForm';

const Login = ({ setUser }) => {
  return (
    <div className="min-h-screen bg-gray-800">
      <LoginForm setUser={setUser} />
    </div>
  );
};

export default Login;