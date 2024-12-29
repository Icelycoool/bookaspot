import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import About from "./components/About";
import SavedAmenities from "./components/SavedAmenities";
import Discover from "./components/Discover";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Footer } from "./components/Footer";

const App = () => {
    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<About />} />
                <Route path="/saved-amenities" element={<SavedAmenities />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={ <Signup />} />
            </Routes>
            <Footer/>
        </Router>
    )
}

export default App