import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import DivFeed from '../components/DivFeed';

import {apiGetCall} from '../api';
import {Aux, prefixIri, getDocumentType, getDocTypes, isEmpty, getDocType, displayDate, randomInt, insertIntoArray} from '../utils/generalhelper';
import {anPublication, anFRBRnumber, anKeywords, anTLCConcept} from '../utils/akomantoso';
import {gawatiDateEntryInForce} from '../utils/gawati';

import DocumentBreadcrumb from './DocumentBreadcrumb';
import DocumentNavBlock from './DocumentNavBlock';
import DocumentSignature from './DocumentSignature';
import DocumentActions from './DocumentActions';
import 'react-tabs/style/react-tabs.css';
import '../css/react-tabs.css';
import '../css/DocumentTagCloud.css';
import linkIcon from '../images/export.png';


const DocumentLoading = () => 
    <div className={ `left col-9`}>
        <div className="search-result">
        Loading...
        </div>
    </div>;

const DocumentTitle = ({doc, type}) =>
    <h1>{anPublication(doc, type)['showAs']}</h1>;


const DocumentPartOf = ({doc, type}) => {
    return (
        <div className="part-of"> Part of the <a href="#"> Mixed Market Act 1991</a>. Work <a
        href="#">Search within this Work</a> &#160;| &#160;<a href="#">Timeline of the
        Work</a>
        </div>
    );
}

const DocumentTagCloud = ({doc, type}) => {
    let kws = anKeywords(doc, type);
    if (Array.isArray(kws)) {
        return (
            <div className="tag-cloud">
            <strong>TAGS:</strong>&#160;
                {
                kws.map(
                    (item) => {
                        let randint = randomInt(14, 28);
                        return (
                        <span key={item.value} className={ `text-span-${randint} tag-item` }>{item.showAs} </span>
                        );
                    }
                )
                }
            </div>
        );
    } else {
        return (
            <div className="tag-cloud">
            <span className="text-span-18">{kws.showAs}</span>
            </div>
        );
    }
        /*
    return (
        <div className="tag-cloud" >
            <span className="text-span-14">act </span><span className="text-span-13">Administrative
                </span><span className="text-span-27">assigned </span><span>body </span><span
                className="text-span-15">cabinet </span><span>case </span><span className="text-span-28"
                >chief </span><span className="text-span-20">citizen </span><span>citizenship
                </span><span>commission </span><span className="text-span-21">contolled
                </span><span>copy </span><span>corporate </span><span className="text-span-30"
                >deleted</span> deparment <span className="text-span-22">digital </span><span
                className="text-span-12">director</span>
            <span className="text-span-23">document </span>electronic <span>entity </span><span
                className="text-span-29">exempt </span><span>form </span><span className="text-span-16"
                >generated </span><span className="text-span-17">government
                </span><span>individual</span>
            <span className="text-span-19">information </span><span className="text-span-18"
                >justice</span>
        </div>
    ); 
    */
}

const getThemes = (doc, type) => {
    let tlcc = anTLCConcept(doc, type);
    if (Array.isArray(tlcc)) {
       let tlccArr = 
        insertIntoArray(
            tlcc.filter(
                concept => concept.href.startsWith('/ontology/Concept')
            ).map(
                concept => <span className="text-span-19" key={concept.eId}>{concept.showAs}</span>
            ),
            ' \u00B7 '
        );
        return tlccArr;
    } else {
        return (
            <span className="text-span-19">{tlcc.showAs}</span>
        )
    }
};

const DocumentMetadata = ({doc, type}) => {
    console.log("DOCUMENTMETADATA DOC TYPE ", doc, type);
    return(
        <ul className="metadata">
            <li><strong>Document Number:</strong> {anFRBRnumber(doc, type).showAs}</li>
            <li><strong>Entry into Force date:</strong>  {displayDate(gawatiDateEntryInForce(doc, type).date)}</li>
            <li><strong>Themes:</strong>  {getThemes(doc, type)}</li>
        </ul>
    );
} 

const DocumentContentInfo = ({doc, type}) => {
    return (
        <Tabs>
        <TabList>
          <Tab>Metadata</Tab>
          <Tab>PDF</Tab>
        </TabList>
        <TabPanel>
          <DivFeed>
            <DocumentMetadata doc={doc} type={type} />
           </DivFeed>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    );
}
 
DocumentContentInfo.propTypes = DocumentMetadata.propTypes = {
    doc: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
}

class DocumentContentColumn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            lang: this.props.match.params['lang'],
            iri: prefixIri(this.props.match.params['iri']),
            loading: true,
            docType : '',
            doc: {
            }
        };
    }
   
    getDocument(iri) {
        let apiDoc = apiGetCall(
            'doc', {
                iri : iri
            } 
        );
        axios.get(apiDoc)
            .then(response => {
                const doc = response.data;
                this.setState({
                    loading: false,
                    doc: doc,
                    docType: getDocumentType(doc)
                });
                /*
                const content = response.data.exprAbstracts.exprAbstract;
                this.setState({ 
                    latest: {
                        loading: false, 
                        content : content
                    }
                });
                */
            })
            .catch(function(error) {
                console.log("error in getDocument()", error);
            });
    }


   
    componentDidMount() {
        this.getDocument(this.state.iri);
        
    }

    render() {
        if (this.state.doc === undefined || isEmpty(this.state.doc)) {
            return (
                <DocumentLoading />
            );
        } else {        
            console.log("DOC TYPES ", getDocTypes(), getDocType('act'));
            let content = 
            <div className={ `left col-9`}>
                <div className="search-result">
                    <DocumentBreadcrumb doc={this.state.doc} type={this.state.docType} />
                    <div className={ `feed w-clearfix`}>
                        <DocumentTitle doc={this.state.doc} type={this.state.docType} />
                        <DocumentNavBlock doc={this.state.doc} type={this.state.docType} />
                        <DocumentSignature doc={this.state.doc} type={this.state.docType} />
                        <DocumentActions doc={this.state.doc} type={this.state.docType} />
                        <DocumentTagCloud doc={this.state.doc} type={this.state.docType} />
                        <DocumentContentInfo doc={this.state.doc} type={this.state.docType} />
                    </div>
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

export default DocumentContentColumn;

