import React, { Component } from 'react';
import $ from 'jquery';

class EditableFiled extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }

    this.toggleActive = this.toggleActive.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  toggleActive(event) {
    event.preventDefault();

    this.setState({active: !this.state.active});
  }

  handleSave(event) {
    event.preventDefault();

    const name = $(event.target).parent().find('input').attr('name');

    this.setState({active: false});
    this.props.onSave(name);
  }

  handleCancel(event) {
    event.preventDefault();

    this.setState({active: false});
    this.props.reset();
  }

  render() {
    const activefield =
      <span className="active-field">
        <input type={this.props.type}
               name={this.props.name}
               value={this.props.value}
               onChange={this.props.onChange}/>
         <a className="cancel-field"
            onClick={this.handleCancel}
            href="#not-a-link">
           x
         </a>
         <a className="save-field"
            onClick={this.handleSave}
            href="#not-a-link">
           ->
         </a>
      </span>,
    field =
      <span className="inactive-field" onClick={this.toggleActive}>
        {this.props.value || this.props.placeHolder}
        <span className="edit">Edit</span>
      </span>;

    return (
      <div>
        <span className='editable-field'>
          { this.state.active ? activefield : field }
        </span>
      </div>
    );
  }
}

export default EditableFiled;
