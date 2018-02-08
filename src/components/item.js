import React from 'react';
import {Table} from 'semantic-ui-react'

const item = (props) => {
    return (
        <Table.Row onClick={props.rowClickEvent} 
            active={props.item.name === props.selectedItem.name}
            warning={props.item.qty.length === 0 && props.item.unit.length > 0} 
            positive={props.item.qty.length > 0}>
            <Table.Cell width={12}> {props.children}</Table.Cell>
            <Table.Cell width={4}>
                { props.item.qty + " " + props.item.unit}
            </Table.Cell>
        </Table.Row>
    )
}

export default item;