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

  // setUnit = (item, e) => {
  //   const items = Object.assign([], this.state.items);
  //   const index = items.indexOf(item);
  //   items[index].unit = e.target.value;
  //   this.setState({items:items});    
  // }

  setUnit = (item,e) => {
    const _newItem = Object.assign({}, this.state.selectedItem);
     _newItem.unit = e.children; 
    this.setState({selectedItem: _newItem});
    console.log(this.state.selectedItem.unit);
  }

  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    this.setState({selectedItem:item, openDetail: true, newItem:item});
  }
  
  updateItems = () => {
    const items = Object.assign([], this.state.items);
    const _item = this.findItemByName(this.state.selectedItem);
    const index = items.indexOf(_item);
    console.log(index);
    items[index] = Object.assign({},this.state.selectedItem);
    this.setState({items : items});
  }

  closeDetail = (item,e) => {
    this.setState({openDetail: false});  
  }

  submitDetail = (item,e) => {
    this.updateItems();
    this.setState({openDetail: false});  
  }

  setQty = (item,e) => {
    const _newItem = Object.assign({}, this.state.selectedItem);
     _newItem.qty = e.value; 
    this.setState({selectedItem: _newItem});
    console.log(this.state.selectedItem.qty);
  }

  findItemByName = (item) => {
    return this.state.items.find(_item => {
      return _item.name === item.name
    })
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

    return (
      <div>
        <Sidebar.Pushable as={Segment} >
          <Sidebar as={Menu}  width="wide" animation='push' direction='top' visible={true} inverted>
          <Search aligned="right" fluid={true} style={{padding:10}} size="small"
              onSearchChange={this.changeSearchText}
              {...this.props}
            />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Table sortable={true} striped={true} style={{marginTop: 50, width:"100%"}}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Item</Table.HeaderCell>
                    <Table.HeaderCell style={{width: '10%'}}>Qty</Table.HeaderCell>
                    <Table.HeaderCell style={{width: '10%'}}>Unit</Table.HeaderCell>
                    {/* <Table.HeaderCell style={{width: '10%'}}>Actions</Table.HeaderCell> */}
                  </Table.Row>
                </Table.Header>
                <Table.Body >
                  {items}
                </Table.Body>
              </Table>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Modal dimmer='inverted' open={this.state.openDetail} onClose={this.closeDetail}>
          <Modal.Header>{this.state.selectedItem.name}</Modal.Header>
          <Modal.Content >
            <Input hint="qty" value={this.state.selectedItem.qty} onChange={this.setQty}/>    
            <p/>
            <Button style={{margin:4, width:80}} onClick={this.setUnit}>BAGS</Button>      
            <Button style={{margin:4, width:80}} onClick={this.setUnit}>BIN</Button>      
            <Button style={{margin:4, width:80}} onClick={this.setUnit}>BOXES</Button>
            <Button style={{margin:4, width:80}} onClick={this.setUnit}>SHELF</Button>      
            <Button style={{margin:4, width:80}} onClick={this.setUnit}>TRAYS</Button>      
            <p/>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.closeDetail}>CANCEL</Button>
            <Button positive icon='checkmark' labelPosition='right' content="OK" onClick={this.submitDetail} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
