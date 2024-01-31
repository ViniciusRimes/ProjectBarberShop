import {createContext} from "react"
import useAuth from "../hooks/useAuth"

const Context = createContext()

const BarberShopContext = ({children}) => {
  const {authenticated, registerBarberShop, loginBarberShop, logoutBarberShop, registerClient, loginClient} = useAuth()
  return (
    
    <Context.Provider value={{authenticated, registerBarberShop, loginBarberShop, logoutBarberShop, registerClient, loginClient}}>
        {children}
    </Context.Provider>
   
  )
}

export {BarberShopContext, Context}