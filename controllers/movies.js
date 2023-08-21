const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// сохраненные фильмы
function getUserMovies(req, res, next) {
  const { userId } = req.user;
  Movie.find({ owner: userId })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
}

// удаление фильма по id карточке
function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { userId } = req.user;

  Movie.findById({
    _id: movieId,
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Данные по указанному id не найдены');
      }

      const { owner: movieOwnerId } = movie;

      if (movieOwnerId.valueOf() !== userId) {
        throw new ForbiddenError('Нет прав доступа');
      }

      return Movie.findByIdAndDelete(movieId);
    })
    .then((deletedMovie) => {
      if (!deletedMovie) {
        throw new NotFoundError('Карточка уже была удалена');
      }

      res.send({ data: deletedMovie });
    })
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { userId } = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: userId,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
