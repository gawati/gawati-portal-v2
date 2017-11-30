import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {NavLink} from 'react-router-dom';

import DivFeed from '../components/DivFeed';

import {apiGetCall} from '../api';
import {Aux, prefixIri, getDocumentType, getDocTypes, isEmpty, getDocType} from '../utils/generalhelper';
import {anPublication} from '../utils/akomantoso';
import ExprAbstract from './ExprAbstract';
import Paginator from '../components/Paginator';

import '../css/react-tabs.css';
import 'react-tabs/style/react-tabs.css';
import '../css/ListingContentColumn.css';

import linkIcon from '../images/export.png';


const DocumentLoading = () => 
    <div className={ `left col-9`}>
        <div className="search-result">
        Loading...
        </div>
    </div>;



class ListThemeContentColumn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            lang: this.props.match.params['lang'],
            count: this.props.match.params['count'],
            from: this.props.match.params['from'],
            to: this.props.match.params['to'],
            themes : this.props.match.params['themes'],
            records: 0,
            totalPages: 0,
            orderedBy: '',
            loading: true,
            listing: undefined
        };
      
    }
   
    getListing(paramsObj) {
        let apiRecent = apiGetCall(
            'themes-summary', 
            paramsObj
        );
        axios.get(apiRecent)
            .then(response => {
                const items = response.data.exprAbstracts;
                console.log(" ITEMS ", items);
                this.setState({
                    loading: false,
                    from: parseInt(items.itemsfrom),
                    count: parseInt(items.pagesize),
                    to: parseInt(items.itemsfrom) + parseInt(items.pagesize) - 1,
                    records: parseInt(items.records),
                    totalPages: parseInt(items.totalpages),
                    orderedBy: items.orderedby,
                    currentPage: parseInt(items.currentpage),
                    listing: items.exprAbstract
                });
            })
            .catch(function(error) {
                console.log("error in getDocument()", error);
            });
    }


   
    componentDidMount() {
        this.getListing({themes: this.state.themes.split("|") , count: this.state.count, from: this.state.from, to: this.state.to});
    }

    componentDidUpdate() {
       // this.getListing({})
    }

    onChangePage(newPage) {
        console.log (" NEW PAGE ", newPage);
        this.getListing(newPage);
        //this.setState({loading: true}, 
        //    () => {
        //        this.getListing({count: newPage.count, from: newPage.from, to: newPage.to});
        //    }
        //);
    }

    generatePagination = () => {
        var pagination = {
            count: this.state.count,
            from: this.state.from,
            to: this.state.to,
            lang: this.state.lang,
            totalPages: this.state.totalPages,
            records: this.state.records
        };
        Object.keys(pagination).map(k => pagination[k] = k === 'lang' ? pagination[k] : parseInt(pagination[k]));
        return pagination;  
    }


    render() {
        if (this.state.listing === undefined ) {
            return (
                <DocumentLoading />
            );
        } else {        
            let pagination = this.generatePagination() ;
            let content = 
            <div className={ `left col-9`}>
                <div className="search-result">
                    <h1 className="listingHeading">Recent Documents</h1>
                    <DivFeed>
                        <Paginator pagination={pagination} onChangePage={this.onChangePage.bind(this)} />
                    </DivFeed>
                    {
                    this.state.listing.map(abstract => {
                        return (
                        <ExprAbstract key={abstract['expr-iri']} abstract={abstract} />   
                        )
                    })
                    }
                <DivFeed>
                <Paginator pagination={pagination} onChangePage={this.onChangePage.bind(this)} />
                </DivFeed>
                </div>
            </div>
            ;
    return content;
    }
    }
}

/*
const Loading = ({tab}) => 
    <div className={ `tab-pane tab-active` } data-tab="t`${tab}`">
        Loading...
    </div>;
*/

export default ListThemeContentColumn;

