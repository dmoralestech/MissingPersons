/**
 * Created by psenger on 12/08/2016.
 */
import React, { Component } from 'react';

export class LayOutManager extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div className={this.props.layout}>
                {([].concat(this.props.children || [])).map((item,index) => {
                    return ( <div className="layout--area" key={index}>{item}</div> );
                })}
            </div>
        )
    }
}
