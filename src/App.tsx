import { Header } from '@/components/Header/Header';
// import { Login } from '@/pages/Login/Login';
// import { Register } from './pages/Register/Register';
// import { Dashboard } from './pages/Dashboard/Dashboard';
import { NewTask } from './components/NewTask/NewTask';

function App() {
  return (
    <>
      <Header />
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <Dashboard /> */}
      <NewTask onClose={() => console.log('Закрыть форму')} />
    </>
  );
}

export default App;
