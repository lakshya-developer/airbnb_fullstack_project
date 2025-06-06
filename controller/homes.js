const {Home} = require('../models/home');

exports.getHome = async (req, res , next) => {
    const registeredHomes = await Home.fetchFile();
    res.render('store/home-list.ejs', {registeredHomes: registeredHomes });   
}

exports.getHostHome =  (req, res , next) => {
  res.render('host/host');
}

exports.useAddHome = (req, res , next) => {
  res.render('host/add-home.ejs');
}



exports.postHomesAdded = (req, res , next) => {
  console.log('Home Registration successful for:', req.body, req.body.houseName);

  const home = new Home(req.body.houseName, req.body.description,req.body.pricePerNight,req.body.location, req.body.rating, req.body.photo);

  res.render('host/home-added');
}

exports.getUserHome = (req, res , next) => {
  res.render('user');
}

