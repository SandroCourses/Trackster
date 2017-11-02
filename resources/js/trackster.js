var Trackster = {};

$(document).ready(function() {

  numeral.register('locale', 'nl', {
    delimiters: {
      thousands: '.',
      decimal: ','
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    currency: {
      symbol: '€'
    }
  });

  numeral.locale('nl');

  $('#nav-search-btn').click(function() {
    var input = $('#nav-search-input').val();

    Trackster.searchTracksByTitle(input, null);

    $('h1').addClass('animating');
  });

  $('#nav-search-input').keypress(function(event) {
    if (event.which == 13){
      var input = $(this).val();

      Trackster.searchTracksByTitle(input, null);

      $('h1').addClass('animating');
    }
  });

  $('.list-column').click(function() {
    var input = $('#nav-search-input').val();
    var sortOn = $(this).attr('data-sort');

    if(typeof sortOn !== 'undefined') {
      $('h1').addClass('animating');
      Trackster.searchTracksByTitle(input, sortOn);
    }
  });
});

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $('#list-tracks').empty();

  for(var i = 0; i < tracks.length; i++) {
    var albumImage = '<img src=' + tracks[i].image[1]["#text"] + '></img>';

    var listeners = tracks[i].listeners;
    var formattedListeners = numeral(listeners).format('0,0');

    var rowTrack =
    '<div class="row track">' +
      '<a class="col-xs-offset-1 col-xs-1"' +
        'href="' + tracks[i].url + '"' +
        'target="_blank">' +
        '<i class="track-play-icon fa fa-play-circle-o fa-2x"></i>' +
      '</a>' +
      '<div class="col-xs-4">' + tracks[i].name + '</div>' +
      '<div class="col-xs-2">' + tracks[i].artist + '</div>' +
      '<div class="col-xs-2">' + albumImage +'</div>' +
      '<div class="col-xs-2">' + formattedListeners + '</div></div>';

    $('#list-tracks').append(rowTrack);
  }

  $('h1').removeClass('animating');
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title, sortOn) {
  var apiKey = 'ef1a931462136247632f04976cb9f78f';

  $.ajax({
    url: 'https://ws.audioscrobbler.com/2.0/'
      + '?method=track.search'
      + '&track=' + title
      + '&api_key=' + apiKey
      + '&format=json',
    dataType: 'jsonp',
    success: function(data) {
      if(typeof data.results === 'undefined') {
        return;
      }

      var tracks = data.results.trackmatches.track;

      if(sortOn) {
        if(sortOn === 'song') {
          tracks.sort(function(a, b) {
            var valueA = a.name.toUpperCase();
            var valueB = b.name.toUpperCase();

            if (valueA < valueB) {
              return -1;
            }
            if (valueA > valueB) {
              return 1;
            }

            return 0;
          });
        } else if(sortOn === 'artist') {
          tracks.sort(function(a, b) {
            var valueA = a.artist.toUpperCase();
            var valueB = b.artist.toUpperCase();

            if (valueA < valueB) {
              return -1;
            }
            if (valueA > valueB) {
              return 1;
            }

            return 0;
          });
        } else if(sortOn === 'listeners') {
          tracks.sort(function (a, b) {
            return b.listeners - a.listeners;
          });
        }
      } else {
        tracks.sort(function (a, b) {
          return b.listeners - a.listeners;
        });
      }

      Trackster.renderTracks(tracks);
    }
  })
};
