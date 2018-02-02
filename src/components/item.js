import React from 'react';
import {Table} from 'semantic-ui-react'

const item = (props) => {
    return (
        <Table.Row onClick={props.rowClickEvent}>
            <Table.Cell>{props.children}</Table.Cell>
            {/* <Table.Cell>{props.qty}</Table.Cell> */}
            {/* <TextField hintText="Hint Text" defaultValue={props.qty}></TextField>             */}
            <Table.Cell float="right">
                { props.qty + " " + props.unit}
            </Table.Cell>

            {/* <Table.Cell>
                <Button onClick={props.deleteEvent}>Delete</Button>
            </Table.Cell> */}
        </Table.Row>
    )
}

export default item;