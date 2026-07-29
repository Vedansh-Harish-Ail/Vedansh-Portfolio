const { Jimp } = require('jimp');

Jimp.read('assets/brush_stroke.png')
  .then(image => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    console.log(`Image dimensions: ${width}x${height}`);
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const idx = (y * width + x) * 4;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        
        // If it is very dark (black background), make it transparent
        if (r < 25 && g < 25 && b < 25) {
          image.bitmap.data[idx] = 0;
          image.bitmap.data[idx + 1] = 0;
          image.bitmap.data[idx + 2] = 0;
          image.bitmap.data[idx + 3] = 0; // Alpha
        } else {
          // Inside the brush: make it solid black (for alpha mask)
          image.bitmap.data[idx] = 0;
          image.bitmap.data[idx + 1] = 0;
          image.bitmap.data[idx + 2] = 0;
          image.bitmap.data[idx + 3] = 255; // Alpha
        }
      }
    }
    
    return image.write('assets/brush_stroke_mask.png');
  })
  .then(() => {
    console.log('Brush stroke mask created successfully!');
  })
  .catch(err => {
    console.error('Error:', err);
  });
