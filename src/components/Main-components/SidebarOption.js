import React from 'react';
import '../../css/SidebarOption.css';

function SidebarOption({text, Icon, link, collapsed}) {
    
    let lastURL = "/" + window.location.href.substring(window.location.href.lastIndexOf("/")+1) 

/*--------------- Return (Render Elements) ---------------*/
    return (
        <div className="sidebarOption" onClick={(e) => {e.preventDefault() 
            window.location.href=link}}
            style={lastURL===link ? {backgroundColor: "#89C2D9", color:"white"}:{}}
        >
            <Icon/>
            <h4 style={{display: !collapsed ? "block" : "none"}} className="sidebarOption-text">{text}</h4>
        </div>
    )
}

export default SidebarOption