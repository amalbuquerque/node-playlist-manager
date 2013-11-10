var DEBUG = true;

$(document).ready(function(){
    // alert( 'myVars: ' + _hosts + '; ' + _infopath );

    setupTabs( _hosts );

    $("form[name='testform']").submit(function ( event ) {
        event.preventDefault();
        getInfoFromURL( '#tabs-getinfo' );
        return false;
    });
});

function setupTabs( hostsStringArray ) {
    if ( !hostsStringArray )
        return;

    var hosts = eval( hostsStringArray );

    // 1. criar uma entrada na unordered list por host
    var ul_to_fill = $('#tab-container > ul');
    var topdiv_to_fill = $('#tab-container');
    // var template = '<li class="tab"><a href="#tabs1-html">HTML Markup</a></li>';
    var li_template = '<li class="tab"><a href="#{0}">{1}</a></li>';
    // var div_template = '<div id="tabs-js"><h2>JS for these tabs</h2></div>';
    var div_template = '<div id="{0}"><h2>{1}</h2></div>';

    hosts.forEach(function ( h ) {
        // preencher e inserir o <li>
        var template_filled = li_template.format( h.nome, h.nome + '@' + h.host );
        ul_to_fill.append( template_filled );

        // preencher e inserir o <div>
        template_filled = div_template.format( h.nome, h.nome + '@' + h.host + ', INFO OBTIDA:' );
        topdiv_to_fill.append( template_filled );
    });

    // 2. criar um div para cada um dos host a seguir a <ul>
    $('#tab-container').easytabs();
}

function updateInformation( data, div_to_update ){
    var prettyData = prettyPrint(data);
    $(div_to_update).html(prettyData);
    // $(div_to_update).append(prettyData);
}

function getInfoFromURL( id_tab_to_update ) {
    log('getInfoFromURL from: ' + $("input[name='geturl']").val());

    var req = $.ajax({
        url: $("input[name='geturl']").val(),
        dataType: 'jsonp',
        // em caso de erro no parse da resposta despoleta error() imediato
        // num 404 out timeout, so ao fim dos 5 segs e que despoleta o error
        timeout: 5000
        // define qual a callback que devera ser
        // utilizada pelo servidor. Neste caso 'handleJSONPData'
        // deveria ser uma function existente que recebia um argumento
        // jsonpCallback: 'handleJSONPData',
    });

    req.success( function( dataWeGotViaJsonp ){
        // Chama esta depois da jsonpCallback
        if (dataWeGotViaJsonp) {
            // alert( 'Received ' + dataWeGotViaJsonp );
            var objectReceived = $.parseJSON(dataWeGotViaJsonp);
            updateInformation( objectReceived, id_tab_to_update );
        }
    });

    req.error(function ( jqXHR, textStatus, errorThrown ) {
        log('ERROR AJAX FUNC: Get Failed!!! ' + textStatus + '; ' + errorThrown);
        alert( 'Error obtaining Info' );
        $(id_tab_to_update).html("<h2>Error: " + textStatus + "</h2>");
    });

    log('getInfoFromURL() END');
};

function getInfoFromURL_OLD( id_tab_to_update ) {
    log('getInfoFromURL from: ' + $("input[name='geturl']").val());

    $.ajax({
        url: $("input[name='geturl']").val(),
        dataType: 'jsonp',
        // define qual a callback que devera ser
        // utilizada pelo servidor. Neste caso 'handleJSONPData'
        // deveria ser uma function existente que recebia um argumento
        // jsonpCallback: 'handleJSONPData',
        success: function( dataWeGotViaJsonp ){
            // Chama esta depois da jsonpCallback
            if (dataWeGotViaJsonp) {
                // alert( 'Received ' + dataWeGotViaJsonp );
                var objectReceived = $.parseJSON(dataWeGotViaJsonp);
                updateInformation( objectReceived, id_tab_to_update );
            }
        },
        error: function ( jqXHR, textStatus, errorThrown ) {
            log('ERROR AJAX FUNC: Get Failed!!! ' + textStatus + '; ' + errorThrown);
            alert( 'Error obtaining Info' );
        }
    });

    log('getInfoFromURL() END');
};
