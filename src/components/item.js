import React, {Component} from 'react';
import {Table, Icon} from 'semantic-ui-react'
import color from '../colors';

class Item extends Component {

    render() {
        const props = this.props;
        return (
            <Table.Row style={{backgroundColor: color(props.item.tags)}} 
                onClick={props.rowClickEvent} 
                // onTouchStart={props.handleButtonPress}
                // onTouchEnd={props.handleButtonRelease} 
                // onMouseDown={props.handleButtonPress} 
                // onMouseUp={props.handleButtonRelease} 
            >
                <Table.Cell width={11}>
                    {props.children}
                </Table.Cell>
                {/* <Table.Cell width={5}> {props.item.tags}</Table.Cell> */}
                <Table.Cell style={{fontFamily:"Roboto Black"}}  textAlign="right" width={1}> {props.item.marked ? "!" : ""}</Table.Cell>
                <Table.Cell width={4}>
                    { props.item.qty + " " + props.item.unit}
                </Table.Cell>
            </Table.Row>
        )
    }
}

export default Item;

