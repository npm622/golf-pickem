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

    .factory( 'Pickem', [ '$http', '$q', Pickem ] )

    function Pickem( $http, $q ) {
        var pickemDataUrl = 'https://spreadsheets.google.com/feeds/list/1WLKOV-YUvt-UMST362DyVX94pQJjaEX34EMZ8SfD4Mk/default/public/values?alt=json';

        function parsePickemData( data ) {
            var pickemData = [];

            for ( var i = 0; i < data.feed.entry.length; i++ ) {
                var row = data.feed.entry[i];

                var datum = {};
                if ( typeof row === 'object' ) {
                    for ( var prop in row ) {
                        if ( row.hasOwnProperty( prop ) && prop.startsWith( 'gsx$' ) ) {
                            var key = prop.replace( 'gsx$', '' );
                            datum[key] = row[prop];
                        }
                    }
                }
                pickemData.push( datum );
            }

            return pickemData;
        }

        return {
            fetchEntriesByTourneyId : function( tid ) {
                var deferred = $q.defer();

                $http.get( pickemDataUrl ).then( function( response ) {
                    deferred.resolve( parsePickemData( response.data ) );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            }
        };
    }
} )();

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