import bus from '../helpers/bus'

export default function useFlashMessages(){
    function setFlashMessages(message, type, time){
        bus.emit('flash', {
            message: message,
            type: type,
            time: time
        })
    }
    return {setFlashMessages}
}