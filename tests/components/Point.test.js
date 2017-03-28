import React, { Component } from 'react';

class Point extends Component {
  render() {
    const checkers = this.props.checkers.map((checker, i)=>{
      const klass = 'checker ' + checker;
      return(<li className={klass} key={i}></li>)
    });

    return(
      <ul className='checkers'>{checkers}</ul>
    )
  }
}

export default Point;
