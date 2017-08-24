/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var quality;
  
  /**
   *
   */
  editor.BitmapExporter = { };

  /**
   *
   */
  editor.BitmapExporter.export = function(filename, type) {
    // set the type and the quality
    if (type === "png") {
      type = "image/png";
      quality = 1;
    }
    if (type === "jpg") {
      type ="image/jpeg";
      quality = 0.9;
    }

    // move to the origin position
    var container = document.querySelector("#container");
    container.scrollLeft = 0;
    container.scrollTop = 0;

    var win = nw.Window.get(),
        winW = window.innerWidth,
        winH = window.innerHeight -60,
        iframe = editor.scenes[0].iframe,
        rect = iframe.getBoundingClientRect(),
        w = rect.width,
        h = rect.height,
        x = parseInt(rect.left +0.5),
        y = parseInt(rect.top  +0.5),
        offsetX = 0,
        offsetY = 0,
        finish = false;

    // the canvas to hold the image
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",  w);
    canvas.setAttribute("height", h);
    var ctx = canvas.getContext("2d");

    // function that take a part of the screenshot 
    function takeImagePart() {
      win.capturePage(function(img) {
        var tmpImg = new window.Image();

        // add an event listener to draw in the canvas the image taken 
        tmpImg.addEventListener("load", function(evt) {
          ctx.drawImage(tmpImg, -x+offsetX, -y+offsetY, window.innerWidth, window.innerHeight);

          // move vertically
          container.scrollTop += winH;

          if (offsetY == container.scrollTop) {
            offsetY = 0;

            // move horizontally
            container.scrollLeft = offsetX + winW;
            container.scrollTop = 0;

            // if the offset in x and y dont change, then we finish
            if (offsetX == container.scrollLeft) {
              finish = true;
            }
            else {
              offsetX = container.scrollLeft;
            }
          }
          else {
            offsetY = container.scrollTop;
          }

          // finish the image
          if (finish) {
            // write the image
            fs.writeFileSync(filename, canvas.toDataURL(type, quality).replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64");
            // return to the initial position
            container.scrollLeft = 0;
            container.scrollTop = 0;
          }
          else {
            // wait a little before take another part
            setTimeout(function() { takeImagePart() }, 50);
          }
        });

        tmpImg.src = img;

      }, "png");
    }

    setTimeout(function() { takeImagePart() }, 50);
  }

  return editor;
})(editor || {});
