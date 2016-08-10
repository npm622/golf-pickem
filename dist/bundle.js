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

    .factory( 'golfPickemService', [ '$http', '$q', GolfPickemService ] )

    function GolfPickemService( $http, $q ) {
        var golfPickemKey = '1WLKOV-YUvt-UMST362DyVX94pQJjaEX34EMZ8SfD4Mk';

        var sheets = {
            tourneys : 1,
            entrants : 2,
            picks : 3
        };

        return {
            getTourneys : function() {
                return getSheetsJsonPromise( sheets.tourneys );
            },
            getEntrants : function() {
                return getSheetsJsonPromise( sheets.entrants );
            },
            getPicks : function() {
                return getSheetsJsonPromise( sheets.picks );
            }
        };

        function getSheetsJsonPromise( sheet ) {
            var deferred = $q.defer();

            $http.get( buildJsonUrl( golfPickemKey, sheet ) ).then( function( response ) {
                deferred.resolve( parseData( response.data ) );
            }, function() {
                deferred.reject();
            } );

            return deferred.promise;
        }

        function buildJsonUrl( key ) {
            return buildJsonUrl( 'default' );
        }

        function buildJsonUrl( key, sheet ) {
            return 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet + '/public/values?alt=json';
        }

        function parseData( data ) {
            var pickemData = [];

            for ( var i = 0; i < data.feed.entry.length; i++ ) {
                var row = data.feed.entry[i];

                var datum = {};
                if ( typeof row === 'object' ) {
                    for ( var prop in row ) {
                        if ( row.hasOwnProperty( prop ) && prop.startsWith( 'gsx$' ) ) {
                            var key = prop.replace( 'gsx$', '' );
                            datum[key] = row[prop].$t;
                        }
                    }
                }
                pickemData.push( datum );
            }

            return pickemData;
        }
    }
} )();

( function() {
    'use strict';

    angular.module( 'golf-pickem' )

    .component( 'golfPickemDashboard', {
        templateUrl : 'components/golf-pickem-dashboard/golf-pickem-dashboard.html',
        controller : [ 'golfPickemService', GolfPickemDashboardCtrl ]
    } );

    function GolfPickemDashboardCtrl( golfPickemService ) {
        var vm = this;

        vm.$onInit = function() {
            getTourneys();
            getEntrants();
            getPicks();
        };

        function getTourneys() {
            golfPickemService.getTourneys().then( function( tourneys ) {
                vm.tourneys = tourneys;
            }, function() {
            } );
        }

        function getEntrants() {
            golfPickemService.getEntrants().then( function( entrants ) {
                vm.entrants = entrants;
            }, function() {
            } );
        }

        function getPicks() {
            golfPickemService.getPicks().then( function( picks ) {
                vm.picks = picks;
            }, function() {
            } );
        }
    }
} )();

(function(){angular.module("golf-pickem.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/golf-pickem-dashboard/golf-pickem-dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">sidebar</div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <pre ng-show=\"$ctrl.tourneys\">{{$ctrl.tourneys | json}}</pre>\n\n            <hr />\n\n            <pre ng-show=\"$ctrl.entrants\">{{$ctrl.entrants | json}}</pre>\n\n            <hr />\n\n            <pre ng-show=\"$ctrl.picks\">{{$ctrl.picks | json}}</pre>\n\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");}]);})();