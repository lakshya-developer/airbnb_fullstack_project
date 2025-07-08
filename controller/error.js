exports.error404 = (req, res , next) => {
  res.status(404).render('404',{isLoggedIn: false,currentPath: req.path});
}