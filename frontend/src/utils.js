

export const currentUrl = () => {
    const pathname = window.location.pathname;
    return pathname === "/" ? pathname : pathname.replace(/\/$/, ""); // Ensure no trailing slash
};



  export const  getAdminStatus = () => {
    const cookies = document.cookie.split(';');
    let isAdmin = null;
    let isSuperAdmin = null;

    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'isAdmin') {
            isAdmin = value;
        }
        if (name === 'isSuperAdmin') {
            isSuperAdmin = value;
        }
    });

    return {
        isAdmin,
        isSuperAdmin
    };
}

