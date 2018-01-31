import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Modal, Input, Search, Label, Table, Divider, Container, Grid, List } from 'semantic-ui-react';


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
    openDoneModal: false,
    donModalTitle: 'Placeholder Item',
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
  handleRef = component => (this.ref = component);

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.unit = e.children;
//    _item.qty = this.state.selectedItem.qty;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openDetail:true});
  }
 
  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    // Without setTimeout the modal has not rendered when focus() is called. 
    // setTimeouts() are executed last in the function all stack so 0 delay works!
    this.setState({selectedItem:item, openDetail: true, newItem:item}, () => setTimeout(() => this.ref.focus(),0));
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
    var regexp = /[¼½¾]/gi;
    var validInput=false;
    if (e.value.length === 0)
      validInput = true;
    else if ((e.value.length === 1) && ("0123456789¼½¾".includes(e.value)))
        validInput = true;
    else if (e.value.length === 2) {
      if (("0¼½¾".includes(e.value.charAt(0)) === false) && ("0123456789¼½¾".includes(e.value.charAt(1)) === true))
        validInput = true;
    }
    if (validInput) {
        const items = Object.assign([], this.state.items);
        const index = this.findItemIndexByName(this.state.selectedItem);
        const _item = items[index];
        _item.qty = e.value;
        items[index] = Object.assign({},_item);
        this.setState({items:items, selectedItem:_item, openDetail:true}, () => setTimeout(() => this.ref.focus(),0));
    }
  }

  clearQty = (e) => {
    console.log("fsdfsd:" + e.value);
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
/*
    const doneItems = this.state.items.filter((item, index) => {
      if (item.qty || item.unit)
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
*/
    return (
      <div>
        {/* <Sidebar.Pushable as={Segment} >
          <Sidebar as={Menu}  width="wide" animation='push' direction='top' visible={true} inverted> */}
          <Grid style={{backgroundColor:'teal', paddingTop:12, paddingLeft:16, paddingRight:16}}  > 
          <Grid.Column verticalAlign="bottom" className="left floated" >
                <Search  showNoResults={false} fluid={true} size="small"
                onSearchChange={this.changeSearchText}
                {...this.props}
              />
          </Grid.Column>
          <Grid.Column>
              <Button backgroundColor="teal" toggle active={true} icon="compress" className="right floated "  onClick={this.sendClicked}>All</Button>
              </Grid.Column>
            {/* <Divider /> */}
          </Grid>
          <Button primary size="massive" circular icon="settings" style={{position: 'absolute', bottom:24, right:24 }}/>
          {/* </Sidebar>
          <Sidebar.Pusher> */}
              <Table unstackable selectable divided >
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
              </Table  >

          {/* </Sidebar.Pusher>
        </Sidebar.Pushable> */}
        <Modal size="tiny"   dimmer={true} open={this.state.openDetail} onClose={this.closeDetail} closeIcon>
          <Modal.Header>{this.state.selectedItem.name}</Modal.Header>
          <Modal.Content >
          <Grid  verticalAlign="middle" stackable={false} >
            <Grid.Row>
            <Grid.Column width={7} textAlign="left" >
              <Input  size="big" fluid focus action={{ size:'big', color: 'teal', icon: 'cancel', onClick: this.clearQty }}  maxLength="2" hint="qty" ref={this.handleRef}  value={this.state.selectedItem.qty} onChange={this.setQty}/>    
            </Grid.Column>
            <Grid.Column width={9} textAlign="right">
            <Button.Group basic>
              <Button basic value={this.state.selectedItem.qty + '¼'} onClick={this.setQty}>¼</Button>      
              <Button basic value={this.state.selectedItem.qty + '½'} onClick={this.setQty}>½</Button>      
              <Button basic value={this.state.selectedItem.qty + '¾'} onClick={this.setQty}>¾</Button>
            </Button.Group>
            </Grid.Column>
            </Grid.Row>
          </Grid>
          <p/>
            <Button.Group widths="5">
              <Button   onClick={this.setUnit}>bags</Button>      
              <Button   onClick={this.setUnit}>bin</Button>      
              <Button   onClick={this.setUnit}>boxes</Button>
              <Button   onClick={this.setUnit}>shelf</Button>      
              <Button  onClick={this.setUnit}>trays</Button>      
              </Button.Group>
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
        {/* <Modal size="tiny"   dimmer={true} open={this.state.openDoneModal} onClose={this.closeDoneModal} closeIcon>
          <Modal.Header>{this.state.selectedItem.name}</Modal.Header>
          <Modal.Content >
          <Grid  verticalAlign="middle" stackable={false} >
            <Grid.Row>
            <Grid.Column width={7} textAlign="left" >
              <Input  size="big" fluid focus action={{ size:'big', color: 'teal', icon: 'cancel', onClick: this.clearQty }}  maxLength="2" hint="qty" ref={this.handleRef}  value={this.state.selectedItem.qty} onChange={this.setQty}/>    
            </Grid.Column>
            <Grid.Column width={9} textAlign="right">
            <Button.Group basic>
              <Button basic value={this.state.selectedItem.qty + '¼'} onClick={this.setQty}>¼</Button>      
              <Button basic value={this.state.selectedItem.qty + '½'} onClick={this.setQty}>½</Button>      
              <Button basic value={this.state.selectedItem.qty + '¾'} onClick={this.setQty}>¾</Button>
            </Button.Group>
            </Grid.Column>
            </Grid.Row>
          </Grid>
          <p/>
            <Button.Group widths="5">
              <Button   onClick={this.setUnit}>bags</Button>      
              <Button   onClick={this.setUnit}>bin</Button>      
              <Button   onClick={this.setUnit}>boxes</Button>
              <Button   onClick={this.setUnit}>shelf</Button>      
              <Button  onClick={this.setUnit}>trays</Button>      
              </Button.Group>
            <Table selectable={true} unstackable={true}  basic="very" striped={false} style={{marginTop: 10, width:"100%"}}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='3'>SIMILAR ITEMS</Table.HeaderCell>
              </Table.Row>
            </Table.Header>            
            <Table.Body >
                  {doneItems}
                </Table.Body>
              </Table>
          </Modal.Content>
          <Modal.Actions>
          </Modal.Actions>
        </Modal> */}

      </div>
    );
  }
}

export default App;
