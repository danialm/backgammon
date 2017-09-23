// const cries = (state = {}, action) => {
//   const cries = Object.assign({}, state);

//   switch (action.type) {
//     case 'ADD_CRY':
//       cries[action.id] = {
//         body: action.body,
//         link: action.link,
//         kind: action.kind
//       };
//       return cries;

//     case 'REMOVE_CRY':
//       delete cries[action.id];
//       return cries;

//     case 'CLEAR_CRIES':
//       return {};

//     default:
//       return state;
//   }
// }

// export default cries;
