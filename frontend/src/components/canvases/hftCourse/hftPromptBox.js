import React, { Component } from 'react';
import { 
    Container
} from 'reactstrap';
import Welcome from './prompts/welcome';

class HFTPromptBox extends Component{
    constructor(props){
        super(props);
        this.child = React.createRef();
        this.state={
            promptView:[], 
            promptSegment: '',   
            //okay so this is going to be a bitch. 
            //1 do I want it to be a bunch of components? or maybe I want to render things based on whats happening?
            //Okay so I wanty this to be one component. that is going to switch out messages depending on where we are
            //I need someting to keep track. Some kind of array? 
        }

        this.changeSegment = this.changeSegment.bind(this);
    }

    componentDidMount(){
        if(this.state.promptSegment == '')
        {
        	this.setState({promptSegment: 'Welcome'});
        	this.setState({promptView: <Welcome changeSegment={this.changeSegment.bind(this)} userKey={this.props.userKey} user={this.props.user}/>});
      //      this.setState({promptSegment: 'TypeOfBusiness'});
      //      this.setState({promptView: <TypeOfBusiness changeSegment={this.changeSegment.bind(this)}/>});
        }
    }

    changeSegment(segment){
        this.setState({promptView: segment});
    }   

    render() {
        return (
          <Container className="promptBox">
             {this.state.promptView}
          </Container>
        );
      }
}

export default HFTPromptBox;