exports.testWithJQuery = function (content, testFunc) {
    var jsdom = require('jsdom');

    jsdom.env({
        html: content,
        done: function (err, window) {
            try {
                require('window-handle').setWindow(window);
                testFunc(window);
            } catch (e) {
                console.log(e);
            }
        }
    });
}
