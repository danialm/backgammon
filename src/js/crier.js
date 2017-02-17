import React, { Component } from 'react'

class Crier extends Component {
  render() {

    const errors = Object.keys(this.props.errors).map((key, i)=>{
      return(<li className='cry' key={key}>{this.props.errors[key]}</li>)
    });

    return(
      <div className='crier'>
        <ul className='cries errors'>{errors}</ul>
      </div>
    )
  }
}

export default Crier;
