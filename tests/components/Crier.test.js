// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { removeCry } from '../actions';

// class Crier extends Component {
//   render() {
//     const cries = Object.keys(this.props.cries).map((key, i)=>{
//       return(
//         <li className={'cry ' + this.props.cries[key].kind}
//             key={key}
//             data-key={key}>
//           <a className='cry-collapse'
//              href='#'
//              onClick={(e) => { this.props.handleCollapse(e, key) } }>
//             x
//           </a>
//           <span className='cry-body'>
//             <span>{key}: {this.props.cries[key].body}</span>
//             <span> {this.props.cries[key].link || ''}</span>
//           </span>
//         </li>
//       )
//     });

//     return(
//       <div className='crier'>
//         <ul className='cries'>{cries}</ul>
//       </div>
//     )
//   }
// }

// const mapStateToProps = (state) => {
//   return { cries: state.cries };
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     handleCollapse: (event, key) => {
//       event.preventDefault();
//       dispatch(removeCry(key));
//     }
//   };
// }

// Crier = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Crier);

// export default Crier;
