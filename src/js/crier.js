import React, { Component } from 'react'

class Crier extends Component {
  render() {
    const cries = Object.keys(this.props.cries).map((key, i)=>{
      return(
        <li className={'cry ' + this.props.cries[key].type}
            key={key}
            data-key={key}>
          <a className='cry-collapse'
             href='#'
             onClick={this.props.collapseHandler}>
            x
          </a>
          <span className='cry-body'>{key}: {this.props.cries[key].body}</span>
          <span> {this.props.cries[key].link || ''}</span>
        </li>
      )
    });

    return(
      <div className='crier'>
        <ul className='cries'>{cries}</ul>
      </div>
    )
  }
}

export default Crier;
