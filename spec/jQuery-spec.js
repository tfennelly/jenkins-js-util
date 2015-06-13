
/* jslint node: true */
/* global describe, it, expect */

"use strict";

var helper = require('./helper');

describe("jQuery/index-spec", function () {

    it("- test_toObject_attribs_defined", function (done) {
        helper.testWithJQuery('<div id="theEl" object1="object1Val" object2="object2Val"></div>', function () {
            var jqUtil = require('../jQuery');
            var theEl = jqUtil.getJQuery()('#theEl');

            var obj = jqUtil.toObject(theEl, ['object1', 'object2']);
            expect(obj.object1).toBe('object1Val');
            expect(obj.object2).toBe('object2Val');

            done();
        });
    });

    it("- test_toObject_attribs_not_defined", function (done) {
        helper.testWithJQuery('<div id="theEl" object1="object1Val" object2="object2Val"></div>', function () {
            var jqUtil = require('../jQuery');
            var theEl = jqUtil.getJQuery()('#theEl');

            try {
                jqUtil.toObject(theEl, ['x']);
            } catch(e) {
                expect(e).toBe("Required attribute 'x' not defined on element.");
            }

            done();
        });
    });

    it("- test_getElementBoxCoords", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var jqUtil = require('../jQuery');
            var boxCoords;

            boxCoords = jqUtil.getElementBoxCoords(newElement(0, 0, 10, 10));
            expect(boxCoords.topLeft.x).toBe(0);
            expect(boxCoords.topLeft.y).toBe(0);
            expect(boxCoords.topRight.x).toBe(10);
            expect(boxCoords.topRight.y).toBe(0);
            expect(boxCoords.bottomLeft.x).toBe(0);
            expect(boxCoords.bottomLeft.y).toBe(10);
            expect(boxCoords.bottomRight.x).toBe(10);
            expect(boxCoords.bottomRight.y).toBe(10);

            boxCoords = jqUtil.getElementBoxCoords(newElement(10, 10, 10, 10));
            expect(boxCoords.topLeft.x).toBe(10);
            expect(boxCoords.topLeft.y).toBe(10);
            expect(boxCoords.topRight.x).toBe(20);
            expect(boxCoords.topRight.y).toBe(10);
            expect(boxCoords.bottomLeft.x).toBe(10);
            expect(boxCoords.bottomLeft.y).toBe(20);
            expect(boxCoords.bottomRight.x).toBe(20);
            expect(boxCoords.bottomRight.y).toBe(20);

            // coordinates should get rounded appropriately so as to make the biggest
            // box possible.

            boxCoords = jqUtil.getElementBoxCoords(newElement(10.2, 10.2, 10, 10));
            expect(boxCoords.topLeft.x).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.topLeft.y).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.topRight.x).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.topRight.y).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.bottomLeft.x).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.bottomLeft.y).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.bottomRight.x).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.bottomRight.y).toBe(21); // 20.2 should get rounded up

            boxCoords = jqUtil.getElementBoxCoords(newElement(10, 10, 10.2, 10.2));
            expect(boxCoords.topLeft.x).toBe(10);
            expect(boxCoords.topLeft.y).toBe(10);
            expect(boxCoords.topRight.x).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.topRight.y).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.bottomLeft.x).toBe(10); // Should get rounded down from 10.2
            expect(boxCoords.bottomLeft.y).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.bottomRight.x).toBe(21); // 20.2 should get rounded up
            expect(boxCoords.bottomRight.y).toBe(21); // 20.2 should get rounded up

            done();
        });
    });

    it("- test_getElementsEnclosingBoxCoords", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var elements = [
                newElement(0, 0, 10, 10),
                newElement(50, 50, 10, 10)
            ];

            var jqUtil = require('../jQuery');
            var boxCoords = jqUtil.getElementsEnclosingBoxCoords(elements);
            expect(boxCoords.topLeft.x).toBe(0);
            expect(boxCoords.topLeft.y).toBe(0);
            expect(boxCoords.topRight.x).toBe(60);
            expect(boxCoords.topRight.y).toBe(0);
            expect(boxCoords.bottomLeft.x).toBe(0);
            expect(boxCoords.bottomLeft.y).toBe(60);
            expect(boxCoords.bottomRight.x).toBe(60);
            expect(boxCoords.bottomRight.y).toBe(60);

            done();
        });
    });

    it("- test_isCoordInBox", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var elements = [
                newElement(10, 10, 10, 10),
                newElement(50, 50, 10, 10)
            ];

            var jqUtil = require('../jQuery');
            var boxCoords = jqUtil.getElementsEnclosingBoxCoords(elements);

            // outside the box
            expect(jqUtil.isCoordInBox(0, 0, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(0, 30, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(30, 0, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(9, 30, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(30, 9, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(61, 30, boxCoords)).toBe(false);
            expect(jqUtil.isCoordInBox(30, 61, boxCoords)).toBe(false);

            // inside the box
            expect(jqUtil.isCoordInBox(10, 30, boxCoords)).toBe(true);
            expect(jqUtil.isCoordInBox(30, 10, boxCoords)).toBe(true);
            expect(jqUtil.isCoordInBox(60, 30, boxCoords)).toBe(true);
            expect(jqUtil.isCoordInBox(30, 60, boxCoords)).toBe(true);

            done();
        });
    });

    it("- test_stretchBoxCoords_left", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var jqUtil = require('../jQuery');
            var box = jqUtil.getElementBoxCoords(newElement(10, 10, 10, 10));

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            jqUtil.stretchBoxCoords(box, 'left', 5);

            expect(box.topLeft.x).toBe(5);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(5);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            done();
        });
    });

    it("- test_stretchBoxCoords_right", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var jqUtil = require('../jQuery');
            var box = jqUtil.getElementBoxCoords(newElement(10, 10, 10, 10));

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            jqUtil.stretchBoxCoords(box, 'right', 25);

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(25);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(25);
            expect(box.bottomRight.y).toBe(20);

            done();
        });
    });

    it("- test_stretchBoxCoords_up", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var jqUtil = require('../jQuery');
            var box = jqUtil.getElementBoxCoords(newElement(10, 10, 10, 10));

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            jqUtil.stretchBoxCoords(box, 'up', 5);

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(5);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(5);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            done();
        });
    });

    it("- test_stretchBoxCoords_down", function (done) {

        helper.testWithJQuery('<div></div>', function () {
            var jqUtil = require('../jQuery');
            var box = jqUtil.getElementBoxCoords(newElement(10, 10, 10, 10));

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(20);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(20);

            jqUtil.stretchBoxCoords(box, 'down', 25);

            expect(box.topLeft.x).toBe(10);
            expect(box.topLeft.y).toBe(10);
            expect(box.bottomLeft.x).toBe(10);
            expect(box.bottomLeft.y).toBe(25);
            expect(box.topRight.x).toBe(20);
            expect(box.topRight.y).toBe(10);
            expect(box.bottomRight.x).toBe(20);
            expect(box.bottomRight.y).toBe(25);

            done();
        });
    });

    function newElement (x, y, width, height) {
        return {
            offset: function() {
                return {
                    top: y,
                    left: x
                }
            },
            width: function() {
                return width;
            },
            height: function() {
                return height;
            }
        };
    }
});
