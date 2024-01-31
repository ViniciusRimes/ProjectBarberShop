import { useEffect, useState } from 'react'
import styles from './ServiceTable.module.css'
import api from '../../helpers/axios'

export const ServiceTable = () => {
    const [services, setServices] = useState([])
    useEffect(()=>{
        async function fetchData(){
            try{
                const allServices = await api.get('/services/all').then((response)=>response.data)
                setServices(allServices)
            }catch(error){
                console.log
            }
        }
        fetchData()
    },[])
    
    return (
    <div className={styles.serviceTable}>
        {services.map((service, key)=>(
            <div key={key} className={styles.serviceItem}>
                <h3>{service.name}</h3>
                <p>R$ {service.value},00</p>
            </div>
        ))}
    </div>
  )
}
