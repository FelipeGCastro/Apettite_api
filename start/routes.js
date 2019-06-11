'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.get('users', 'UserController.index')
Route.put('users/:id', 'UserController.update')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.group(() => {
  Route.get('sessions', 'SessionController.show')
  // Route.get('product/:id/files', 'ProductFileController.index')
  // Route.get('product/:id/files/:fileId', 'ProductFileController.show')
  // Route.post('product/:id/files', 'ProductFileController.store')
  // Route.delete('product/:id/files/:fileId', 'ProductFileController.destroy')

  // FILES PART
  Route.resource('products.files', 'ProductFileController').apiOnly()

  // PRODUCT PART

  Route.resource('products', 'ProductController')
    .apiOnly()
    .validator(new Map([[['product.store'], ['Product']]]))

  Route.get('myproducts', 'ProductController.myProducts')

  // ORDER PART

  Route.get('orders', 'OrderController.index')
  Route.resource('products.orders', 'OrderController')
    .apiOnly()
    .validator(new Map([[['products.order.store'], ['Order']]]))
    .except(['index'])

  // OFFERS PART

  Route.resource('products.offers', 'OfferBookingController').apiOnly()

  // BOOKING PART
  Route.get('bookings', 'BookingController.index')
  Route.resource('products.bookings', 'BookingController')
    .apiOnly()
    .except(['index'])
}).middleware(['auth'])
// .middleware(['auth', 'is:(administrator || moderator || user)'])

Route.resource('permissions', 'PermissionController')
  .apiOnly()
  .middleware('auth')

Route.resource('roles', 'RoleController')
  .apiOnly()
  .middleware('auth')
