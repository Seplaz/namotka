import { Header } from '@/components/Header/Header';
// import { LoginPage } from './pages/LoginPage/LoginPage';
// import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { NewTask } from '@/components/NewTask/NewTask';

function App() {
  return (
    <>
      <Header />
      {/* <LoginPage /> */}
      {/* <RegisterPage /> */}
      <NewTask onClose={() => {}} />
    </>
  );
}

export default App;
