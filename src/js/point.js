import React, { Component } from 'react';

class Point extends Component {
  render() {
    const checkers = this.props.checkers.map((checker, i)=>{
      const klass = 'checker ' + checker;
      return(<li className={klass} key={i}></li>)
    });

    return(
      <li className={this.props.klass}
          onClick={() => this.props.onClick(this.props.value)} >

        <ul className='checkers' >{checkers}</ul>
      </li>
    )
  }
}

export default Point;
