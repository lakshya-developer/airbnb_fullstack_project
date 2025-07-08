
//Core modules
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


const homesSchema = mongoose.Schema({
  houseName: {type: String, required: true},
  description: {type:String},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  photo: {type:String},
  hostId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  __V: Number,
});


module.exports = mongoose.model('Homes', homesSchema);


// class Home {
//   constructor(houseName, description, pricePerNight, location, rating, photo, _id) {
//     this.houseName = houseName;
//     this.description = description;
//     this.pricePerNight = pricePerNight;
//     this.location = location;
//     this.rating = rating;
//     this.photo = photo;
//     if(id){
//       this._id = _id;
//     }
//     // mysql.query(`INSERT INTO HOMES (
//     //   houseName,
//     //   description,
//     //   price,
//     //   location,
//     //   rating,
//     //   photo,
//     //   bookmarked
//     // ) VALUES (
//     //   ?,
//     //   ?,
//     //   ?,
//     //   ?,
//     //   ?,
//     //   ?)`, [houseName, description, pricePerNight, location, rating, photo]);
//   }

//   save(){
//     // const db = getDB();
//     // db.collection('homes').insertOne(this);
//   }

//   static async fetchAll() {
//     // const db = getDB();
//     // return db.collection('homes').find().toArray();
//     // const homeDataPath = path.join(rootDir, "data", "homes.json");
//     // fs.readFile(homeDataPath, (err, data) => {
//     //   if (err) {
//     //     console.error("File read error:", err);
//     //     return callback([]);
//     //   }

//     //   try {
//     //     callback(JSON.parse(data));
//     //   } catch (parseErr) {
//     //     // console.error("JSON parse error:", parseErr);
//     //     callback([]);
//     //   }
//     // });
    
//     // const [registerdHomes] = await mysql.query('SELECT * FROM homes');
//     //   if(registerdHomes.length === 0){
//     //     return [];
//     //   }else{
//     //     return registerdHomes;
//     //   }  
//   }

//   find(homeID) {
//     // const db = getDB();
//     // return db.collection('homes').find({_id: new ObjectId(String(homeID))}).next();
//   }

//   delete(homeID){
//     // const db = getDB();
//     // return db.collection('homes').deleteOne({_id: new ObjectId(String(homeID))});
//   }
// }



// module.exports = {
//   Home,
// };