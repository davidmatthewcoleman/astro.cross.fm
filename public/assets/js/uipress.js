jQuery(document).ready(function(){
    var blockEditorLoaded = false;
    var blockEditorInterval = setInterval(function(){
        jQuery('iframe.uip-page-content-frame').on('load', function() {
            setTimeout(function() {
                jQuery('iframe.uip-page-content-frame').contents().find('.edit-post-fullscreen-mode-close').attr('target', '_top');
            }, 100);
            blockEditorLoaded = true;
            clearInterval(blockEditorInterval);
        });
    }, 100);
});