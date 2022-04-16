const helpers = require('./helpers');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/CreateEvent/CreateEvent.html'));
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.post('/upload-pic', (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  const upload = multer({storage: storage, fileFilter: helpers.imageFilter}).single('header_pic');

  upload(req, res, function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send('Please select an image to upload');
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    res.send(`Uploaded successfully <a href="./">Create a new article</a>`);
  });
});
