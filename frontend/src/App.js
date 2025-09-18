import {Navigate,Route, Routes} from 'react-router-dom'
import Login from './pages/Login/Login.js'
import Signup from './pages/Signup/Signup.js'
import Home from './pages/Home/Home.js'
import CreateLead from './pages/CreateLead/CreateLead.js'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/create-lead' element={<CreateLead/>} />
      </Routes>
    </div>
  );
}

export default App;
