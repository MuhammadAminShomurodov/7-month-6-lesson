import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllStudents from "./components/AllStudents";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students" element={<AllStudents />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
