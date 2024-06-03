// ajax-script.js or views.js

jQuery(document).ready(function($) {
    var userIdentifier = getCookie('user_identifier');

    setTimeout(function() {
        $.ajax({
            type: 'POST',
            url: ajax_object.ajax_url,
            data: {
                action: 'update_view_counts',
                user_identifier: userIdentifier,
            },
            success: function(response) {
                console.log('View count updated successfully.');
            },
            error: function(error) {
                console.error('Error updating view count.');
                console.log(error);
            }
        });
    }, 2500);
});

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}
