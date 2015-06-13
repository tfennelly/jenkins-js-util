/*
 * Copyright (C) 2014 CloudBees Inc.
 *
 * All rights reserved.
 */

var url = require('./url');
var json = require('./json');
var jQuery = require('./jQuery');

exports.invoker = function ($) {
    if ($) {
        return new Invoker($);
    } else {
        return new Invoker(jQuery.getJQuery());
    }
};

exports.jenkinsAjaxGET = function (path, success) {
    new Ajax.Request(path, {
        method : 'get',
        onSuccess: success
    });
};

exports.jenkinsAjaxPOST = function (path, success) {
    new Ajax.Request(path, {
        method : 'post',
        onSuccess: success
    });
};

function Invoker($) {
    this.$ = $;
}

Invoker.prototype.asyncGET = function (resPathTokens, success, params) {
    this.$.ajax({
        url: url.concatPathTokens(resPathTokens),
        type: 'get',
        dataType: 'json',
        data: params,
        success: success
    });
};

Invoker.prototype.syncPUT = function (resPathTokens, data, success, params) {
    var ajaxUrl = url.concatPathTokens(resPathTokens);
    if (params) {
        ajaxUrl += ('?' + url.toQueryString(params));
    }

    if (typeof data === 'object' || this.$.isArray(data)) {
        data = json.myStringify(data);
    }

    this.$.ajax({
        url: ajaxUrl,
        type: 'put',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        data: data,
        success: success
    });
};