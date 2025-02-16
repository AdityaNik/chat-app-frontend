import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { RecoilRoot, useSetRecoilState } from 'recoil';
// import Navbar from './components/Navbar';
import MessagePage from './components/MessagePage';
// import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import { user } from './components/store/items/user';


function App() {
  return (<RecoilRoot>
    <Router >
      {/* <Navbar /> */}
      <InitUser />
      <Routes>
        <Route path="/" element={<MessagePage />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </RecoilRoot>
  )
}

const InitUser = () => {
  const setUserData = useSetRecoilState(user);
  const navigate = useNavigate();

  const fetchLoggedInUser = async () => {
    console.log("hiii")
    try {
      const response = await fetch("https://jubilant-laughter-bce5d7d8aa.strapiapp.com/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      const data = await response.json();
      console.log("user data: ", data);
      if (response.ok) {
        setUserData({
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
          },
          isLoding: false,
        });

      } else {
        navigate('/login');
        throw new Error(data.error.message);
      }
    } catch (err) {
      console.error("Fetching logged in user failed:", err);
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  return <div>
  </div>
}

export default App;
