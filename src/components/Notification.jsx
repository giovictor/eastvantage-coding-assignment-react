import { useRef, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import useNotificationStore from '../store/useNotificationStore'

const Notification = () => {
    const toast = useRef(null)
    const notifyTrigger = useNotificationStore((state) => state.notifyTrigger)
    const notification = useNotificationStore((state) => state.notification)
    const resetNotifyTrigger = useNotificationStore((state) => state.resetNotifyTrigger)

    const showToast = () => { 
        toast.current.show({
            severity: notification.severity,
            summary: notification.summary,
            detail: notification.detail,
            life: notification.duration,
            closable: notification.loading ? false : true,
            sticky: notification.loading ? true : false,
            icon: notification.loading ? 'pi pi-spin pi-spinner' : '',
        })
    }

    useEffect(() => {
        if(notifyTrigger) {
            if(!notification.stack) {
                toast.current.clear()
            }

            showToast()
            resetNotifyTrigger()
        }
    }, [notifyTrigger])

    return (
        <Toast 
            ref={ toast } 
            position={ `${notification.position.vertical}-${notification.position.horizontal}` } 
        />
    )
}

export default Notification