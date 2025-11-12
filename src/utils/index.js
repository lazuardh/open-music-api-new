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

const mapPlaylistsDBToModel = ({ id, name, owner }) => ({
  id, name, owner,
});

module.exports = { mapDBToModel, mapSongsDBToModel, mapPlaylistsDBToModel };
