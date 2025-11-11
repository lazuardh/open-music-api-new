const mapDBToModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapSongsDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { mapDBToModel, mapSongsDBToModel };
