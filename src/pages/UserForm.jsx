import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useAxios from '../hooks/useAxios'
import useNotificationStore from '../store/useNotificationStore'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'

const UserForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const axios = useAxios()
    const notify = useNotificationStore((state) => state.notify)

    const [roles, setRoles] = useState([])
    const [userForm, setUserForm] = useState({ name: '', email: '', roles: [] })
    const [isSaving, setIsSaving] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    const getRoles = () => {
        axios.get('/roles')
            .then((response) => {
                setRoles(response.data)
            })
            .catch((error) => {
                notify({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message
                })
            })
    }

    const getUser = () => {
        if(id) {
            notify({
                severity: 'info',
                summary: 'Info',
                detail: 'Loading user data...',
                loading: true
            })

            axios.get(`/users/${id}`)
                .then((response) => {
                    notify({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Fetched user data for edit.'
                    })

                    let user = response.data
                    setUserForm({
                        name: user.name,
                        email: user.email,
                        roles: user.user_roles_id ? user.user_roles_id.split(',').map(id => Number(id)) : []
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
        getRoles()
        getUser()
    }, [])

    const handleInputChange = (e) => {
        setUserForm((prevState) => ({ 
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
 
    const createUser = () => {
        setIsSaving(true)

        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Creating user...',
            loading: true
        })

        axios.post('/users', userForm)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                navigate('/users')
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

    const updateUser = () => {
        setIsSaving(true)

        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Updating user...',
            loading: true
        })

        axios.patch(`/users/${id}`, userForm)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                navigate('/users')
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
            updateUser()
        } else {
            createUser()
        }
    }

    return (
        <form onSubmit={ handleSubmit } className="w-5">
            <h3>{ id ? 'Update User' : 'Create User' }</h3>
            <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="name" className={ `text-sm ${ !!formErrors.name ? 'p-error' : '' }` }>Name</label>
                <InputText
                    id="name"
                    name="name"
                    value={ userForm.name } 
                    onChange={ handleInputChange } 
                    className={ `text-sm text-gray-900 ${ !!formErrors.name ? 'p-invalid' : '' }` } 
                />
                { getFormErrorMessage('name') }
            </div>

            <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="email" className={ `text-sm ${ !!formErrors.email ? 'p-error' : '' }` }>Email</label>
                <InputText
                    id="email"
                    name="email"
                    value={ userForm.email } 
                    onChange={ handleInputChange } 
                    className={ `text-sm text-gray-900 ${ !!formErrors.email ? 'p-invalid' : '' }` } 
                />
                { getFormErrorMessage('email') }
            </div>

            <div className="flex flex-column gap-2 mb-3">
                <label htmlFor="roles" className={ `text-sm ${ !!formErrors.roles ? 'p-error' : '' }` }>Roles</label>
                <MultiSelect 
                    id="roles"
                    name="roles"
                    value={ userForm.roles } 
                    onChange={ handleInputChange } 
                    options={ roles } 
                    optionLabel="role" 
                    optionValue="id"
                    placeholder="Select Roles" 
                    className={ `text-sm text-gray-900 ${ !!formErrors.roles ? 'p-invalid' : '' }` } 
                />
                { getFormErrorMessage('roles') }
            </div>
            
            <div className="flex justify-content-end mt-4">
                <Button type="button" onClick={ () => navigate('/users') } severity="secondary" outlined label="Cancel" disabled={ isSaving } size="small" className="text-sm mr-1" />
                <Button type="submit" label="Submit" disabled={ isSaving } size="small" className="text-sm"  />
            </div>
        </form>
    ) 
}

export default UserForm