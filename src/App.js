import React, { Component } from 'react';
import {Button, Dropdown,List, Icon, Modal, Input, Search, Table, Grid, Container, Popup, Header, Menu, Segment, TransitionablePortal} from 'semantic-ui-react';

import './App.css';

import Item from "./components/item";
//import Detail from "./components/detail";

const FETCHURL = "https://api.jsonbin.io/b/5a6a9226814505706ad40ea9";
const options = [
  { key: 'BAGS', text: 'BAGS', value: 'BAGS' },
  { key: 'BOXES', text: 'BOXES', value: 'BOXES' },
  { key: 'TRAYS', text: 'TRAYS', value: 'TRAYS' },
  { key: 'BIN', text: 'BIN', value: 'BIN' },
  { key: 'SHELF', text: 'SHELF', value: 'SHELF' },  
]

class App extends Component {

  state = {
    searchText: "",
    items: [{name:"dummy", qty:0, unit:""}],
    openDetail: false,
    detailTitle: 'Placeholder Item',
    openDoneModal: false,
    donModalTitle: 'Placeholder Item',
    selectedItem:{name:"", qty:0, unit:""},
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
    console.log((this.input1));
    this.input1.setValue("");
    this.setState({searchText: ""});
  }
  handleRef = component => (this.ref = component);

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
//    _item.unit = e.value;
     _item.unit = e.children;
//    _item.qty = this.state.selectedItem.qty;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openDetail:true});
  }
 
  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    // Without setTimeout the modal has not rendered when focus() is called. 
    // setTimeouts() are executed last in the function all stack so 0 delay works!
    this.setState({selectedItem:item, openDetail: true}, () => setTimeout(() => this.ref.focus(),0));
  }

sendClicked = (e) => {
  this.setState({openDoneModal: !this.state.openDoneModal});//, () => setTimeout(() => this.ref.focus(),0));
}

  openDetail = (e) => {
    this.setState({openDetail: true, detailTitle: e.target.value}, () => {
      if(this.inputWrap && this.inputWrap.firstChild) {
        this.inputText.focus();
      }   
    });
  }

  closeDetail = (item,e) => {
    this.setState({openDetail: false});  
  }

  openDoneModal = (e) => {
    this.setState({openDoneModal: true, doneModalTitleTitle: e.target.value}, () => {
      if(this.inputWrap && this.inputWrap.firstChild) {
        this.inputText.focus();
      }   
    });
  }

  closeDoneModal = (item,e) => {
    this.setState({openDoneModal: false});  
  }



  setQty = (item,e) => {
    if (e.value.length > 2)
      return;
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.qty = e.value;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openDetail:true}, () => setTimeout(() => this.ref.focus(),0));
  }

  clearQty = (e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.qty = "";
    _item.unit = ""
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openDetail:true}, () => setTimeout(() => this.ref.focus(),0));
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
      if (this.state.openDoneModal === false) {
        if (item.name.toUpperCase().includes(this.state.searchText.toUpperCase()))
          return true;
        else
          return false;
      }
      else {
        if (item.qty || item.unit)
          return true;
        else
          return false;
      }
    }).map((item,index) => {
      return (
        <Item
          key={item.name}
          qty={item.qty}
          unit={item.unit}
          qtyunit={item.qty + " " + item.qty}
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
          qtyunit={item.qty + " " + item.qty}
          deleteEvent={this.deleteItem.bind(this, item)}
          rowClickEvent={this.handleClick.bind(this, item)}
        > {item.name}</Item>)
    })     
    return (
      <div>
        <Menu className="ui fixed" inverted>
          <Menu.Item>
            <Search showNoResults={false} fluid={true} size="small" ref={input1 => this.input1 = input1} onSearchChange={this.changeSearchText} {...this.props}
              icon={<Icon name='delete'  circular link onClick={this.clearSearchText.bind(this)}/>}
            />
          </Menu.Item>
          <Menu.Item position="right">
            <Icon link color="white" name="send" circular onClick={this.clearSearchText}/>
          </Menu.Item>
        </Menu>
        <Button secondary  size="massive" circular icon="compress" style={{position: 'fixed', bottom:32, right:32, display:'block'  }} onClick={this.sendClicked}/>          
        <Table unstackable selectable striped width="16">
          <Table.Body>
            {items}
          </Table.Body>
        </Table>

        <TransitionablePortal open={this.state.openDetail} transition={{animation:'slide down', duration:200}}  closeOnDocumentClick={true} >  
          <Segment inverted style={{ left: '0%', position: 'fixed', bottom: '0px', zIndex: 1000, width:"100%", height:"auto", backgroundcolor:"#FF2020" }} textAlign="center">
            <Header>{this.state.selectedItem.name}</Header>
              {/* {similarItems} */}
            <Menu secondary fluid>
              <Menu.Item textAlign="center">
              <Input  type="number" placeholder= "--" maxLength="4"  transparent inverted name="number" style={{ fontSize: 24, caretColor: "black", color:"black", width:80}} size="massive"   
                    ref={this.handleRef}  value={this.state.selectedItem.qty} onChange={this.setQty}
            //        label={<Button basic icon='delete' onClick={this.clearQty.bind(this)}/>}
                  />        
              </Menu.Item>
              {/* <Menu.Item >
            <Dropdown  options={options} selection text={this.state.selectedItem.unit}  />
            </Menu.Item> */}
              </Menu>
              {/* <Grid centered columns={3} >
                <Grid.Column textAlign='center' style={{margin:-5}}>
                  <Button onClick={this.setUnit.bind(this)}>bin</Button>      
                </Grid.Column>
                <Grid.Column textAlign='center' style={{margin:-5}}>
                  <Button onClick={this.setUnit}>shelf</Button>
                </Grid.Column>
                <Grid.Column textAlign='center' style={{margin:-5}}>
                  <Button onClick={this.setUnit}>bags</Button>      
                </Grid.Column>
                <Grid.Column textAlign='center' style={{margin:-5}}>
                  <Button onClick={this.setUnit}>boxes</Button>
                </Grid.Column>
                <Grid.Column textAlign='center' style={{margin:-5}}>
                  <Button onClick={this.setUnit}>trays</Button>   
                </Grid.Column>
              </Grid>  */}
              </Segment>
        </TransitionablePortal>               
      </div>
    );
  }
}

export default App;
