'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewOrderMail')
const OrderHook = (exports = module.exports = {})

OrderHook.sendPendingOrderMail = async orderInstance => {
  if (!orderInstance.amount && !orderInstance.dirty.amount) return

  // eslint-disable-next-line camelcase
  const { email, first_name } = await orderInstance.customer().fetch()

  const { name } = await orderInstance.product().fetch()

  const { amount } = orderInstance

  Kue.dispatch(Job.key, { email, first_name, name, amount }, { attempts: 3 })
}
