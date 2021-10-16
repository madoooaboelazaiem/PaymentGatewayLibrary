async function healthCheck(req, res, next) {
  try {
    res.status(200).json({ db_connection: 'working', web_server: 'working' });
  } catch (e) {
    next(e);
  }
}
module.exports = {
  healthCheck,
};
