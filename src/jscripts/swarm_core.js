(function (win) {
    var swarm = {};

    //Create namespace according to the parameter ns (XXX.XXX.XXX). 
    swarm.provide = function (ns) {
        if (ns && typeof ns === 'string') {
            var nsArray = ns.split('.');
            var currentNameSpace = win;
            nsArray.forEach(function (n) {
                if (currentNameSpace[n] == undefined) {
                    currentNameSpace[n] = {};
                }
                currentNameSpace = currentNameSpace[n];
            });
        }
    }

    win.swarm = swarm;
})(window);