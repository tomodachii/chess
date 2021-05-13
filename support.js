// function parseLocation(location) {
//     var a = [];
//     a[0] = Number(location.charAt(0));
//     a[1] = Number(location.charAt(1));
//     return a;
// }

// function getName(obj) {
//     return obj.side + obj.type;
// }

// function toLocation(x, y) {
//     return x + "" + y;
// }

// function isEmptyObj(obj) {
//     return (Object.keys(obj).length === 0 && obj.constructor === Object);
// }

// function checkClassExist(location, className) {
//     var element = document.getElementById(location);
//     return element.classList.contains(className);
// }

const Support = {
    getName: function(obj) {
        return obj.side + obj.type;
    },
    toLocation: function(x, y) {
        return x + "" + y;
    },
    isEmptyObj: function(obj) {
        return (Object.keys(obj).length === 0 && obj.constructor === Object);
    },
    checkClassExist: function (location, className) {
        var element = document.getElementById(location);
        return element.classList.contains(className);
    },
}