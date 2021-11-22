import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'

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
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Caixa',
        path: '/caixa',
        icon: <IoIcons.IoIosPaper />,
        cName: 'nav-text'
    },
    {
        title: 'Cardapio',
        path: '/cardapio',
        icon: <FaIcons.FaCartPlus />,
        cName: 'nav-text'
    },
]