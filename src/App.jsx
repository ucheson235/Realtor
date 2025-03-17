import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Offers from "./Pages/Offers";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import Header from "./components/Header";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from "./Pages/CreateListing";
import EditListing from "./Pages/EditListing";
import Listing from "./Pages/Listing";
import Category from "./Pages/Category";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="min-h-screen flex flex-col" >
      
      <Router basename="/Realtor">
      <Header />
      
      <Routes>
       <Route path="/Realtor/" element={<Home/>} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/category/:categoryName" element={<Category/>} />
        <Route path="/category/:categoryName/:listingId" element={<Listing />} />
        <Route path="create-listing"  element={<PrivateRoute />}>
        <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path="edit-listing"  element={<PrivateRoute />}>
        <Route path="/edit-listing/:listingId" element={<EditListing />} />
        </Route>
        

      </Routes>
      <Footer/>
    </Router>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    
    </div>
  );
}

export default App;
