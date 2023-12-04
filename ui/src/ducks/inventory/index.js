import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { openAlert,openError } from '../alerts'

const actions = {
  INVENTORY_GET_ALL: 'inventory/get_all',
  INVENTORY_GET_ALL_PENDING: 'inventory/get_all_PENDING',
  INVENTORY_CREATE: 'inventory/create',
  INVENTORY_CREATE_PENDING: 'inventory/create_PENDING',
  INVENTORY_DELETE: 'inventory/delete',
  INVENTORY_DELETE_PENDING: 'inventory/delete_PENDING',
  INVENTORY_UPDATE: 'inventory/update',
  INVENTORY_UPDATE_PENDING: 'inventory/update_PENDING',
  INVENTORY_RETRIEVE: 'inventory/retrieve',
  INVENTORY_REFRESH: 'inventory/refresh'
}

export let defaultState = {
  all: [],
  fetched: false
}

export const findInventory = createAction(actions.INVENTORY_GET_ALL, () =>
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory`)
    .then((suc) => dispatch(refreshInventory(suc.data)), dispatch(openAlert('Inventories successfully loaded.'))
    )
)

export const createInventory = createAction(actions.INVENTORY_CREATE, (inventory) =>
  (dispatch, getState, config) => axios
    .post(`${config.restAPIUrl}/inventory`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
      dispatch(openAlert('Inventory successfully added.'))
    }).catch(error => {
      dispatch(openError('Failed to add inventory.'))
    })
)

export const findInventoryByID = createAction(actions.INVENTORY_RETRIEVE, (id) =>
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory/{id}`, id)
    .then((suc) => {
      dispatch(refreshInventory(suc.data))
      dispatch(openAlert('Inventory successfully retrieved.'))
    }).catch(error => {
      dispatch(openError('Failed to retrieve inventory by ID.'))
    })
)

export const updateInventory = createAction(actions.INVENTORY_UPDATE, (inventory, id) =>
  (dispatch, getState, config) => axios
    .put(`${config.restAPIUrl}/inventory/${id}`, inventory)
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (inv.id !== suc.data.id) {
          invs.push(inv)
        }
      })
      invs.push(suc.data)
      dispatch(refreshInventory(invs))
      dispatch(openAlert('Inventory successfully updated.'))
    }).catch(error => {
      dispatch(openError('Failed to update inventory.'))
    })
)

export const removeInventory = createAction(actions.INVENTORY_DELETE, (ids) =>
  (dispatch, getState, config) => axios
    .delete(`${config.restAPIUrl}/inventory`, { data: ids })
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (!ids.includes(inv.id)) {
          invs.push(inv)
        }
      })
      dispatch(refreshInventory(invs))
      dispatch(openAlert('Inventory successfully deleted.'))
    }).catch(error => {
      dispatch(openError('Failed to delete inventory.'))
    })
)

export const refreshInventory = createAction(actions.INVENTORY_REFRESH, (payload) =>
  (dispatcher, getState, config) =>
    payload.sort((inventoryA, inventoryB) =>
      inventoryA.name < inventoryB.name ? -1 : inventoryA.name > inventoryB.name ? 1 : 0)
)


export default handleActions({
  [actions.INVENTORY_REFRESH]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  }),
  [actions.INVENTORY_GET_ALL_PENDING]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  }),
  [actions.INVENTORY_DELETE_PENDING]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  }),
  [actions.INVENTORY_UPDATE_PENDING]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  }),
  [actions.INVENTORY_CREATE_PENDING]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  })
}, defaultState)