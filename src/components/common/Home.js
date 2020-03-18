import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Home extends Component{
    constructor(props){
        super(props);
        console.log(props.location.pathname);
        console.log('mspa_user',sessionStorage.getItem("mspa_user")===null);
    }
    render(){
        const sidebarArr = sessionStorage.getItem('sidebarArr')? JSON.parse(sessionStorage.getItem('sidebarArr')):[]
        return(
            sessionStorage.getItem("mspa_user")===null?
            <Redirect to="/login"/>:
            <Redirect to={`/project/${sidebarArr[0]?sidebarArr[0].href:'/project'}`}/>
        )
    }
}