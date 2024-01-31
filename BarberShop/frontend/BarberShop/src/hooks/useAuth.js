import api from '../helpers/axios'
import useFlashMessages from './useFlashMessages'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'


export default function useAuth(){
    const {setFlashMessages} = useFlashMessages()
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate()
    
    async function registerBarberShop(user){
        let msg = 'Cadastro realizado'
        let type = 'success'
        try{
            const data = await api.post('/barbershop/register', user).then((response) => response.data)
            await authUser(data, 'tokenOwner')
        }catch(error){
            msg = error.response.data.message
            type = 'error'
        }
        setFlashMessages(msg, type)
    }
    async function loginBarberShop(user){
        let msg = 'Login realizado'
        let type = 'success'
        try{
            const data = await api.post('/barbershop/login', user).then((response) => response.data)
            await authUser(data, 'tokenOwner')
        }catch(error){
            msg = error.response.data.message
            type = 'error'
        }
        setFlashMessages(msg, type)
    }
    async function authUser(data, tokenName){
        setAuthenticated(true)
        localStorage.setItem(`${tokenName}`, JSON.stringify(data.token))
        setTimeout(() => {
            navigate('/')
        }, 2000);
    }
    async function logoutBarberShop(){
        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.authorization
        = undefined
        navigate('/login')    
    }
    async function registerClient(user){
        let msg = 'Cadastro realizado'
        let type = 'success'
        try{
            const data = await api.post('/client/register', user, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => response.data)
            await authUser(data, 'tokenClient')
        }catch(error){
            msg = error.response.data.message
            type = 'error'
        }
        setFlashMessages(msg, type)
    }
    async function loginClient(user){
        let msg = 'Login realizado'
        let type = 'success'
        try{
            const data = await api.post('/client/login', user).then((response) => response.data)
            await authUser(data, 'tokenClient')
        }catch(error){
            msg = error.response.data.message
            type = 'error'
        }
        setFlashMessages(msg, type)
    }
    return {authenticated, registerBarberShop, loginBarberShop, logoutBarberShop, registerClient, loginClient}

}