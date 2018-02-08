import React, { Component } from 'react';
import './App.css';
import {
  Button,
  Dropdown,
  List,
  Icon,
  Modal,
  Input,
  Divider,
  Image,
  Label,  
  Rail,
  Search,
  Table, Grid,
  Transition,
  Container,
  Popup,
  Header,
  Menu,
  Segment,
  TransitionablePortal
} from 'semantic-ui-react';
import TransitionGroup from 'semantic-ui-react/dist/commonjs/modules/Transition/TransitionGroup';
import Item from "./components/item";

//const FETCHURL = "https://api.jsonbin.io/b/5a6a9226814505706ad40ea9";
const FETCHURL = "https://api.jsonbin.io/b/5a7987179a230212562a68da";

class App extends Component {

  state = {
    searchText: "",
    items: [{name:"", qty:"", unit:"", tags:""}],
    openKeypad: false,
    done: false,
    selectedItem:{name:"", qty:0, unit:"", tags:""},
    selectedLetter: "",
    selectedTag: {name:"", color:"white"},
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

// Search ************************************

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

  changeSearchText = (e) => {
    console.log(e.target.value);
      this.setState({searchText: e.target.value});
  }

  clearSearchText = (e) => {
    console.log((this.input1));
    // this.input1.setValue("");
    this.input1.value = "";
    this.setState({searchText: ""});
  }

// Done ****************************  
  toggleDone = (e) => {
    this.setState({done: !this.state.done});//, () => setTimeout(() => this.ref.focus(),0));
  }



  handleRef = component => (this.ref = component);
  handleClick = (item,e) => {
    console.log("row clicked" + item.name);
    if (this.state.openKeypad)
      this.closeKeypad();
    else {
      // Without setTimeout the modal has not rendered when focus() is called. 
      // setTimeouts() are executed last in the function all stack so 0 delay works!
      this.setState({selectedItem:item});//, () => setTimeout(() => this.ref.focus(),0));
      this.openKeypad();
    }
  }

  
  sendClicked = (e) => {
    this.setState({openDoneModal: !this.state.openDoneModal});//, () => setTimeout(() => this.ref.focus(),0));
  }

// Keypad *********************

  openKeypad = () => {
    this.setState({openAZ:false, openNavigator:false, openKeypad: true});
  }

  closeKeypad = () => {
    if (this.state.openKeypad) {
      this.setState({openKeypad: false});
    }
  }

// Navigator ************************  
  toggleNavigator = (e) => {
    if (this.state.selectedTag.name.length > 0) {
      this.setState({selectedTag:{name: "", color: "white"}});
      this.closeNavigator();
    }
    else
      this.setState({openAZ:false, openNavigator:true, openKeypad: false});
  }

  closeNavigator = () => {
    if (this.state.openNavigator)
      this.setState({openNavigator: false});
  }

  handleTagClick = (e, p) => {
    e.stopPropagation();
    console.log(p.children);
    this.setState({selectedTag: {name:p.children, color:p.color}});
  //  this.closeNavigator();    
  }

// AZ *****************************************  
  toggleAZ = (e) => {
    if (this.state.selectedLetter.length > 0) {
      this.setState({openAZ: false, selectedLetter:""});
    }
    else
      this.setState({openAZ:true, openNavigator:false, openKeypad: false});
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

  selectLetter = (e, p) => {
    console.log(p);
    e.stopPropagation();
    if (this.state.selectedLetter === p.children) {
      this.deselectLetter();
    }
    else
      this.setState({selectedLetter:p.children});
  }

  deselectLetter = () => {
    this.setState({selectedLetter:""});
  }

// Qty + Unit **************************
  setQty = (item,e) => {
    console.log(e.children);
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    if (_item.qty.length > 1)
      _item.qty="";
    _item.qty = _item.qty + e.children;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});//, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  clearQty = (e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.qty = "";
    _item.unit = ""
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});//, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem);
    const _item = items[index];
    _item.unit = e.children;
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
      if (this.state.selectedLetter.length > 0) {
        if (item.name.charAt(0).toUpperCase() === this.state.selectedLetter.toUpperCase())
          return true;
        else
          return false;
      }
      if (this.state.selectedTag.name.length > 0) {
        if (item.tags.includes(this.state.selectedTag.name))
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


    return (
      
      <div>
        <Container>
        <Menu size="huge" className="ui fixed compact inverted" style={{height:62}}>
        <Container>
          <Menu.Item>
            <Input type="text" icon="search" iconPosition="left" inverted transparent id="my-text-field" style={{color:'white',width:180}} ref={input1 => this.input1 = input1} onChange={this.changeSearchText.bind(this)}
              onClose={this.clearSearchText}
            />
          </Menu.Item>
          </Container>
          <Menu.Item position="right">
            <Icon link style={{fontFamily:'Roboto Black'}} circular onClick={this.toggleAZ}>{this.state.selectedLetter.length > 0 ? this.state.selectedLetter : 'AZ'}</Icon>
          </Menu.Item>          
          <Menu.Item position="right">
            <Icon link name="grid layout" className={this.state.selectedTag.color} circular onClick={this.toggleNavigator}/>
          </Menu.Item>          
        </Menu>
        </Container>
        <Button secondary  size="huge" circular icon={this.state.done ? "arrow left":"check"} style={{position: 'fixed', bottom:32, right:32, display:'block', zIndex:700  }} onClick={this.toggleDone}/>    
        <Table unstackable selectable striped singleLine fixed width={16} style={{marginTop:62, marginBottom:'100%'}}>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>

        <TransitionablePortal open={this.state.openNavigator} transition={{animation:'fade left', duration:500}}  closeOnDocumentClick={false}  onClose={this.closeNavigator}>  
          <Segment size="massive" raised floated="right" inverted style={{ borderRadius:"0em", right: '0%', margin:0, padding:0, paddingLeft:1, position: 'fixed', top: '62px', zIndex: 1000, width:"40%", height:"100%",borderRadius:"0em" }} textAlign="center" >
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
            <Segment basic textAlign="center" style={{position:'fixed',width:"40%", bottom:0, right:0}}>
              <Button icon="angle up" size="huge" className="ui black" onClick={this.closeNavigator}></Button>
            </Segment>
          </Segment>
        </TransitionablePortal>

        <TransitionablePortal open={this.state.openAZ} transition={{animation:'fade left', duration:500}}  closeOnDocumentClick={false}  onClose={this.closeAZ} onOpen={this.onOpenAZ} >  
          <Segment basic raised floated="right" inverted  style={{right: '0%', marginRight:0, borderRadius:"0em", position:'fixed', top: '62px', zIndex: 1000, height:"100%", width:"40%"}}  >
            <Button.Group widths="3" style={{height:40}} >
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='A'} disabled={!this.state.startingLetters.includes('A')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>A</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='B'} disabled={!this.state.startingLetters.includes('B')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>B</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='C'} disabled={!this.state.startingLetters.includes('C')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>C</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='D'} disabled={!this.state.startingLetters.includes('D')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>D</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='E'} disabled={!this.state.startingLetters.includes('E')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>E</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='F'} disabled={!this.state.startingLetters.includes('F')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>F</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='G'} disabled={!this.state.startingLetters.includes('G')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>G</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='H'} disabled={!this.state.startingLetters.includes('H')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>H</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='I'} disabled={!this.state.startingLetters.includes('I')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>I</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='J'} disabled={!this.state.startingLetters.includes('J')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>J</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='K'} disabled={!this.state.startingLetters.includes('K')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>K</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='L'} disabled={!this.state.startingLetters.includes('L')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>L</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='M'} disabled={!this.state.startingLetters.includes('M')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>M</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='N'} disabled={!this.state.startingLetters.includes('N')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>N</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='O'} disabled={!this.state.startingLetters.includes('O')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>O</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='P'} disabled={!this.state.startingLetters.includes('P')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>P</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='Q'} disabled={!this.state.startingLetters.includes('Q')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Q</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='R'} disabled={!this.state.startingLetters.includes('R')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>R</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='S'} disabled={!this.state.startingLetters.includes('S')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>S</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='T'} disabled={!this.state.startingLetters.includes('T')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>T</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='U'} disabled={!this.state.startingLetters.includes('U')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>U</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='V'} disabled={!this.state.startingLetters.includes('V')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>V</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='W'} disabled={!this.state.startingLetters.includes('W')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>W</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='X'} disabled={!this.state.startingLetters.includes('X')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>X</Button>
            </Button.Group>
            <Button.Group widths="3" style={{height:40}}>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='Y'} disabled={!this.state.startingLetters.includes('Y')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Y</Button>
              <Button className="ui black compact" toggle active={this.state.selectedLetter==='Z'} disabled={!this.state.startingLetters.includes('Z')} onClick={this.selectLetter} style={{borderRadius:"0em"}}>Z</Button>
              <Button className="ui black compact"/>
            </Button.Group>
            <Segment basic textAlign="center" style={{position:'fixed',width:"40%", bottom:0, right:0}}>
              <Button icon="angle up" size="huge" className="ui black" onClick={this.closeAZ}></Button>
            </Segment>
          </Segment>
        </TransitionablePortal>

        {/* <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide down', duration:500}}  closeOnDocumentClick={true} onOpen={this.openKeypad} onClose={this.closeKeypad}>  
          <Segment inverted style={{ left: '0%', position: 'fixed', top: '54px', zIndex: 1000, width:"100%", height:"auto", borderRadius:0, paddingTop:0, paddingBottom:4}} textAlign="center">
            <Header style={{margin:4}}>{this.state.selectedItem.name}</Header>
            <Header style={{margin:4}}>{this.state.selectedItem.qty + "  " + this.state.selectedItem.unit}</Header>
          </Segment>
        </TransitionablePortal> */}
        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'slide up', duration:300}}  closeOnDocumentClick={false} onClose={this.closeKeypad}>  
          <Segment textAlign="center" inverted transparent style={{ left: '0%', position: 'fixed', bottom: '0px', zIndex: 1000, width:"100%", height:"auto", borderRadius:0}}>
            <Input style={{width:"100%", marginTop:0, marginBottom:12}} type="text" inverted defaultValue={this.state.selectedItem.name} labelPosition="right" label={
              <Label>
                {this.state.selectedItem.qty}
                <Label.Detail>{this.state.selectedItem.unit}</Label.Detail>
              </Label>}>
            </Input>
            {/* <Header style={{margin:4}}>{this.state.selectedItem.qty + "  " + this.state.selectedItem.unit}</Header> */}
            {/* <Divider/> */}
            <List link selection relaxed divided inverted horizontal style={{marginBottom:8}}>
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
              <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>¼</Button>
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
