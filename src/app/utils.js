
export const admin_nav_options = [
    { label: 'Profile', href: "/profile" },
    { label: 'Users', href:"/users" },
]

export const banker_nav_options = [
    { label: 'Profile', href: "/profile" },
    { label: 'Users', href: "/users" },
    { label: 'Bank Accounts', href: "/bank-accounts" },
    { label: 'Cards', href: "/cards" },
    { label: 'Bank Account Applications', href: "/bank-accounts-applications" },
    { label: 'Card Applications', href: "/cards-application" },
]   

export const client_nav_options = [
    { label: 'Profile', href: "/profile" },
    { label: 'Bank Accounts', href: "/bank-accounts" },
    { label: 'Cards', href: "/cards" },
    { label: 'Transactions', href: "/transactions" },
    { label: 'Bank Account Applications', href: "/bank-accounts-applications" },
    { label: 'Card Applications', href: "/cards-application" },
]

export function get_nav_options(user_role){
    if(user_role == "admin"){
        return admin_nav_options
    }else if(user_role == "banker"){
        return banker_nav_options
    }else if(user_role == "client"){
        return client_nav_options
    }
}