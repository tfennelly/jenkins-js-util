var lastKnownXY = {
    x: undefined,
    y: undefined
};

exports.get = function() {
    if (lastKnownXY.x === undefined) {

        require('./jQuery').getJQuery()('body').mousemove(function(event) {
            lastKnownXY.x = event.pageX;
            lastKnownXY.y = event.pageY;
        });
    }
    return lastKnownXY;
};