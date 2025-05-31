//Core modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");
const mysql = require("../utils/database");

let registerdHomes = [];

class Home {
  constructor(houseName, description, pricePerNight, location, rating, photo) {
    mysql.query(`INSERT INTO HOMES (
      houseName,
      description,
      price,
      location,
      rating,
      photo
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?)`, [houseName, description, pricePerNight, location, rating, photo]);

  }

  static async fetchFile() {
    // const homeDataPath = path.join(rootDir, "data", "homes.json");
    // fs.readFile(homeDataPath, (err, data) => {
    //   if (err) {
    //     console.error("File read error:", err);
    //     return callback([]);
    //   }

    //   try {
    //     callback(JSON.parse(data));
    //   } catch (parseErr) {
    //     // console.error("JSON parse error:", parseErr);
    //     callback([]);
    //   }
    // });
    
    const [registerdHomes] = await mysql.query('SELECT * FROM homes');
      if(registerdHomes.length === 0){
        return [];
      }else{
        return registerdHomes;
      }  
  }
}

module.exports = {
  Home,
};
