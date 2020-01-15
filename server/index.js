require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const query = `
    SELECT "productId", "name", "price", "image", "shortDescription"
    FROM "products";
  `;

  db.query(query)
    .then(result => res.status(200).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/products/:productId', (req, res, next) => {
  const { productId } = req.params;
  const query = `
    SELECT *
    FROM "products"
    WHERE "productId" = $1;
  `;
  const params = [productId];
  db.query(query, params)
    .then(result => {
      const targetProductInfo = result.rows[0];

      if (!targetProductInfo) {
        return next(new ClientError('Cannot find requested product ID', 404));
      }

      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  if (!req.session.cartId) {
    return res.status(200).json([]);
  }
  const query = `
     SELECT "c"."cartItemId",
            "c"."price",
            "p"."productId",
            "p"."image",
            "p"."name",
            "p"."shortDescription"
       FROM "cartItems" as "c"
       JOIN "products" as "p" using ("productId")
      WHERE "c"."cartId" = $1
    `;
  const params = [req.session.cartId];
  db.query(query, params)
    .then(result => {
      return res.status(200).json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/cart', (req, res, next) => {
  const { productId } = req.body;

  if (parseInt(productId) <= 0) {
    return next(new ClientError('Product ID must be a positive integer', 400));
  }

  const findProductPriceQuery = `
    SELECT price
    FROM "products"
    WHERE "productId" = $1;
  `;
  const params = [productId];

  db.query(findProductPriceQuery, params)
    .then(result => {
      if (result.rows.length === 0) {
        throw new ClientError('Cannot find requested product ID', 404);
      }

      const targetProductPrice = result.rows[0].price;

      if (req.session.cartId) {
        return { cartId: req.session.cartId, price: targetProductPrice };
      }

      const createNewCartQuery = `
        INSERT INTO "carts" ("cartId", "createdAt")
        VALUES (default, default)
        RETURNING "cartId";
      `;
      return db.query(createNewCartQuery)
        .then(result => {
          const cartId = result.rows[0].cartId;
          return { cartId, price: targetProductPrice };
        });
    })
    .then(cart => {
      req.session.cartId = cart.cartId;
      const createNewCartItemQuery = `
        INSERT INTO "cartItems" ("cartId", "productId", "price")
        VALUES ($1, $2, $3)
        RETURNING "cartItemId";
      `;
      const params = [cart.cartId, productId, cart.price];
      return db.query(createNewCartItemQuery, params)
        .then(result => {
          const cartItemId = result.rows[0].cartItemId;
          return cartItemId;
        });
    })
    .then(cartItemId => {
      const getCartItemDetailsQuery = `
         SELECT "c"."cartItemId",
                "c"."price",
                "p"."productId",
                "p"."image",
                "p"."name",
                "p"."shortDescription"
           FROM "cartItems" as "c"
           JOIN "products" as "p" using ("productId")
          WHERE "c"."cartItemId" = $1
      `;
      const params = [cartItemId];
      db.query(getCartItemDetailsQuery, params)
        .then(result => {
          const addedCartItemDetails = result.rows[0];
          return res.status(201).json(addedCartItemDetails);
        });
    })
    .catch(err => next(err));
});

app.post('/api/orders', (req, res, next) => {
  if (!req.session.cartId) {
    return next(new ClientError('No order is currently available', 400));
  }
  const hasValidOrderParams = req.body.name && req.body.creditCard && req.body.shippingAddress;
  if (!hasValidOrderParams) {
    return next(new ClientError('Order details are not valid. Please provide a name, a credit card number, and a shipping address for your order.', 400));
  }

  const query = `
     INSERT INTO "orders" ("cartId", "name", "creditCard", "shippingAddress")
          VALUES ($1, $2, $3, $4)
          RETURNING "orderId", "cartId", "name", "creditCard", "shippingAddress";
  `;
  const params = [req.session.cartId, req.body.name, req.body.creditCard, req.body.shippingAddress];

  db.query(query, params)
    .then(result => {
      delete req.session.cartId;
      return res.status(201).json(result.rows[0]);
    });
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
