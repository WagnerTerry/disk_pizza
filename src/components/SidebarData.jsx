import React from 'react'
//import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
//import * as IoIcons from 'react-icons/io'
import { MdAssignment } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { MdRestaurantMenu } from "react-icons/md";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Cadastro',
        path: '/cadastro',
        icon: <MdAssignment />,
        cName: 'nav-text'
    },
    {
        title: 'Caixa',
        path: '/caixa',
        icon: <MdAttachMoney />,
        cName: 'nav-text'
    },
    {
        title: 'Cardapio',
        path: '/cardapio',
        icon: <MdRestaurantMenu />,
        cName: 'nav-text'
    },
]