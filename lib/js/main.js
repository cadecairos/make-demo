require.config({
  baseUrl: "lib/",
  paths: {
    text:    "ext/text",
    MakeAPI: "ext/make-api"
  }
});

requirejs([ "MakeAPI", "text!html/tile.html" ],
function ( MakeAPI, tile ) {

  var range = document.createRange();

  range.selectNode( document.body || document.head );

  // createContextual fragment is not supported in IE
  var TILE_FRAG     = range.createContextualFragment( tile );

  var makeApiURL    = "https://makeapi.webmaker.org",
      requestTag    = "webmaker:featured",
      sortBy        = "createdAt"
      tileContainer = document.querySelector( ".tile-container" );

  var makeClient = new MakeAPI({
    apiURL: makeApiURL
  });

  function buildTile( makeData ) {
    var tile      = TILE_FRAG.firstElementChild.cloneNode( true ),
        titleElem = tile.querySelector( ".make-title" );

    titleElem.textContent = makeData.title;
    tile.style.background = "url(\"" + makeData.thumbnail + "\")";

    tileContainer.appendChild( tile )
  }

  function searchCallback( error, results, totalHits ) {
    if ( error || !results.length ) {
      console.error( "Something went wrong: " + JSON.stringify( error ) );
      return;
    }
    results.forEach(buildTile);
  }

  // Make the request for data from the Make API
  // There are various ways of doing this - see the documentation for complete details
  // https://github.com/mozilla/makeapi-client/blob/master/README.md

  makeClient
  .tags( requestTag )
  .sortByField( sortBy, "desc" )
  .limit( 12 )
  .then( searchCallback );

});
