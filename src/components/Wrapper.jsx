import { Outlet } from 'react-router-dom'
import NavigationSidebar from './NavigationSidebar'

const Wrapper = () => {
    return (
        <>
            <NavigationSidebar />

            <div className="my-6" style={{ marginLeft: '23rem', marginRight: '3rem' }}>
                <Outlet />
            </div>
        </>
    )
}

export default Wrapper
