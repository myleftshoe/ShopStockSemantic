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
    searchText: "",
    items: [{name:"dummy", qty:0, unit:"", tags:""}],
    openKeypad: false,
    done: false,
    selectedItem:{name:"", qty:0, unit:"", tags:""},
    selectedLetter: "",
    selectedTag: "",
    contentTopMargin:'61px',
    showRelatedItems:false,
    openSearch:false,
    openNavigator:false,
    openAZ:false,
    startingLetters: []
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

  
  toggleDone = (e) => {
    this.setState({done: !this.state.done});//, () => setTimeout(() => this.ref.focus(),0));
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

  toggleSearch = (e) => {
    this.setState({openSearch: !this.state.openSearch});
  }

  onOpenSearch = () => {
//    setTimeout(() => this.input1.focus(),0);
    this.setState(() => setTimeout(() => this.input1.focus(),500));
  }

  closeSearch = (e) => {
    this.setState({openSearch: false});
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

  onOpenAZ = (e) => {
    let startLetters=[];
    this.state.items.forEach((item) => {
      startLetters.push(item.name.charAt(0).toUpperCase());
    });
    let distinctLetters = Array.from(new Set(startLetters));
    console.log(distinctLetters);
    this.setState({startingLetters:distinctLetters});
  }

  selectLetter = (item, e) => {
    console.log(e.children);
    if (this.state.selectedLetter === e.children) {
      this.deselectLetter();
      this.closeAZ();
    }
    else
      this.setState({selectedLetter:e.children});
//    this.closeAZ();
  }

  deselectLetter = () => {
    this.setState({selectedLetter:""});
//    this.closeAZ();
  }

  handleTagClick = (e, p) => {
    e.stopPropagation();
    console.log(p.children);
    this.setState({selectedTag: p.children});
    this.closeNavigator();    
  }

  setQty = (item,e) => {
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
  
  // Render ************************  

  render() {
    const items = this.state.items.filter((item, index) => {
      console.log(item.tags);
      if (this.state.selectedLetter.length > 0) {
        if (item.name.charAt(0).toUpperCase() === this.state.selectedLetter.toUpperCase())
          return true;
        else
          return false;
      }
      if (this.state.selectedTag.length > 0) {
        if (item.tags.includes(this.state.selectedTag))
          return true;
        else
          return false;
      }
      if (this.state.done) {
        if (item.qty || item.unit)
          return true;
        else
          return false;
      }
      if (this.state.searchText.length > 0) {
        if (item.name.toUpperCase().includes(this.state.searchText.toUpperCase()))
          return true;
        else
          return false;
      }
      return true;
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
        <Menu className="ui fixed compact inverted">
        <Container>
          <Menu.Item>
            <Input type="text" icon="search" iconPosition="left" inverted transparent id="my-text-field" style={{color:'white',width:120}} ref={input1 => this.input1 = input1} onChange={this.changeSearchText.bind(this)}
              onClose={this.clearSearchText}
            />
          </Menu.Item>
          </Container>
          <Menu.Item position="right">
            <Icon link name="font" circular onClick={this.toggleAZ}/>
          </Menu.Item>          
          <Menu.Item position="right">
            <Icon link name="grid layout" circular onClick={this.toggleNavigator}/>
          </Menu.Item>          
        </Menu>
        </Container>
        <Button secondary  size="huge" circular icon={this.state.done ? "arrow left":"check"} style={{position: 'fixed', bottom:32, right:32, display:'block', zIndex:700  }} onClick={this.toggleDone}/>    
        <Table unstackable selectable striped width="16" style={{marginTop:this.state.contentTopMargin}}>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>

        <TransitionablePortal open={this.state.openNavigator} transition={{animation:'fade left', duration:500}}  closeOnDocumentClick={true}  onClose={this.closeNavigator}>  
          <Segment size="massive" raised floated="right" inverted style={{ right: '0%', margin:0, padding:0, position: 'fixed', top: '54px', zIndex: 1000, width:"40%", height:"100%" }} textAlign="center" onClick={this.toggleNavigator} >
            <Button.Group vertical compact>
              <Button color="orange" onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Citrus</Button>
              <Button color="yellow" onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Tropical Fruit and Melons</Button>
              <Button color="violet" onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Berries and Grapes</Button>
              <Button color="blue"   onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Stone Fruit</Button>
              <Button color="olive"  onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Apples and Pears</Button>
              <Button color="green"  onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Leafy Greens</Button>
              <Button color="brown"  onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Potatoes and Pumpkin</Button>
              <Button color="purple" onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Root Vegetables</Button>
              <Button color="teal"   onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Fruit Vegetables</Button>              
              <Button color="pink"   onClick={this.handleTagClick} style={{borderRadius:"0em", height:46}}>Salads and Sprouts</Button>
            </Button.Group>
          </Segment>
        </TransitionablePortal>

        <TransitionablePortal open={this.state.openAZ} transition={{animation:'fade left', duration:500}}  closeOnDocumentClick={true}  onClose={this.closeAZ} onOpen={this.onOpenAZ} >  
          <Segment basic raised floated="right" inverted  style={{right: '0%', marginRight:0, borderRadius:"0em", position:'fixed', top: '54px', zIndex: 1000, height:"100%", width:"40%"}} >
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('A')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>A</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('B')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>B</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('C')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>C</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('D')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>D</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('E')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>E</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('F')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>F</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('G')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>G</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('H')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>H</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('I')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>I</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('J')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>J</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('K')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>K</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('L')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>L</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('M')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>M</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('N')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>N</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('O')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>O</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('P')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>P</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('Q')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Q</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('R')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>R</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('S')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>S</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('T')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>T</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('U')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>U</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('V')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>V</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('W')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>W</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('X')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>X</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('Y')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Y</Button>
              <Button className="ui black compact" disabled={!this.state.startingLetters.includes('Z')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Z</Button>
              <Button className="ui black compact"/>
            </Button.Group>
          </Segment>
        </TransitionablePortal>

        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide down', duration:500}}  closeOnDocumentClick={false} onOpen={this.openKeypad} onClose={this.closeKeypad}>  
          <Segment inverted style={{ left: '0%', position: 'fixed', top: '50px', zIndex: 1000, width:"100%", height:"auto"}} textAlign="center">
            <Header>{this.state.selectedItem.name}</Header>
          </Segment>
        </TransitionablePortal>
        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide up', duration:300}}  closeOnDocumentClick={false} >  
          <Segment textAlign="center" inverted style={{ left: '0%', position: 'fixed', bottom: '0px', zIndex: 1000, width:"100%", height:"auto"}}>
            <Header>{this.state.selectedItem.qty + "  " + this.state.selectedItem.unit}</Header>
            <List selection relaxed  divided inverted horizontal>
              <List.Item onClick={this.setUnit}>bags</List.Item>
              <List.Item onClick={this.setUnit}>boxes</List.Item>
              <List.Item onClick={this.setUnit}>trays</List.Item>
              <List.Item onClick={this.setUnit}>tubs</List.Item>
              <List.Item onClick={this.setUnit}>bin</List.Item>
              <List.Item onClick={this.setUnit}>shelf</List.Item>
            </List>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>1</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>2</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>3</Button>
                <Button className="ui black button" active = {false} onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>¼</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>4</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>5</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>6</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>½</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>7</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>8</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>9</Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>¾</Button>
              </Button.Group>
              <Button.Group size="big" widths="4" >
                <Button className="ui black button" icon="exclamation" onClick={this.closeKeypad} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>0</Button>
                <Button className="ui black button" icon="delete" onClick={this.clearQty} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" icon="angle down" onClick={this.closeKeypad} style={{margin:0, borderRadius:"0em"}}></Button>
              </Button.Group>
          </Segment>
        </TransitionablePortal>               
      </div>
    );
  }
}

export default App;
