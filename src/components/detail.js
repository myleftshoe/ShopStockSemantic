import React, { Component } from 'react'
import { Popup, Button, Header, Input, Image, Modal } from 'semantic-ui-react'

class Detail extends Component {
  state = { open: false }

  show = dimmer => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false })

  render() {
    const { open, dimmer } = this.state

    return (
      <div>
        <Button onClick={this.show(true)}>Default</Button>
        <Modal dimmer='inverted' open={this.props.open} onClose={this.props.onClick}>
          <Modal.Header>{this.props.item.name}</Modal.Header>
          <Modal.Content >
            <Input hint="qty" value={this.props.item.qty}/>    
            <p/>
            <Button style={{margin:4, width:80}}>BAGS</Button>      
            <Button style={{margin:4, width:80}}>BIN</Button>      
            <Button style={{margin:4, width:80}}>BOXES</Button>
            <Button style={{margin:4, width:80}}>SHELF</Button>      
            <Button style={{margin:4, width:80}}>TRAYS</Button>      
            <p/>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.props.onClick}>CANCEL</Button>
            <Button positive icon='checkmark' labelPosition='right' content="OK" onClick={this.props.onClick} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default Detail

