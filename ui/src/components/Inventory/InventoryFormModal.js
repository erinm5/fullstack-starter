import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import { MenuItem } from '@material-ui/core'
import moment from 'moment'
import React from 'react'
import TextField from '../Form/TextField'
import { ErrorMessage, Field, Form, Formik } from 'formik'

class InventoryFormModal extends React.Component {
  render() {
    const {
      formName,
      handleDialog,
      handleInventory,
      title,
      initialValues,
      productOptions,
      unitOfMeasurementOptions
    } = this.props

    const normalizeInventory = ( inventory ) => ({
      ...inventory,
      bestBeforeDate: moment(inventory.bestBeforeDate).toISOString()
    })

    const unitOfMeasurementList = ( unitOfMeasurementOptions ) => {
      let units = []

      Object.entries(unitOfMeasurementOptions).forEach(unit =>
        units[unit[0]] = unit[1].name
      )
      return units
    }

    const inventoryValidation = Yup.object().shape({
      name: Yup.string().required('Required'),
      productType: Yup.string().required('Required'),
      unitOfMeasurement: Yup.string().required('Required')
    })

    return (
      <Dialog
        open={this.props.isDialogOpen}
        maxWidth='sm'
        fullWidth={true}
        onClose={() => { handleDialog(false) }}
      >
        <Formik
          validateOnMount
          initialValues={initialValues}
          initialTouched={{ name: true, productType: true, unitOfMeasurement: true }}
          validationSchema={inventoryValidation}
          onSubmit={values => {
            handleInventory(normalizeInventory(values))
            handleDialog(true)
          }}>
          {helpers =>
            <Form
              noValidate
              autoComplete='off'
              id={formName}
            >
              <DialogTitle id='alert-dialog-title'>
                {`${title} Inventory`}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='name'
                      label='Name'
                      component={TextField}
                    />
                    <ErrorMessage name="name" />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='productType'
                      label='Product Type'
                      component={TextField}
                      select>
                      {
                        productOptions.map((product) =>
                          <MenuItem value={product.name}>{product.name}</MenuItem>
                        )
                      }
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='description'
                      label='Description'
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='averagePrice'
                      label='Average Price'
                      type='number'
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='amount'
                      label='Amount'
                      type='number'
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true }}
                      name='unitOfMeasurement'
                      label='Unit of Measurement'
                      component={TextField}
                      select>
                      {
                        Object.entries(unitOfMeasurementList(unitOfMeasurementOptions)).map(unit =>
                          <MenuItem value={unit[0]}>{unit[1]}</MenuItem>
                        )
                      }
                    </Field>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='bestBeforeDate'
                      label='Best Before Date'
                      type='date'
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <label>
                      <Field type="checkbox" name='neverExpires' label='Never Expires'/>
                      Never Expires
                    </label>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleDialog(false) }}color='secondary'>Cancel</Button>
                <Button
                  disableElevation
                  variant='contained'
                  type='submit'
                  form={formName}
                  color='secondary'
                  disabled={!helpers.dirty}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          }
        </Formik>
      </Dialog>
    )
  }
}

export default InventoryFormModal