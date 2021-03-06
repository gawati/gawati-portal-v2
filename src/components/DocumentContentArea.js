import React from 'react';

import DocumentContentColumn from '../containers/DocumentContentColumn';
import SideBarColumn from './SideBarColumn';
import Section from './Section';

class DocumentContentArea  extends React.Component { //({ match, setCollapsible, slideToggle, setFlexDirection }) {

    constructor(props) {
        super(props);
        this.state = {
            el: null,
            flexDirection: null
        };
        this.setFlexDirection = this.setFlexDirection.bind(this);
    }


    setFlexDirection = (el) => {
        if (el) {
            this.el = el;
        }
    }

    componentDidMount = () => {
        if (this.el) {
            this.setState({'flexDirection': window.getComputedStyle(this.el,null).flexDirection});
        }
    }

    render () {
        return (
            <Section setFlexDirection={this.setFlexDirection} altClasses="notHome">
                <DocumentContentColumn match={this.props.match} />
                <SideBarColumn match={this.props.match} setCollapsible={this.props.setCollapsible} slideToggle={this.props.slideToggle} flexDirection={this.state.flexDirection}/>
            </Section>
        );
    }
}

export default DocumentContentArea;
