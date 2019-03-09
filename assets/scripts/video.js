  /*----- youtube aip -----*/
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var ytPlayers = {};
  var initVideo;
  
  function onYouTubeIframeAPIReady() {
    if(typeof initVideo === "function"){
      initVideo();
    }
  }

  function embedYoutube(i,elem){
    var videoId = $(elem).attr('videoid');
    var playerId = videoId;
    $(elem).attr('id', playerId);
    ytPlayers[playerId] = ytInit(playerId, videoId);
  }

  function ytInit(playerId, videoId){
    var ytPlayer = new YT.Player(
      playerId,
      {
        width: '100%',
        height: '100%',
        videoId: videoId,
        playerVars: {
          enablejsapi: 1,
          rel:0,
          controls: 1,
          showinfo: 0,
        },
        events: {
          // onReady: onPlayerReady,
          // 'onStateChange': onPlayerStateChange,
          onError: onPlayerError
        }
      }
    );
    return ytPlayer;
  }  

  function onPlayerReady(event) {
    event.target.setVolume(0);
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
  }

  function onPlayerError(event) {
    console.log(e)
  }
