( function() {
    'use strict';

    angular.module( 'golf-pickem', [ 'golf-pickem.templates' ] )

    .provider( 'golfPickem', function() {
        var vm = this;

        vm.state = 'golfPickem';
        vm.setState = function( state ) {
            vm.state = state;
        }

        vm.url = '#/golf-pickem';
        vm.setUrl = function( url ) {
            vm.url = url;
        }

        vm.display = 'golf pickem';
        vm.setDisplay = function( display ) {
            vm.display = display;
        }

        vm.page = {
            state : vm.state,
            url : vm.url,
            template : '<golf-pickem-dashboard></golf-pickem-dashboard>',
            display : vm.display
        }

        vm.$get = function() {
            return vm;
        };
    } );
}() );

( function() {
    'use strict';

    angular.module( 'golf-pickem' )

    .component( 'golfPickemDashboard', {
        templateUrl : 'components/golf-pickem-dashboard/golf-pickem-dashboard.html',
        controller : [ 'Pickem', GolfPickemDashboardCtrl ]
    } );

    function GolfPickemDashboardCtrl( Pickem ) {
        var vm = this;

        Pickem.fetchEntriesByTourneyId( 'ms16' ).then( function( entries ) {
            console.log( entries );
        }, function() {
        } );
    }
} )();

(function(){angular.module("golf-pickem.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/golf-pickem-dashboard/golf-pickem-dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            sidebar\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            main\n            \n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");}]);})();