import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Modal, Input, Search, Label, Table } from 'semantic-ui-react'


import './App.css';

import Item from "./components/item";
//import Detail from "./components/detail";

const FETCHURL = "https://api.jsonbin.io/b/5a6a9226814505706ad40ea9";

class App extends Component {

  state = {
    searchText: "",
    items: [{name:"dummy", qty:0, unit:""}],
    openDetail: false,
    detailTitle: 'Placeholder Item',
    selectedItem:{name:"", qty:0, unit:""},
    newItem:{name:"", qty:0, unit:""}

  }

  componentDidMount() {
    fetch(FETCHURL)
        .then(response => response.json())
        .then(data => this.setState({items:data.Items}));
  }

  deleteItem = (item, e) => {
    const items = Object.assign([], this.state.items);
    const index = items.indexOf(item);
    items.splice(index,1);
    this.setState({items:items});
  }

  addItem = (e) => {
    if (this.state.searchText.length > 0) {
      const items = Object.assign([], this.state.items);
      const item = { name: this.state.searchText };
      items.push(item);
      this.setState({items:items});
    }
  }

  changeSearchText = (e) => {
      this.setState({searchText: e.target.value});
  }

  clearSearchText = (e) => {
    this.setState({searchText: ""});
  }

  openDetail = (e) => {
    this.setState({openDetail: true, detailTitle: e.target.value});
  }

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.unit = e.children;
    _item.qty = this.state.selectedItem.qty;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openDetail:false});
  }
 
  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    this.setState({selectedItem:item, openDetail: true, newItem:item});
  }

  closeDetail = (item,e) => {
    this.setState({openDetail: false});  
  }

  setQty = (item,e) => {
    const _newItem = Object.assign({}, this.state.selectedItem);
     _newItem.qty = e.value; 
    this.setState({selectedItem: _newItem});
    console.log(this.state.selectedItem.qty);
  }

  findItemIndexByName = (item) => {
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].name === item.name) 
        return i;
    }
    return -1;
  }

  render() {
    const items = this.state.items.filter((item, index) => {
      if (item.name.toUpperCase().includes(this.state.searchText.toUpperCase()))
        return true;
      else
        return false;
    }).map((item,index) => {
      return (
        <Item
          key={item.name}
          qty={item.qty}
          unit={item.unit}
          deleteEvent={this.deleteItem.bind(this, item)}
          rowClickEvent={this.handleClick.bind(this, item)}
        > {item.name}</Item>)
    }) 

    const similarItems = this.state.items.filter((item, index) => {
      if (item.name.toUpperCase().includes("APP"))
        return true;
      else
        return false;
    }).map((item,index) => {
      return (
        <Item
          key={item.name}
          qty={item.qty}
          unit={item.unit}
          deleteEvent={this.deleteItem.bind(this, item)}
          rowClickEvent={this.handleClick.bind(this, item)}
        > {item.name}</Item>)
    })     

    return (
      <div>
        <Sidebar.Pushable as={Segment} >
          <Sidebar as={Menu}  width="wide" animation='push' direction='top' visible={true} inverted>
          <Search showNoResults={false} fluid={true} style={{margin:10}} size="small"
              onSearchChange={this.changeSearchText}
              {...this.props}
            />
            <Button primary style={{position: 'absolute', right: 0, margin:10}}>Send</Button>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Table selectable={true} unstackable={true}  basic="very" striped={false} style={{marginTop: 10, width:"100%"}}>
                {/* <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Item</Table.HeaderCell>
                    <Table.HeaderCell style={{width: '10%'}}>Qty</Table.HeaderCell>
                    <Table.HeaderCell style={{width: '10%'}}>Unit</Table.HeaderCell>
                  </Table.Row>
                </Table.Header> */}
                <Table.Body >
                  {items}
                </Table.Body>
              </Table>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Modal size="tiny"   dimmer={true} open={this.state.openDetail} onClose={this.closeDetail} closeIcon={false}>
          <Modal.Header>{this.state.selectedItem.name}</Modal.Header>
          <Modal.Content >
            <Input  maxLength="2" hint="qty" style={{width:50}} value={this.state.selectedItem.qty} onChange={this.setQty}/>    
            <Button style={{margin:4}} onClick={this.setUnit}>¼</Button>      
            <Button style={{margin:4}} onClick={this.setUnit}>½</Button>      
            <Button style={{margin:4}} onClick={this.setUnit}>¾</Button>
            <p>
              <Button style={{margin:4, width:80}} onClick={this.setUnit}>bags</Button>      
              <Button style={{margin:4, width:80}} onClick={this.setUnit}>bin</Button>      
              <Button style={{margin:4, width:80}} onClick={this.setUnit}>boxes</Button>
              <Button style={{margin:4, width:80}} onClick={this.setUnit}>shelf</Button>      
              <Button style={{margin:4, width:80}} onClick={this.setUnit}>trays</Button>      
            </p>
            <Table selectable={true} unstackable={true}  basic="very" striped={false} style={{marginTop: 10, width:"100%"}}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='3'>SIMILAR ITEMS</Table.HeaderCell>
              </Table.Row>
            </Table.Header>            
            <Table.Body >
                  {similarItems}
                </Table.Body>
              </Table>
          </Modal.Content>
          <Modal.Actions>

            {/* <Button color='black' onClick={this.closeDetail}>CANCEL</Button>
            <Button positive icon='checkmark' labelPosition='right' content="OK" onClick={this.submitDetail} /> */}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
