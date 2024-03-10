import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import useAxios from '../hooks/useAxios'
import useNotificationStore from '../store/useNotificationStore'

const Users = () => {
    const axios = useAxios()
    const notify = useNotificationStore((state) => state.notify)

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])

    const getUsers = () => {
        setLoading(true)

        axios.get('/users')
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => {
                notify({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getUsers()
    }, [])

    const header = (
        <div className="flex align-items-center justify-content-start p-2">
            <NavLink to={ `/users/create` }>
                <Button 
                    label="Add User" 
                    icon="pi pi-plus" 
                    iconPos="right" 
                    className="uppercase text-sm px-3 py-2" 
                    size="small"  
                />
            </NavLink>
        </div>
    )

    const userRoles = (rowData) => {
        return rowData.user_roles ? rowData.user_roles.split(',').join(', ') : '-'
    }

    const action = (rowData) => {
        return (
            <>
                <NavLink to={ `/users/update/${rowData.id}` }>
                    <Button 
                        icon="pi pi-pencil" 
                        rounded 
                        text
                        severity="info"
                        aria-label="Update user" 
                        tooltip="Update user"  
                        tooltipOptions={{ position: 'left' }}
                    />
                </NavLink>

                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    text 
                    aria-label="Delete user" 
                    tooltip="Delete user"  
                    tooltipOptions={{ position: 'left' }}
                    onClick={ () => showConfirmDelete(rowData) }
                />  
            </>
        )
    }

    const showConfirmDelete = (user) => {
        confirmDialog({
            message: `Are you sure you want to delete user "${user.name}"?`,
            header: 'Confirm Delete User',
            icon: 'pi pi-info-circle',
            accept: () => deleteUser(user.id)
        })
    }

    const deleteUser = (userId) => {
        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Deleting user...',
            loading: true
        })

        axios.delete(`/users/${userId}`)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                setUsers(users.filter((user) => user.id != userId))
            })
            .catch((error) => {
                notify({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data.message
                })
            })
    }

    return (
        <>
            <Card>
                <DataTable
                    value={ users }
                    header={ header }
                    filterDisplay="row"
                    dataKey="id"
                    paginator
                    rows={ 10 }
                    rowsPerPageOptions={ [5, 10, 20, 50, 100] }
                    removableSort={ true }
                    filterDelay={ 500 }
                    loading={ loading }
                    tableStyle={{ minWidth: "75rem" }}
                >
                     <Column
                        field="id"
                        header="User ID"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                    />

                    <Column
                        field="name"
                        header="Name"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                    />

                    <Column
                        field="email"
                        header="Email"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                    />

                    <Column
                        field="user_roles"
                        header="Roles"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                        body={ userRoles }
                    />

                    <Column
                        header="Action"
                        body={ action }
                    />
                </DataTable>
            </Card>

            <ConfirmDialog dismissableMask={ true } />
        </>
    )
}

export default Users