import { HttpResponse, http } from 'msw'

import { ingredientsHandlers } from './ingredients'
import { productsHandlers } from './products'
import { userProductsHandlers } from './user-products'

export const defaultHandlers = [
  http.get('*/api/profile/access/google', () => HttpResponse.json({ success: true, data: null })),
  ...ingredientsHandlers,
  ...productsHandlers,
  ...userProductsHandlers,
]
