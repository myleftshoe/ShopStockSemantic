import React from 'react';
import {Table, Icon} from 'semantic-ui-react'
import color from '../colors';

const item = (props) => {
    return (
        <Table.Row onClick={props.rowClickEvent} 
            style={{backgroundColor: color(props.item.tags)}}
            // active={props.item.name === props.selectedItem.name}
            // warning={props.item.qty.length === 0 && props.item.unit.length > 0} 
            // positive={props.item.qty.length > 0}
        >
            <Table.Cell width={11}> {props.children}</Table.Cell>
            {/* <Table.Cell width={5}> {props.item.tags}</Table.Cell> */}
            <Table.Cell style={{fontFamily:"Roboto Black"}}  textAlign="right" width={1}> {props.item.marked ? "!" : ""}</Table.Cell>
            <Table.Cell width={4}>
                { props.item.qty + " " + props.item.unit}
            </Table.Cell>
        </Table.Row>
    )
}

export default item;