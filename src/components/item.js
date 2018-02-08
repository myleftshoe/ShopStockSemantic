import React from 'react';
import {Table} from 'semantic-ui-react'

const item = (props) => {
    return (
        <Table.Row onClick={props.rowClickEvent}>
            <Table.Cell width={12}> {props.children}</Table.Cell>
            <Table.Cell width={4} >
                { props.qty + " " + props.unit}
            </Table.Cell>
        </Table.Row>
    )
}

export default item;