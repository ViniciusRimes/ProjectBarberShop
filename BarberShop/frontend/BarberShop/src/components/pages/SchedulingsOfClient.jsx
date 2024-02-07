import { useEffect, useState } from 'react'
import styles from './SchedulingsOfClient.module.css'
import api from '../../helpers/axios'
import {format} from 'date-fns'
import useFlashMessages from '../../hooks/useFlashMessages'
import Messages from '../layout/Messages'
import {Link} from 'react-router-dom'

const SchedulingsOfClient = () => {
    const [schedulings, setSchedulings] = useState([])
    const [tokenClient] = useState(localStorage.getItem('tokenClient'))
    const {setFlashMessages} = useFlashMessages()
    
    useEffect(()=>{
        async function fetchSchedulings(){
            try{
                const response = await api.get('/scheduling/my-schedulings', {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(tokenClient)}`
                    }
                })
                setSchedulings(response.data.map(scheduling => ({
                    ...scheduling,
                    status: scheduling.finished ? '✅': '⌛',
                })))
            }catch(error){
                console.log(error)
            }
        }
        fetchSchedulings()
    }, [])
    const cancelScheduling = async (schedulingId) =>{
        try{
            const obj = {name: ''}
            const response = await api.patch(`/scheduling/cancel/${schedulingId}`, obj, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(tokenClient)}`
                }
            })
            setFlashMessages(response.data.message, 'success', 3000)
            setTimeout(() => {
            window.location.reload()  
            }, 3000);
        }catch(error){
            setFlashMessages(error.response.data.message, 'error', 3000)
        }
    }
    return (
    <div className={styles.schedulingsOfClientPage}>
        <h2>Seus agendamentos</h2>
        {schedulings.length > 0 ?
        <>
        <div className={styles.schedulingsStatus}>Status: 
            <div>
                <p>Concluído <span>✅</span></p> <p>Em agendamento <span>⌛</span></p>
            </div>
        </div>
        <div className={styles.listSchedulings}>
            {schedulings.length > 0 && schedulings.map((scheduling, key)=>(
            <div key={key} className={styles.schedulingItem}>
                <p>{format(scheduling.date, 'dd/MM/yyyy')}</p>
                <p>{scheduling.time}</p>
                <p>{scheduling.status}</p>
                <p>{scheduling.finished ? <button className={`${styles.cancelScheduling} ${styles.cancelSchedulingFinished}`}>Cancelar</button> : 
                    <button onClick={()=> cancelScheduling(scheduling.id)} className={styles.cancelScheduling}>Cancelar</button>}
                </p>
            </div>
        ))}
        </div> </> : 
        <div className={styles.notSchedulings}>
            <p style={{marginTop: '3em'}}>Nenhum agendamento encontrado</p>
            <p>Clique abaixo e <span style={{color: '#551A8B', fontSize: '1.1em'}}>agende um horário</span>, garanto que não vai se decepcionar!</p>
            <button className={styles.goToHomeButton}>
                <Link to={'/'}>Agendar</Link>
            </button>
        </div> }
        <Messages/>
        
    </div>
  )
}

export default SchedulingsOfClient