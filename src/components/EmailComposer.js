import React, { Component } from 'react';
// import './App.css';
import {
    Button,
    Dropdown,
    Segment,
    Modal,
    Table,
    TextArea
} from 'semantic-ui-react';
  
const emails =[
    {key: "paulesammut@gmail.com", text:"Paul", value: "paulesammut@gmail.com"},
    {key: "myleftshoe@gmail.com", text:"Brendan", value: "myleftshoe@gmail.com"},
    {key: "bradgiles1982@gmail.com", text:"Brad", value: "bradgiles1982@gmail.com"}       
]

class EmailComposer extends Component {

    text = () => {
        return "Shop stock for " + (new Date()).toLocaleDateString('en-AU', {weekday:'long', day:'numeric'}) + "\n\n" + this.props.items
            .filter((item,index) => (item.qty.length > 0))
            .map((item, index) => (item.qty + " x " + item.unit + " " + item.name))
            .join("\n")
    }
    handleCopy (e) {
        e.clipboardData.setData('text/plain', 'Test');
        e.preventDefault();
    }

    copyAll (e) {
        console.log(this.textAreaRef.props.children);
    }

    render() {
        return (
        <div className="EmailComposer">
            <Modal closeIcon
                open={this.props.open}
                onClose={this.props.onClose}
            >
            <Modal.Header>
            Copy and paste into an sms
                {/* <Dropdown multiple options={emails} placeholder="To"/> */}
            </Modal.Header>
            <Modal.Content>
                <TextArea ref={e => this.textAreaRef = e} style={{width:'100%'}} rows={25}
                    // onCopy={this.handleCopy}
                >
                    {this.text()}
                </TextArea>
            </Modal.Content>
            {/* <Modal.Actions>
                <Button >Close</Button>
                <Button positive labelPosition='right' icon='send' content='Copy All' onClick={this.copyAll.bind(this)}/>
            </Modal.Actions> */}
            </Modal>
        </div>
    );
  }
} 

export default EmailComposer;
