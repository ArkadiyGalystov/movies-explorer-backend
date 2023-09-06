const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_URL, REG_EN } = require('../utils/constants');

const {
  getUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(REGEX_URL),
      trailerLink: Joi.string().required().pattern(REGEX_URL),
      thumbnail: Joi.string().required().pattern(REGEX_URL),
      owner: Joi.number().required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required().pattern(REG_EN),
    }),
  }),
  createMovie,
);

router.get('/', getUserMovies);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
