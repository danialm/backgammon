export const cryError = (id, body, link = null) => ({
  type: 'ADD_CRY',
  kind: 'error',
  id,
  body,
  link
});

export const crySuccess = (id, body, link = null) => ({
  type: 'ADD_CRY',
  kind: 'success',
  id,
  body,
  link
});

export const cryInfo = (id, body, link = null) => ({
  type: 'ADD_CRY',
  kind: 'info',
  id,
  body,
  link
});

export const cryWarning = (id, body, link = null) => ({
  type: 'ADD_CRY',
  kind: 'warning',
  id,
  body,
  link
});

export const removeCry = id => ({
  type: 'REMOVE_CRY',
  id,
});

export const clearCries = () => ({
  type: 'CLEAR_CRIES',
});
