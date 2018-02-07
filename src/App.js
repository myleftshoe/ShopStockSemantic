import React, { Component } from 'react';
import {Button, Dropdown,List, Icon, Modal, Input, Rail, Search, Table, Grid, Transition, Container, Popup, Header, Menu, Segment, TransitionablePortal} from 'semantic-ui-react';

import './App.css';

import Item from "./components/item";
import TransitionGroup from 'semantic-ui-react/dist/commonjs/modules/Transition/TransitionGroup';
//import Detail from "./components/detail";

//const FETCHURL = "https://api.jsonbin.io/b/5a6a9226814505706ad40ea9";
const FETCHURL = "https://api.jsonbin.io/b/5a7987179a230212562a68da";

const options = [
  { key: 'BAGS', text: 'BAGS', value: 'BAGS' },
  { key: 'BOXES', text: 'BOXES', value: 'BOXES' },
  { key: 'TRAYS', text: 'TRAYS', value: 'TRAYS' },
  { key: 'BIN', text: 'BIN', value: 'BIN' },
  { key: 'SHELF', text: 'SHELF', value: 'SHELF' },  
]

class App extends Component {

  state = {
    activekey: null,
    searchText: "",
    items: [{name:"dummy", qty:0, unit:"", tags:""}],
    openKeypad: false,
    detailTitle: 'Placeholder Item',
    openDoneModal: false,
    selectedItem:{name:"", qty:0, unit:"", tags:""},
    contentTopMargin:'61px',
    showRelatedItems:false,
    openNavigator:true,
    openAZ:false
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
    console.log(e.target.value);
      this.setState({searchText: e.target.value, showRelatedItems:false});
  }

  clearSearchText = (e) => {
    console.log((this.input1));
    // this.input1.setValue("");
    this.input1.value = "";
    this.setState({searchText: "", showRelatedItems:false});
  }

  handleRef = component => (this.ref = component);
  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    if (item.name === this.state.selectedItem.name) {
      this.setState({selectedItem:{name:"", qty:0, unit:""}});
      this.closeKeypad();
    }
    else {
      // Without setTimeout the modal has not rendered when focus() is called. 
      // setTimeouts() are executed last in the function all stack so 0 delay works!
      this.setState({selectedItem:item, showRelatedItems:true});//, () => setTimeout(() => this.ref.focus(),0));
      this.openKeypad();
    }
  }

  sendClicked = (e) => {
    this.setState({openDoneModal: !this.state.openDoneModal});//, () => setTimeout(() => this.ref.focus(),0));
  }

  openKeypad = (e) => {
    this.setState({openKeypad: true});
    this.setState({contentTopMargin:'61px'});
  }

  closeKeypad = (e) => {
    this.setState({openKeypad: false});
    this.setState({contentTopMargin:'61px'});
  }

  toggleNavigator = (e) => {
    this.setState({openNavigator: !this.state.openNavigator});
  }

  closeNavigator = (e) => {
    this.setState({openNavigator: false});
  }

  toggleAZ = (e) => {
    this.setState({openAZ: !this.state.openAZ});
  }

  closeAZ = (e) => {
    this.setState({openAZ: false});
  }

  

  setQty = (item,e) => {
    // if (e.value.length > 2)
    //   return;
    // this.setState({activeKey:e.children})
    // setTimeout(() =>this.setState({activeKey:-1}),0);
    console.log(e.children);
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    if (_item.qty.length > 1)
      _item.qty="";
    _item.qty = _item.qty + e.children;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  clearQty = (e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.qty = "";
    _item.unit = ""
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
  //    _item.unit = e.value;
      _item.unit = e.children;
  //    _item.qty = this.state.selectedItem.qty;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});
    setTimeout(() => this.setState({openKeypad:false}),600);
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
      if (this.state.showRelatedItems) {
        if (item.tags.includes(this.state.selectedItem.tags))
          return true;
        else
          return false;
      }
      else if (this.state.openDoneModal === false) {
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
        <Container>
        <Menu className="ui fixed compact inverted fluid">
        <Container>
          <Menu.Item>
            <Input placeholder="Search"   style={{}} inverted transparent style={{width:150, fontSize:21}} showNoResults={false} fluid={true} size="small" ref={input1 => this.input1 = input1} onChange={this.changeSearchText.bind(this)} {...this.props}
     //        icon={<Icon name='delete'  circular link onClick={this.clearSearchText.bind(this)}/>}
              action={<Button  color="teal" icon='delete' link onClick={this.clearSearchText.bind(this)}/>}
            />
          </Menu.Item>
          </Container>
          {/* <Menu.Item>
            <Icon name='refresh' fitted circular link onClick={this.clearSearchText.bind(this)}/>
          </Menu.Item> */}
          <Menu.Item position="right">
          <Icon link color="white" name="font" circular onClick={this.toggleAZ}/>
          </Menu.Item>          
          <Menu.Item position="right">
            <Icon link color="white" name="grid layout" circular onClick={this.toggleNavigator}/>
          </Menu.Item>          
          <Menu.Item position="right">
            <Icon link color="white" name="send" circular onClick={this.clearSearchText}/>
          </Menu.Item>
        </Menu>
        </Container>
        <Button secondary  size="massive" circular icon="compress" style={{position: 'fixed', bottom:32, right:32, display:'block'  }} onClick={this.sendClicked}/>          
        <Table unstackable selectable striped width="16" style={{marginTop:this.state.contentTopMargin}}>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>
        <TransitionablePortal open={this.state.openNavigator} transition={{animation:'slide down', duration:500}}  closeOnDocumentClick={true}  onClose={this.closeNavigator}>  
          <Segment size="massive" inverted style={{ left: '0%', position: 'fixed', top: '51px', zIndex: 1000, width:"100%", height:"100", backgroundcolor:"#FF2020" }} textAlign="center">
            <Button.Group widths={3} style={{height:80}} >
              <Button color="orange" style={{borderRadius:"0em"}}>Citrus</Button>
              <Button color="yellow" style={{borderRadius:"0em"}}>Tropical Fruit and Melons</Button>
              <Button color="violet" style={{borderRadius:"0em"}}>Berries and Grapes</Button>
            </Button.Group>
            <Button.Group widths={3} style={{height:80}}>
            <Button color="blue" style={{borderRadius:"0em"}}>Stone Fruit</Button>
              <Button color="olive" style={{borderRadius:"0em"}}>Apples and Pears</Button>
              <Button color="green" style={{borderRadius:"0em"}}>Leafy Greens</Button>
            </Button.Group>
            <Button.Group widths={3} style={{height:80}}>
              <Button color="brown" style={{borderRadius:"0em"}}>Potatoes and Pumpkin</Button>
              <Button color="purple" style={{borderRadius:"0em"}}>Root Vegetables</Button>
              <Button color="teal" style={{borderRadius:"0em"}}>Fruit Vegetables</Button>              
            </Button.Group>
            <Button.Group widths={3} style={{height:80}}>
              <Button color="pink" style={{borderRadius:"0em"}}>Salads and Sprouts</Button>
            </Button.Group>
          </Segment>
        </TransitionablePortal>

        <TransitionablePortal open={this.state.openAZ} transition={{animation:'slide down', duration:500}}  closeOnDocumentClick={true}  onClose={this.closeAZ}>  
          <Segment size="massive" inverted compact  style={{left: '0%', position: 'fixed', top: '51px', zIndex: 1000, width:"100%", height:"100", backgroundcolor:"#FF2020" }} textAlign="center">
            <Button.Group size="big" widths="7" >
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>A</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>B</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>C</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>D</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>E</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>F</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>G</Button>
            </Button.Group>
            <Button.Group size="big" widths="7" >
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>H</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>I</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>J</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>K</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>L</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>M</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>N</Button>
            </Button.Group>
            <Button.Group size="big" widths="7" >
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>O</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>P</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>Q</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>R</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>S</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>T</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>U</Button>
            </Button.Group>
            <Button.Group size="big" widths="7" >
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>V</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>W</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>X</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>Y</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}>Z</Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}></Button>
              <Button className="ui black button compact" onClick={this.setQty} style={{borderRadius:"0em"}}></Button>
            </Button.Group>
          </Segment>
        </TransitionablePortal>



        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide down', duration:500}}  closeOnDocumentClick={false} onOpen={this.openKeypad} onClose={this.closeKeypad}>  
          <Segment inverted style={{ left: '0%', position: 'fixed', top: '0px', zIndex: 1000, width:"100%", height:"auto", backgroundcolor:"#FF2020" }} textAlign="center">
            <Header>{this.state.selectedItem.name}</Header>
          </Segment>
        </TransitionablePortal>
        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide up', duration:300}}  closeOnDocumentClick={false} >  
          <Segment textAlign="center" inverted style={{ left: '0%', position: 'fixed', bottom: '0px', zIndex: 1000, width:"100%", height:"auto", backgroundcolor:"#FF2020" }}>
            <Header color="white">{this.state.selectedItem.qty + "  " + this.state.selectedItem.unit}</Header>
            <List selection relaxed  divided inverted horizontal>
              <List.Item onClick={this.setUnit}>bags</List.Item>
              <List.Item onClick={this.setUnit}>boxes</List.Item>
              <List.Item onClick={this.setUnit}>trays</List.Item>
              <List.Item onClick={this.setUnit}>tubs</List.Item>
              <List.Item onClick={this.setUnit}>bin</List.Item>
              <List.Item onClick={this.setUnit}>shelf</List.Item>
            </List>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" active = {false} onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>¼</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>1</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>2</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>3</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>½</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>4</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>5</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>6</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>¾</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>7</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>8</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>9</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" icon="angle down" onClick={this.closeKeypad} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" icon="exclamation" onClick={this.closeKeypad} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>0</Button>
                <Button className="ui black button" icon="delete" onClick={this.clearQty} style={{margin:0, borderRadius:"0em"}}></Button>
              </Button.Group>
          </Segment>
        </TransitionablePortal>               
      </div>
    );
  }
}

export default App;
