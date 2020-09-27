exports.get = (req, res, next) => {
  return res.jsondata({file: req.file.path});
}
