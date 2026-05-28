import { useState } from 'react'
import './App.css'
import Sidebar from './component/Sidebar/Sidebar'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './component/Dashboard/Dashboard'
import Admin from './component/Admin/Admin'
import History from './component/History/History'
import Login from './component/Login/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/history' element={<History/>}/>
      </Routes>
    </div>
  )
}

export default App
