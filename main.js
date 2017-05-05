$(document).ready(function() {
    var mainSelector = ".main";
    $(mainSelector).hide().fadeIn(1000);

    App.generateHtmlGrid(mainSelector);
    App.generateInputControls(mainSelector);
});
