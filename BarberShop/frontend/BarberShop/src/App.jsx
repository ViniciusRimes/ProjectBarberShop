import { Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import { BarberShopContext } from './context/BarberShopContext'
import { Navbar } from './components/layout/Navbar'
import { useEffect, useState } from 'react'
import api from './helpers/axios'
import { Container } from './components/layout/Container'


function App() {
  // const [authenticated, setAuthenticated] = useState(false)
  // const [user, setUser] = useState({})
  // const navigate = useNavigate()
  // useEffect(()=>{
  //   const token = localStorage.getItem('token')
  //   if(!token){
  //     navigate('/client/login')
  //   }
  //   async function getUserByToken(){
  //     const data = await api.get('/barbershop/user', {
  //     headers: {
  //       Authorization: `Bearer ${JSON.parse(token)}`
  //     }}).then((response)=> {
  //       response.data
  //       setUser(data)
  //     }).catch((error)=>{
  //       navigate('/client/login')
  //     })

  //   }
  //   getUserByToken()
  // }, [])
  // console.log(user)
  return (
    <div className="App">
      <BarberShopContext>
      <Navbar/>
        <Outlet/>
      </BarberShopContext>
    </div>
  )
}

export default App
