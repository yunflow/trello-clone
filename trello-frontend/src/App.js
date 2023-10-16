import './App.css';
import { Route, Routes } from "react-router-dom";
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';
import Copyright from "./components/Copyright";
import HomePage from './pages/Home';
import CreateWorkspacePage from './pages/CreateWorkspace';
import ResetPasswordPage from './components/ResetPasswordForm';
import BoardPage from './pages/CreateBoard';
import BoardHome from './pages/BoardHome';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/home" element={<HomePage />} />
        <Route exact path="/reset-password" element={<ResetPasswordPage />} />
        <Route exact path="/create-workspace" element={<CreateWorkspacePage />} />
        <Route exact path="/create-board/:workspaceId" element={<BoardPage />} />
        <Route exact path="/board-home/:workspaceId/:boardId" element={<BoardHome />} />
      </Routes>
      
      <Copyright sx={{ mt: 5 }} />
    </div>
  );
}

export default App;
