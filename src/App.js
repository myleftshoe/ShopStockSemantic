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
  Form,
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
import Item from "./components/Item";
import color from './colors'

const POSTURL = "https://api.jsonbin.io/b/5a84f744849a8f1c811922ad";
// const FETCHURL = "https://api.jsonbin.io/b/5a7cfa997ecc101273331408";
const FETCHURL = "https://api.jsonbin.io/b/5a84f744849a8f1c811922ad/latest";

class App extends Component {

  state = {
    searchText: "",
    items: [{name:"", qty:"", unit:"", tags:""}],
    openKeypad: false,
    done: true,
    marked:false,
    selectedItem:{name:"", qty:0, unit:"", tags:""},
    selectedLetter: "",
    selectedTag: {name:"", color:"white"},
    openSearch:false,
    openNavigator:false,
    openAZ:false,
    sortDescending:false,
    showMore:false,
    sortByTimestamp: true,
    saved:false,
    changed:false,
    status:"",
    startingLetters: [],
    sortMode:"None",
    revered:false
  }

  componentDidMount() {
    fetch(FETCHURL)
        .then(response => response.json())
        .then(data => {
          this.fetchedItems = data.Items;
          this.setState({items:data.Items})}
        );
  }

  fetchedItems = {};

  changed = () => JSON.stringify(this.fetchedItems) === JSON.stringify(this.state.items);

  sendData = () => {
    this.setState({status:"saving"})
    this.postData(POSTURL, {Date: (new Date()).toJSON(), Items: this.state.items})
    .then(data => {
      console.log(data);
      if (!data.success)
        throw "Save failed";
      this.fetchedItems = data.data.Items;
      console.log(this.changed());
      this.setState({saved:true, changed:false, status:"saved"})
      setTimeout(() => {
        this.setState({ saved: false, status:"" })
      }, 500)
    }) // JSON from `response.json()` call
    .catch(error => {
      this.setState({ saved: false, status:"error" })
      console.error(error)
    })
  }


  postData(url, data) {
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
    })
    .then(response => response.json()) // parses response to JSON
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

handleButtonPress = (e) => {
    this.buttonPressTimer = setTimeout(() => alert('long press activated'), 1500);
}

handleButtonRelease = (e) => {
    clearTimeout(this.buttonPressTimer);
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


  changeItemName = (e) => {
    console.log(e.target.value);
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem.name);
    const _item = items[index];
    _item.name = e.target.value;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});
  }





  clearSearchText = (e) => {
    e.target.value = "";
    // this.value = "";
    console.log("dsdsd",this.input1.value);
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
    // console.log (document.activeElement);
    // console.log(this.input1.inputRef);
    if (this.input1.inputRef === document.activeElement)
      return;
    console.log("row clicked" + item.name);
    this.setState({selectedItem:item})
//      Without setTimeout the modal has not rendered when focus() is called.
//      setTimeouts() are executed last in the function all stack so 0 delay works!
      this.setState({selectedItem:item});//, () => setTimeout(() => this.ref.focus(),0));
      this.openKeypad();
  }

  selectItem = (item,e) => {
    console.log("selectItem:" + e.value);
    const index = this.findItemIndexByName(e.value);
    console.log(index);
    const _item = this.state.items[index];
    this.setState({selectedItem:_item});
  }

  openShowMorePopup = () => {
    this.setState({showMore:true})
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


// Qty + Unit **************************

  toggleMarked = (item,e) => {
    console.log(e.children);
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem.name);
    const _item = items[index];
    _item.marked = !_item.marked;
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});//, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  setQty = (item,e) => {
    console.log(e.children);
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem.name);
    const _item = items[index];
    if (_item.qty.length > 1)
      _item.qty="";
    _item.qty = _item.qty + e.children;
    _item.timestamp = (new Date()).toJSON();
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item, searchText:"", changed:true});//, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
    this.input1.value="";

  }

  clearQty = (e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem.name);
    const _item = items[index];
    _item.qty = "";
    _item.unit = "";
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});//, openKeypad:true});//, () => setTimeout(() => this.ref.focus(),0));
  }

  setUnit = (item,e) => {
    const items = Object.assign([], this.state.items);
    const index = this.findItemIndexByName(this.state.selectedItem.name);
    const _item = items[index];
    _item.unit = e.children;
    _item.timestamp = (new Date()).toJSON();
    items[index] = Object.assign({},_item);
    this.setState({items:items, selectedItem:_item});
//    setTimeout(() => this.setState({openKeypad:false}),600);
  }

  findItemIndexByName = (itemName) => {
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].name === itemName)
        return i;
    }
    return -1;
  }


  onFocusSearch = (e) => {
    console.log("onFocusSearch");
    this.setState({searchText:""});
    this.input1.value = "";
  }

  statusToColor = () => {
    let ret = "black";
    switch (this.state.status) {
      case "saving" :
        ret = "black";
        break;
      case "saved" :
        ret = "green";
        break;
      case "error" :
        ret = "red";
        break;
      default :
        ret = "black";
    }
    console.log(ret);
    return ret;
  }


  focusSearch = () => {
    console.log (document.activeElement);
    console.log(this.input1.inputRef);
    console.log(this.input1.inputRef === document.activeElement);
  }

  handleSortClick = (e) => {
    console.log("handleSortClick: ", e.target.innerHTML);
    let sortMode = e.target.innerHTML;
    let reverse = false;
    if (sortMode === "Reverse") {
      sortMode = this.state.sortMode;
      reverse = true;
    }
    const _items = Object.assign([], this.state.items);

    if (sortMode === 'Alphabetical')
      _items.sort(function(i1,i2) {
        if (i1.name > i2.name)
          return 1
        if (i1.name < i2.name)
          return -1
        return 0;
      });
    if (sortMode === 'Grouped')
      _items.sort(function(i1,i2) {
        if (i1.tags > i2.tags)
          return 1
        if (i1.tags < i2.tags)
          return -1
        else {
          if (i1.name > i2.name)
            return 1
          if (i1.name < i2.name)
            return -1
        }
        return 0;
      });
    if (sortMode === 'None')
      _items.sort(function(i1,i2) {
        let d1 = new Date(i1.timestamp);
        let d2 = new Date(i2.timestamp);
        if (d1 > d2)
          return 1
        if (d1 < d2)
          return -1
        return 0;
      });

    if (reverse) 
      _items.reverse();
    
    this.setState({items:_items, sortMode: sortMode});
  }


  // Render ************************
  render() {
    const items = this.state.items.filter((item, index) => {
      if (this.state.searchText.length === 1) {
        if (item.name.charAt(0).toUpperCase() === this.state.searchText.charAt(0).toUpperCase())
          return true;
        else
          return false;
      }
      if (this.state.searchText.length > 1) {
        if (item.name.toUpperCase().includes(this.state.searchText.toUpperCase()))
          return true;
        else
          return false;
      }
      if (item.qty || item.unit)
        return true;
      else
        return false;
      return true;
    }).map((item,index) => {
      return (
        <Item
          key={item.name}
          item={item}
          selectedItem={this.state.selectedItem}
          deleteEvent={this.deleteItem.bind(this, item)}
          rowClickEvent={this.handleClick.bind(this, item)}
        > {item.name}</Item>)
    })

    const relatedItems = this.state.items.filter((item, index) => {
      if (this.state.selectedItem.tags === item.tags)
        return true;
      else
        return false;
    }).map((item,index) => {
      return (
        <Item
          key={item.name}
          item={item}
          selectedItem={this.state.selectedItem}
          deleteEvent={this.deleteItem.bind(this, item)}
          rowClickEvent={this.handleClick.bind(this, item)}
        > {item.name}</Item>)
    })

    return (

      <div>
        <Menu size="huge" widths={16} className="ui fixed compact inverted" style={{height:62}}>
          <Menu.Item onClick={this.focusSearch}>
            <Input type="text" icon="search" iconPosition="left" onBlur={console.log("onblur")} onFocus={this.clearSearchText} inverted transparent id="searchInput" style={{color:'white',width:'auto'}} ref={input1 => this.input1 = input1} onChange={this.changeSearchText.bind(this)}
              onClose={this.clearSearchText} value={this.state.searchText}
            />
          </Menu.Item>
          {/* <Menu.Item position="right" onClick={this.sendData}>
            <Icon link name="send" circular/>
          </Menu.Item> */}
          <Menu.Item position="right"  style={{width:72, position:'fixed', top:0, right:0}}>
            <Popup position="bottom right" header="Sort" 
              trigger={<Icon link name="sort" style={{backgroundColor:this.state.sortMode==='None'?null:"gray"}} circular/>}
              content={
                <Menu secondary vertical>
                  <Menu.Item name='Alphabetical' active={this.state.sortMode === 'Alphabetical'} onClick={this.handleSortClick.bind(this)} />
                  <Menu.Item name='Grouped' active={this.state.sortMode === 'Grouped'} onClick={this.handleSortClick} />
                  <Menu.Item name='None' active={this.state.sortMode === 'None'} onClick={this.handleSortClick} />
                  <Divider/>
                  <Menu.Item name='Reverse' active={this.state.sortMode === 'None'} onClick={this.handleSortClick} />
                </Menu>
              }
            >
            </Popup>
          </Menu.Item>
        </Menu>
        <Button color={this.statusToColor()} size="huge" circular icon={this.state.changed?"save":"send"} style={{position: 'fixed', bottom:32, right:32, display:'block', zIndex:700  }} onClick={this.sendData}/>
        <Table inverted unstackable selectable={false} striped={false} singleLine fixed width={16} style={{marginTop:62, marginBottom:'100%'}}>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>
        {/* <Popup basic inverted  open={this.state.saved} style={{position:'fixed', width:'50%', top:'25%', left:'25%'}}><Container textAlign="center">Saved!</Container></Popup> */}

        <TransitionablePortal open={this.state.openKeypad} transition={{animation:'fade up', duration:300}}  closeOnDocumentClick={true} onClose={this.closeKeypad}>
          <Segment textAlign="center" inverted style={{ backgroundColor: '#3A3A3A', left: '0%', padding:0, position: 'fixed', bottom: '0px', zIndex: 5000, width:"100%", height:"auto", borderRadius:0}}>
            <Segment  style={{borderRadius:0, padding:0}} >
              <Grid widths={16} >
                <Grid.Column width={12}>
                  <Dropdown onChange={this.selectItem}
                    floating  button className='icon'  fluid   scrolling   style={{borderRadius:0, padding:14}} defaultValue={this.state.selectedItem.name}
                      options={
                        this.state.items.filter((item, index) => {
                          return (this.state.selectedItem.tags === item.tags);
                          // return ((this.state.selectedItem.tags === item.tags && !item.qty && !item.unit) || item.name === this.state.selectedItem.name);
                        }).map(function(i, index) {
                          return {value: i.name, text: i.name }
                        })
                      }
                    >
                  </Dropdown>
                </Grid.Column>
                <Grid.Column verticalAlign='middle' width={4} style={{fontSize:17, fontWeight:'bold', paddingLeft:0, paddingRight:28}}>
                  {this.state.selectedItem.qty + " " + this.state.selectedItem.unit}
                </Grid.Column>
              </Grid>
            </Segment>
            <List selection divided inverted horizontal style={{marginTop:-18, marginBottom:-16}}>
              <List.Item style={{padding:12}}/>
              <List.Item style={{padding:12}} onClick={this.setUnit}>bags</List.Item>
              <List.Item style={{padding:12}} onClick={this.setUnit}>boxes</List.Item>
              <List.Item style={{padding:12}} onClick={this.setUnit}>trays</List.Item>
              <List.Item style={{padding:12}} onClick={this.setUnit}>tubs</List.Item>
              <List.Item style={{padding:12}} onClick={this.setUnit}>bin</List.Item>
              <List.Item style={{padding:12}} onClick={this.setUnit}>shelf</List.Item>
              <List.Item style={{padding:12}}/>
            </List>
            <Segment inverted basic className="ui black" style={{borderRadius:0}}>
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
                <Button className="ui black button" icon="exclamation" onClick={this.toggleMarked} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" onClick={this.setQty} style={{margin:0, borderRadius:"0em"}}>0</Button>
                <Button className="ui black button" icon="delete" onClick={this.clearQty} style={{margin:0, borderRadius:"0em"}}></Button>
                <Button className="ui black button" icon="angle down" onClick={this.closeKeypad} style={{margin:0, borderRadius:"0em"}}></Button>
              </Button.Group>
            </Segment>
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default App;
