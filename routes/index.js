const { Router } = require('express');
const router = Router();

const productsRouter = require('./products');
const loginRouter = require('./login');

router.use('/products', productsRouter);
router.use('/', loginRouter);

module.exports = router;