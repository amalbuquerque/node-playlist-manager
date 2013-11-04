var DEBUG = true;

$(document).ready(function(){
    $("form[name='testform']").submit(function ( event ) {
        event.preventDefault();
        getURL();
        return false;
    });
});

function updateInformationTitle(){
    $('#msg_header > h3')
        .text('Playlist received (Position: {0}/{1}, Playing {2}/{3}):'
                .format( playlistPosition+1,
                    playlistFromDirectory.length,
                    playlistPlayedCounter+1,
                    maxPlaylistTimesPlayed ));
}

function updateInformation( data ){
    var prettyData = prettyPrint(data);
    $('#message').html(prettyData);
    // updateInformationTitle();
}

function handleJSONPData( dataWeGotViaJsonp ){
    if (dataWeGotViaJsonp) {
        alert('Received ' + dataWeGotViaJsonp );
        var objectReceived = $.parseJSON(dataWeGotViaJsonp);
        updateInformation( objectReceived );
    }
}

function getURL() {
    log('getURL from: ' + $("input[name='geturl']").val());

    $.ajax({
        url: $("input[name='geturl']").val(),
        dataType: 'jsonp',
        // define qual a callback que devera ser
        // utilizada pelo servidor
        jsonpCallback: 'handleJSONPData',
        success: function( dataWeGotViaJsonp ){
            // Chama esta depois da jsonpCallback
            // alert('SUCCESS AJAX FUNC');
        },
        error: function ( jqXHR, textStatus, errorThrown ) {
                   log('ERROR AJAX FUNC: Get Failed!!! ' + textStatus + '; ' + errorThrown);
               }
    });

    log('getURL() END');
};
