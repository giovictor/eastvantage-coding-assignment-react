import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import useAxios from '../hooks/useAxios'
import useNotificationStore from '../store/useNotificationStore'
import { DateTime } from 'luxon'

const Roles = () => {
    const axios = useAxios()
    const notify = useNotificationStore((state) => state.notify)

    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])

    const getRoles = () => {
        setLoading(true)

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
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getRoles()
    }, [])

    const header = (
        <div className="flex align-items-center justify-content-start p-2">
            <NavLink to={ `/roles/create` }>
                <Button 
                    label="Add Roles" 
                    icon="pi pi-plus" 
                    iconPos="right" 
                    className="uppercase text-sm px-3 py-2" 
                    size="small"  
                />
            </NavLink>
        </div>
    )

    const createdAt = (rowData) => {
        return rowData.created_at ? DateTime.fromISO(rowData.created_at).toFormat('yyyy-LL-dd HH:mm:ss') : '-'
    }

    const updatedAt = (rowData) => {
        return rowData.updated_at ? DateTime.fromISO(rowData.updated_at).toFormat('yyyy-LL-dd HH:mm:ss') : '-'
    }

    const action = (rowData) => {
        return (
            <>
                <NavLink to={ `/roles/update/${rowData.id}` }>
                    <Button 
                        icon="pi pi-pencil" 
                        rounded 
                        text
                        severity="info"
                        aria-label="Update role" 
                        tooltip="Update role"  
                        tooltipOptions={{ position: 'left' }}
                    />
                </NavLink>

                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    text 
                    aria-label="Delete role" 
                    tooltip="Delete role"  
                    tooltipOptions={{ position: 'left' }}
                    onClick={ () => showConfirmDelete(rowData) }
                />  
            </>
        )
    }

    const showConfirmDelete = (role) => {
        confirmDialog({
            message: `Are you sure you want to delete role "${role.role}"? This will also delete assigned roles for users.`,
            header: 'Confirm Delete Role',
            icon: 'pi pi-info-circle',
            accept: () => deleteRole(role.id)
        })
    }

    const deleteRole = (roleId) => {
        notify({
            severity: 'info',
            summary: 'Info',
            detail: 'Deleting role...',
            loading: true
        })

        axios.delete(`/roles/${roleId}`)
            .then((response) => {
                notify({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.message
                })

                setRoles(roles.filter((role) => role.id != roleId))
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
                    value={ roles }
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
                        header="Role ID"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                    />

                    <Column
                        field="role"
                        header="Role"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                    />

                    <Column
                        field="created_at"
                        header="Created Date"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                        body={ createdAt }
                    />

                    <Column
                        field="updated_at"
                        header="Last Updated"
                        sortable
                        filter
                        filterPlaceholder="Search"
                        filterMatchMode="contains"
                        showFilterMenu={ false }
                        body={ updatedAt }
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

export default Roles