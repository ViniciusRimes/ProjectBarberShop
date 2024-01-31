import bus from '../helpers/bus'

export default function useFlashMessages(){
    function setFlashMessages(message, type){
        bus.emit('flash', {
            message: message,
            type: type,
        })
    }
    return {setFlashMessages}
}