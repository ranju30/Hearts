var onPageReady = function () {
    $.getJSON("gameOver", function (data) {
        if (data.winner) {
            $(".result").html(data.winner);
        }
    });
};

$(document).ready(onPageReady);
