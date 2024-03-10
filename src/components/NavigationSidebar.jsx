import { NavLink } from 'react-router-dom'

import { Sidebar } from 'primereact/sidebar'
import { Menu } from 'primereact/menu'

const NavigationSidebar = () => {
    let items = [
        { separator: true },
        { 
            template: () => {
                return (
                    <NavLink to="/users" className="w-full p-link flex align-items-center p-3 pl-5 text-color hover:surface-200 border-noround no-underline">
                        <i className="pi pi-user"></i>
                        <span className="ml-4">Users</span>
                    </NavLink>
                )
            }
        },
        { 
            template: () => {
                return (
                    <NavLink to="/roles" className="w-full p-link flex align-items-center p-3 pl-5 text-color hover:surface-200 border-noround no-underline">
                        <i className="pi pi-users"></i>
                        <span className="ml-4">Roles</span>
                    </NavLink>
                )
            }
        }
    ]

    return (
        <>
            <Sidebar
                className="sidebar relative"
                visible={ true }
                modal={ false }
                dismissable={ false }
                showCloseIcon={ false }
                header="User Management System"
            >
                <Menu model={items} className="w-full border-none text-3xl p-0" />
            </Sidebar>
        </>
    )
}

export default NavigationSidebar