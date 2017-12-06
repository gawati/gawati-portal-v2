import React from 'react';
import { NavLink } from 'react-router-dom';
import {shortTitle, getDocType} from '../utils/generalhelper';
import {anPublication, anFRBRcountry} from '../utils/akomantoso';

const CategoryLink = ({type}) => 
    <NavLink to="/">{ getDocType(type)['category']}</NavLink>;

const HomeLink = () => 
    <NavLink to="/">Home</NavLink>;


function DocumentBreadcrumb({doc, type}) {
       
        return (
            <div className="breadcrumb-gw">
                <span className=""><HomeLink /> &gt; <CategoryLink type={type} /> &gt; 
                <NavLink to="/">{ anFRBRcountry(doc, type)['showAs'] }</NavLink> &gt;</span>
                <span>{
                    shortTitle(
                        anPublication(doc, type)['showAs']
                    )
                        }</span>
                </div>
        );
}

export default DocumentBreadcrumb;