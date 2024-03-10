import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useAxios from '../hooks/useAxios'
import useNotificationStore from '../store/useNotificationStore'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

const RoleForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const axios = useAxios()
    const notify = useNotificationStore((state) => state.notify)

    const [roleForm, setRoleForm] = useState({ role: '' })
    const [isSaving, setIsSaving] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    const getRole = () => {
        if(id) {
            notify({
                severity: 'info',
                summary: 'Info',
                detail: 'Loading role data...',
                loading: true
            })

            axios.get(`/roles/${id}`)
                .then((response) => {
                    notify({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Fetched role data for edit.'
                    })

                    setRoleForm({
                       role: response.data.role
                    })
                })
                .catch((error) => {
                    notify({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message
                    })
                })
        }
    }

    useEffect(() => {
        getRole()
    }, [])

    const handleInputChange = (e) => {
        setRoleForm((prevState) => ({ 
            ...prevState, 
            [e.target.name]: e.target.value 
        }))
        clearErrorOnChange(e.target.name)
    }

    const handleValidationErrorMessages = (error) => {
        if(error.status == 422 && error.data?.errors) {
            let errors = {}

            Object.keys(error.data.errors).forEach(key => {
                errors[key] = error.data.errors[key][0]
            })

            setFormErrors((prevState) => ({
                ...prevState,
                ...errors
            }))
        }
    }

    const clearErrorOnChange = (name) => {
        let errors = { ...formErrors }
        delete errors[name]        
        setFormErrors(errors)
    }

    const getFormErrorMessage = (name) => {
        return (
            formErrors[name] && <small className="text-sm p-error">{ formErrors[name] }</small>
        )
    }
 
    const createRole = () => {
        setIsSaving(true)

        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Creating role...',
            loading: true
        })

        axios.post('/roles', roleForm)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                navigate('/roles')
            })
            .catch((error) => {
                notify({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message
                })

                handleValidationErrorMessages(error.response)
            })
            .finally(() => {
                setIsSaving(false)
            })
    }

    const updateRole = () => {
        setIsSaving(true)

        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Updating role...',
            loading: true
        })

        axios.patch(`/roles/${id}`, roleForm)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                navigate('/roles')
            })
            .catch((error) => {
                notify({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message
                })

                handleValidationErrorMessages(error.response)
            })
            .finally(() => {
                setIsSaving(false)
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(id) {
            updateRole()
        } else {
            createRole()
        }
    }

    return (
        <form onSubmit={ handleSubmit } className="w-5">
            <h3>{ id ? 'Update Role' : 'Create Role' }</h3>
            <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="role" className={ `text-sm ${ !!formErrors.role ? 'p-error' : '' }` }>Role</label>
                <InputText
                    id="role"
                    name="role"
                    value={ roleForm.role } 
                    onChange={ handleInputChange } 
                    className={ `text-sm text-gray-900 ${ !!formErrors.role ? 'p-invalid' : '' }` } 
                />
                { getFormErrorMessage('role') }
            </div>
            
            <div className="flex justify-content-end mt-4">
                <Button type="button" onClick={ () => navigate('/roles') } severity="secondary" outlined label="Cancel" disabled={ isSaving } size="small" className="text-sm mr-1" />
                <Button type="submit" label="Submit" disabled={ isSaving } size="small" className="text-sm"  />
            </div>
        </form>
    ) 
}

export default RoleForm