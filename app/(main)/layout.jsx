import React from 'react'
import AppHeader from './_component/AppHeader'


function DashboardLayou({ children }) {
    return ( 
        <div>
            <AppHeader/>
            {children}
        </div>
    
    )
}

export default DashboardLayou