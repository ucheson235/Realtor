import { BrowserRouter as Router, Routes, Route} from "react-router"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"
import Offers from "./Pages/Offers"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import ForgotPassword from "./Pages/ForgotPassword"

function App() {


  return (
   
      <div>
       <Router>
          <Routes>
                 <Route path="/home" element={<Home/>}/>
                 <Route path="/profile" element={<Profile/>}/>
                 <Route path="/sign-in" element={<SignIn/>}/>
                 <Route path="/sign-up" element={<SignUp/>}/>
                 <Route path="/forgot-password" element={<ForgotPassword/>}/>
                 <Route path="/offers" element={<Offers/>}/>

                   
          </Routes>
       </Router>
       
      </div>
     
   
  )
}

export default App
