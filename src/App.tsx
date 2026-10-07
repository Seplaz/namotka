import { Header } from '@/components/Header/Header';
import { Login } from '@/pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';

function App() {
  return (
    <>
      <Header />
      <Login />
      <Register />
      <Dashboard />
    </>
  );
}

export default App;
