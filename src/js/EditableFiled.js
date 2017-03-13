import React, { Component } from 'react';
import $ from 'jquery';
import Crier from './crier.js';

class EditableFiled extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cries: {},
      active: false
    }

    this.handleCollapse = this.handleCollapse.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCollapse(event) {
    event.preventDefault();
    const cries = Object.assign({}, this.state.cries),
          key = $(event.target).closest('.cry').data('key');

    delete cries[key];
    this.setState({cries: cries});
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
    const activefield = <span className="active-field">
                          <input type={this.props.type}
                                 name={this.props.name}
                                 value={this.props.value}
                                 onChange={this.props.onChange}/>
                           <a className="cancel-field"
                              onClick={this.handleCancel}
                              href="#">
                             x
                           </a>
                           <a className="save-field"
                              onClick={this.handleSave}
                              href="#">
                             ->
                           </a>
                        </span>,
          field = <span className="inactive-field" onClick={this.toggleActive}>
                    {this.props.value || this.props.placeHolder}
                    <span className="edit">Edit</span>
                  </span>;

    return (
      <div>
        <Crier cries={this.state.cries} collapseHandler={this.handleCollapse} />
        <span className='editable-field'>
          { this.state.active ? activefield : field }
        </span>
      </div>
    );
  }
}

export default EditableFiled;
