//Core modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

// fake database

// { HouseName: 'Ghar',
//   description: "This is the description of the house.",
//   pricePerNight: 3000,
//   location: 'Dwarka sector 3',
//   rating: 5,
//   photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVSeD_WriXUhtdY4gki8v9waM5W6BotT_aXg&s'
// },
// { HouseName: 'Ghar',
//   description: "This is the description of the house.",
//   pricePerNight: 3000,
//   location: 'Dwarka sector 3',
//   rating: 3,
//   photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRECrftJdWWRGO60WogG2sWKhFxbNys7y7d5g&s'
// },
// { HouseName: 'Ghar',
//   description: "This is the description of the house.",
//   pricePerNight: 3000,
//   location: 'Dwarka sector 3',
//   rating: 2,
//   photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0HrpsMp1rqoMs3UnnPLHLg4Vx04zy2njOPw&s'
// },
// { HouseName: 'Ghar',
//   description: "This is the description of the house.",
//   pricePerNight: 3000,
//   location: 'Dwarka sector 3',
//   rating: 4,
//   photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTh3RdZyEsEdGE2pPUpPsUBWDsniI_elDAbg&s'
// },

let registerdHomes = [];

class Home {

  constructor(houseName, description, pricePerNight, location, rating, photo) {
    this.HouseName = houseName;
    this.description = description;
    this.pricePerNight = pricePerNight;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    registerdHomes.push(this);
    this.save();
  }
    
  save() {
    const homeDataPath = path.join(rootDir, "data", "homes.json");
    fs.readFile(homeDataPath, (err, data) => {
      let homes = [];   
      if (!err && data !== "") {
        try {
          homes = JSON.parse(data);
          if (!Array.isArray(homes)) homes = [];
        } catch (parseErr) {
          console.error("Could not parse JSON. Resetting file.");
          homes = [];
        }
      }
    
    homes.push(this);

    fs.writeFile(homeDataPath, JSON.stringify(homes, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Home appended successfully.");
    }
  });
    });
  }


  static fetchFile(callback) {
    const homeDataPath = path.join(rootDir, "data", "homes.json");
    fs.readFile(homeDataPath, (err, data) => {
      if (err) {
        console.error("File read error:", err);
        return callback([]);
      }

      try {
        callback(JSON.parse(data));
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        callback([]);
      }
    });
  }

}

module.exports = {
  Home,
};
