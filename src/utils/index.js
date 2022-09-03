export function cacheImage(image, callback) {
  const InstaceImage = new Image();
  callback(true); // set is caching data image
  InstaceImage.onload = () => {
    callback(false); // set is cached image will be done
  }
  InstaceImage.src = image;
}