import React from 'react'
import './Button.scss'

export function Button(props) {
    const color = props.color

    return (
        <button id="component-button" onClick={props.onClick} className={color}>
            {props.children}
        </button>
    )
}