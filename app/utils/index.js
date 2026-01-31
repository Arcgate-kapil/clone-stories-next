export const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
   
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export const getAltImg = (url) => {
  
  if(!!url && !!url.match(/([^\/]+)(?=\.\w+$)/) && !!url.match(/([^\/]+)(?=\.\w+$)/).length) {
    return url.match(/([^\/]+)(?=\.\w+$)/)[0];
  }
  return '';
}

export const compare = ( a, b ) => {
  if ( a.storyType < b.storyType ){
    return -1;
  }
  if ( a.storyType > b.storyType ){
    return 1;
  }
  return 0;
}

export const getCategoriesList = (blogs) => {
  let categories = [];
  if(!!blogs) {
    categories = [...new Set(blogs['stories'].map(function(item) { return {storySlug: item["storySlug"], storyType: item['storyType']} }))];
    categories = categories.reduce(
      (accumulator, current) => accumulator.some(x => x.storySlug.trim() == current.storySlug.trim())? accumulator: [...accumulator, current ], []
    );
    categories = categories.sort( compare )
  }
  return categories
}


export const timeConverter = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
