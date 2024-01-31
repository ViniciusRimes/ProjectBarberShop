import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import api from '../../helpers/axios'
import { IoIosMenu } from "react-icons/io";
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [barbershop, setBarberShop] = useState({})
  useEffect(()=>{
    async function fetchData (){
      const token = localStorage.getItem('tokenOwner')
          try{
            const data = await api.get('/barbershop/user', {
              headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
              }
            }).then((response)=>response.data)
            setBarberShop(data)
          }catch(error){
      
    }
    }
    fetchData()
  }, [])
  return (
    <div className={styles.navbar}>
        <nav>
          <h1><Link to={'/'}>{barbershop.name}</Link></h1>
        </nav>
        <button className={styles.menuBurguer}>
          <IoIosMenu/>
        </button>
    </div>
  )
}
