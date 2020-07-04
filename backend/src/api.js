const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const ProductController = require('./controllers/ProductController');

const routes = express.Router();

/**
 * GET user
 */
routes.get('/user', UserController.index);

/**
 * POST user
 */
routes.post('/user', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        pwd: Joi.string().required(),
        cpf: Joi.string().required(),
    })
}), UserController.create);

/**
 * DELETE user
 */
routes.delete('/user/:id', UserController.delete);

/**
 * POST session
 */
routes.post('/session', SessionController.create);

/**
 * GET product
 */
routes.get('/product', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    })
}), ProductController.index);

/**
 * POST product
 */
routes.post('/product', ProductController.create);

/**
 * DELETE product
 */
routes.delete('/product/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), ProductController.delete);

module.exports = routes;
