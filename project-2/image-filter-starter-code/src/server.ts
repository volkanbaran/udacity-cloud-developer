import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';



(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  app.get("/filteredimage", async (req, res, next) => {

    const imageUrl: string = req.query.image_url;

    //validateUrl
    if (!imageUrl) {
      res.status(400).send("image_url is required")
    }

    //filter image
    filterImageFromURL(imageUrl, next).then(filiteredImagePath => {
      res.status(200).sendFile(filiteredImagePath, () => {
        //delete local files after response
        const files = [filiteredImagePath]
        deleteLocalFiles(files);
      })
    }).catch(error => {
      // filterImageFromURL throws exception if url is not image or valid
      res.status(422).send(error.message);
      console.log(error);
    });

  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();