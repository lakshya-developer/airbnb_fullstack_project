const { render } = require("ejs");
const rootDir = require("../utils/pathUtil");
const path =  require('path');
const fs = require("fs");

const Home = require("../models/home");
const User = require("../models/user");
const { ObjectId } = require("mongodb");



exports.getHome = async (req, res, next) => {
  const registeredHomes = await Home.find()
    .then((homes) => {
      return homes;
    })
    .catch((err) => {
      console.log("Error occured while fetching the database.");
    });
  console.log("homes:", registeredHomes);
  console.log("Session :", req.session.isLoggedIn);
  res.render("store/home-details.ejs", {
    registeredHomes: registeredHomes,
    isLoggedIn: req.isLoggedIn,
    currentPath: req.path,
    userType: req.user?.userType,
  });
};

exports.getHomeList = async (req, res, next) => {
  const registeredHomes = await Home.find()
    .then((homes) => {
      return homes;
    })
    .catch((err) => {
      console.log("Error occured while fetching the database.");
    });
  res.render("store/home-list.ejs", {
    registeredHomes: registeredHomes,
    isLoggedIn: req.isLoggedIn,
    currentPath: "/home-list",
    userType: req.user.userType,
  });
};

exports.getHouseRules = [(req, res, next) => {  
  if(!req.session.isLoggedIn){
    return res.redirect("/login");
  }
  next(); 
},
(req, res, next) => {
  const homeId = req.params.homeId;

  const filePath = path.join(rootDir, 'rules',  `${homeId}.pdf`);

  res.download(filePath, 'Rules.pdf');
}

]

exports.postDetails = async (req, res, next) => {
  const hid = req.body.homeId;
  const from = req.body.from;
  console.log("homeId:", hid);
  const detail = await Home.findById(hid).then((home) => {
    console.log(home);
    return home;
  });
  // console.log(req.user.userType);
  res.render("details.ejs", {
    home: detail,
    userType: req.user?.userType,
    from,
  });
};

exports.getfavourite = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("favourite");
    const favourite = user.favourite;
    console.log("Favourites:", favourite);

    res.render("favourite", {
      favHomes: favourite,
      isLoggedIn: req.isLoggedIn,
      currentPath: req.path,
      userType: req.user.userType,
    });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).send("Failed to load favourites.");
  }
};

exports.postfavourite = async (req, res, next) => {
  const homeId = req.body.id;
  console.log("House id:", homeId);
  try {
    // Check if already added to favourites
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const alreadyFav = await user.favourite.includes(homeId);

    // const alreadyFav = await Favourite.findOne({ homeId: homeId });

    if (!alreadyFav) {
      // Add to favourites collection
      // const fav = new Favourite({ homeId: homeId }); // if your schema is { homeId: ObjectId }
      const fav = user.favourite.push(homeId);
      await user.save();
      console.log("Home added to favourite:", fav);
    } else {
      console.log("Home is already in favourites.");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
  res.redirect("/favourite");
};

exports.deleteFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  const del = user.favourite.pop(homeId);
  await user.save();

  // Favourite.deleteOne({ _id: homeId })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     console.log("Error while deleting house.", err);
  //   });

  res.redirect("/favourite");
};

exports.getBookings = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("booking");
    const bookings = user.booking;
    console.log("Bookings:", bookings);

    res.render("bookings", {
      bookingHomes: bookings,
      isLoggedIn: req.isLoggedIn,
      currentPath: req.path,
      userType: req.user.userType,
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Failed to load favourites.");
  }
};

exports.postBookings = async (req, res, next) => {
  const homeId = req.body.id;
  console.log("HomeId:", homeId);
  try {
    // Check if already added to favourites
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const alreadyFav = await user.booking.includes(homeId);

    // const alreadyFav = await Favourite.findOne({ homeId: homeId });

    if (!alreadyFav) {
      // Add to favourites collection
      // const fav = new Favourite({ homeId: homeId }); // if your schema is { homeId: ObjectId }
      const booking = user.booking.push(homeId);
      await user.save();
      console.log("Home added to booking:", booking);
    } else {
      console.log("Home is already in booking.");
    }
  } catch (err) {
    console.error("Error occurred:", err);
  }
  res.redirect("/bookings");
};

exports.deleteBookings = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  const del = user.booking.pop(homeId);
  await user.save();

  // Bookings.deleteOne({ _id: homeId })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((err) => {
  //     console.log("error while deleting the booking", err);
  //   });

  res.redirect("/bookings");
};

exports.getHost = (req, res, next) => {
  console.log(req.path);
  res.render("host/host", {
    isLoggedIn: req.isLoggedIn,
    currentPath: "/host",
    userType: req.user.userType,
  });
};

exports.getHostHomes = async (req, res, next) => {
  const user = req.user._id;
  const hostedHomes = await Home.find({ hostId: user })
    .then((homes) => {
      return homes;
    })
    .catch((err) => {
      console.log("Error occured while fetching the database.");
    });
  // console.log("homes:", hostedHomes);
  res.render("host/host-homes", {
    hostedHomes: hostedHomes,
    isLoggedIn: req.isLoggedIn,
    currentPath: req.path,
    userType: req.user.userType,
  });
};

exports.editHostHomes = async (req, res, next) => {
  const homeId = req.body.homeId;
  console.log("homeID:", homeId);

  const home = await Home.find({ _id: homeId })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log("Error while finding the house:", err);
    });
  console.log("home:", home);
  res.render("host/editHostHomes", {
    home,
    currentPath: req.path,
    userType: req.user.userType,
  });
};

exports.submitEditHomes = (req, res) => {
  const { houseName, description, price, location, rating } = req.body;
  const homeId = req.body.homeId;
  console.log("file:",req.file);
  Home.findById(homeId).then((home) => {
    console.log("Submit edit:",home);
    home.houseName = houseName;
    home.description = description;
    home.price = price;
    home.location = location;
    home.rating = rating;
    if(req.file){
      fs.unlink(home.photo, (err) => {
        if(err){
          console.log("Error while finding the file.", err);
        }
      })
      home.photo = req.file.path;
    }
    home.save().then(result => {
      console.log("Home updated", result);
    }).catch(err => {
      console.log("Error occured while updating home", err);
    })
    res.redirect("/host/host-home");
  })
};

exports.deleteHomes = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const homeId = req.body.id;
  await Home.findById(homeId).then((home) => {
    fs.unlink(home.photo, (err) => {
      if(err){
        console.log("Error while finding the file.", err);
      }
    })
  })
  await Home.deleteOne({ _id: homeId });
  await user.favourite?.pop(homeId);
  await user.booking?.pop(homeId);
  await user.save();
  res.redirect("/host/host-home");
};

exports.useAddHome = (req, res, next) => {
  res.render("host/add-home.ejs", {
    isLoggedIn: req.isLoggedIn,
    currentPath: req.path,
    userType: req.user.userType,
  });
};

exports.postHomesAdded = async (req, res, next) => {
  const { houseName, description, price, location, rating } = req.body;
  console.log(req.file);
  const photo = req.file.path;

  if (!req.file) {
    return res.status(400).render("host/add-home", {
      isLoggedIn: false,
      currentPath: "/sign-up",
      errorMessage: ["No image provided"],
      oldInput: {
        houseName,
        description,
        price,
        location,
        rating,
      },
      isLoggedIn: req.isLoggedIn,
      currentPath: req.path,
      userType: req.user.userType,
    });
  }
  const home = new Home({
    houseName,
    description,
    price,
    location,
    rating,
    photo,
    hostId: req.user._id,
  });

  await home.save().then((result) => {
    console.log("Home added:", result);
  });

  res.render("host/home-added", {
    currentPath: req.path,
    userType: req.user.userType,
  });
};

exports.getUserProfile = (req, res, next) => {
  res.render("user", {
    isLoggedIn: req.isLoggedIn,
    currentPath: req.path,
    userType: req.user.userType,
    user: req.user,
  });
};
