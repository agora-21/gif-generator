'use strict'

const fs = require('fs');

const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');

const WIDTH = 1024;
const HEIGHT = 768;

const IMAGES_PATH = './images/';
const GIF_FILE_NAME = 'myanimation.gif';

const encoder = new GIFEncoder(WIDTH, HEIGHT);

encoder.createReadStream().pipe(fs.createWriteStream(GIF_FILE_NAME));

encoder.start();
encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
encoder.setDelay(42);  // frame delay in ms

(async () => {
  const imagesList = fs.readdirSync(IMAGES_PATH);

  await imagesList.forEach(async (imageFile) => {
    console.log(`Processing image: ${imageFile}`);

    const image = await loadImage(`${IMAGES_PATH}${imageFile}`);

    const canvas = createCanvas(WIDTH, HEIGHT);
    const canvasContext = canvas.getContext('2d');

    canvasContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

    encoder.addFrame(canvasContext);
  })

  encoder.finish();

  console.log('GIF generated!');
})()
