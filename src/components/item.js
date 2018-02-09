import React from 'react';
import {Table, Icon} from 'semantic-ui-react'

const color = (tag) => {
    let color="";
    switch (tag) {
        case "Citrus" : {
            color = "#F2711F";
            break;
        }
        case "Leafy Greens" : {
            color = "DarkGreen"
            break; 
        }
        case "Berries and Grapes" : {
            color = "#6538C8"
            break;
        }        
        case "Apples and Pears" : {
            color = "#B3CB1C"
            break;
        }        
        case "Fruit Vegetable" : {
            color = "#00B3AC"
            break;
        }        
        case "Root Vegetable" : {
            color = "#A236C7"
            break;
        }        
        case "Stone Fruit" : {
            color = "#2884CF"
            break;
        }        
        case "Potatoes and Onions" : {
            color = "#A46741"
            break;
        }        
        case "Tropical Fruit and Melons" : {
            color = "#FBBC05"
            break;
        }   
        case "Sprouts" : {
            color = "#DF3C95"
            break;
        }        
        case "Cruciferous" : {
            color = "#23B947"
            break;
        }           
        case "Herbs" : {
            color = "Green"
            break;
        }           
        case "Mushrooms" : {
            color = "Tan"
            break;
        }              
        case "Salad" : {
            color = "MediumSeaGreen"
            break;
        }  
        case "Peas and Beans" : {
            color = "OliveDrab"
            break;
        }  
        case "Misc. Fruit" : {
            color = "Tomato"
            break;
        }  
        case "Stems and Roots" : {
            color = "Peru"
            break;
        }
        case "Tomatoes" : {
            color = "Maroon"
            break;
        }  
    }
    return color;
}

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