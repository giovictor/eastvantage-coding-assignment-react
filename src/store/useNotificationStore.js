import { create } from 'zustand'

const useNotificationStore = create((set) => ({
    notification: {
        severity: 'info',
        summary: '',
        detail: '',
        duration: 5000,
        loading: false,
        position: {
            vertical: 'top',
            horizontal: 'right',
        },
        stack: false
    },
    notifyTrigger: false,
    notify: (data) => set({
        notification: {
            severity: data.severity,
            summary: data.summary,
            detail: data.detail,
            duration: data.hasOwnProperty('duration') ? data.duration : 5000,
            loading: data.hasOwnProperty('loading') ? data.loading : false,
            position: {
                vertical: data.position?.vertical || 'top',
                horizontal: data.position?.horizontal || 'right',
            },
            stack: data.hasOwnProperty('stack') ? data?.stack : false
        },
        notifyTrigger: true
    }),
    resetNotifyTrigger: () => set({ notifyTrigger: false }),
}))

export default useNotificationStore
