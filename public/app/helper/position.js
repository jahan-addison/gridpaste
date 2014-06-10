module.exports = function(args, board) {
  var translateX   = false,
      translateY   = false,
      placeX       = 0,
      placeY       = 0;

      
  var move = function(point, places) {
    var place;
    if (translateX || Math.abs(point[0]) > board.xx) {
      if (point[0] < 0) {
        if (placeX) {
          place = (-placeX / 2) - 3;
        }
        place    = place || point[0] + board.xx - 3;
        point[0] = point[0] - (place * 2);      
      } else {
        if (placeX) {
          place = (placeX / 2) + 3;
        }
        place    = place || point[0] - board.xx - 3;
        point[0] = point[0] - (place * 2);
      }
    }
    if (translateY || Math.abs(point[1]) > board.yy) {    
      if (point[1] < 0) {
        if (placeY) {
          place = (-placeY / 1) - 3;
        }
        place    = place || point[1] + board.yy + 3;
        point[1] = point[1] - place;      
      } else {
        if (placeY) {
          place = (placeY / 1) + 3;
        }
        place    = place || point[1] - board.yy + 3;
        point[1] = point[1] - place;
      }
    }
  };

  // first pass
  for(arg in args) {
    if (args.hasOwnProperty(arg)) {
      if ($.isArray(args[arg])) {
        if (arg == 'center') {
          var point = args[arg];
          if (Math.abs(point[0]) > board.xx || Math.abs(point[1]) > board.yy) {
            move(args[arg]);
          }
        }
        if (arg.match(/point\d*?/)) {
          var point = args[arg];
          if (Math.abs(point[0]) > board.xx) {
            translateX = true;
            if (Math.abs(point[0]) - board.xx > placeX) {
              placeX = Math.abs(point[0]) - board.xx;
            }
          }
          if (Math.abs(point[1]) > board.yy) {
            translateY = true;
            if (Math.abs(point[1]) - board.yy > placeY) {
              placeY = Math.abs(point[1]) - board.yy;
            }
          }
        }
      }
    }
  }
  // second pass, perform distance-preserving translation
  if (translateX || translateY) {
    for(arg in args) {
      if (args.hasOwnProperty(arg)) {
        if ($.isArray(args[arg])) {
          if (arg.match(/point\d?/)) {
            move(args[arg]);            
          }
        }
      }
    }    
  }
};