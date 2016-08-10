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

    .factory( 'golfPickemService', [ 'googleSheetsService', GolfPickemService ] )

    function GolfPickemService( googleSheetsService ) {
        var golfPickemKey = '1WLKOV-YUvt-UMST362DyVX94pQJjaEX34EMZ8SfD4Mk';

        var sheets = {
            tourneys : 1,
            entrants : 2,
            picks : 3
        };

        return {
            getTourneys : function() {
                return googleSheetsService.getJsonAsPromise( golfPickemKey, sheets.tourneys );
            },
            getEntrants : function() {
                return googleSheetsService.getJsonAsPromise( golfPickemKey, sheets.entrants );
            },
            getPicks : function() {
                return googleSheetsService.getJsonAsPromise( golfPickemKey, sheets.picks );
            }
        };
    }
} )();

( function() {
    'use strict';

    angular.module( 'golf-pickem' )

    .factory( 'googleSheetsService', [ '$http', '$q', GoogleSheetsService ] )

    function GoogleSheetsService( $http, $q ) {
        return {
            getJsonAsPromise : function( key, sheet ) {
                if ( !key ) {
                    // TODO: error out here
                    console.log( 'ERROR: you have left `key` undefined when attempting to fetch data from Google Sheets' );
                }

                if ( !sheet ) {
                    sheet = 'default';
                }

                var deferred = $q.defer();

                $http.get( buildUrl( key, sheet ) ).then( function( response ) {
                    deferred.resolve( parseData( response.data ) );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            }
        };

        function buildUrl( key, sheet ) {
            return 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet + '/public/values?alt=json';
        }

        function parseData( data ) {
            var rs = [];
            for ( var i = 0; i < data.feed.entry.length; i++ ) {
                var row = data.feed.entry[i];

                var obj = {};
                if ( typeof row === 'object' ) {
                    for ( var prop in row ) {
                        if ( row.hasOwnProperty( prop ) && prop.startsWith( 'gsx$' ) ) {
                            var key = prop.replace( 'gsx$', '' );
                            obj[key] = row[prop].$t;
                        }
                    }
                }

                rs.push( obj );
            }
            return rs;
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
        };

        vm.displayTourney = function( tourney ) {
            if ( !vm.activeTourney || vm.activeTourney.tid != tourney.tid ) {
                vm.activeTourney = tourney;
            }

            curatePickDtos();
        }

        function getTourneys() {
            golfPickemService.getTourneys().then( function( tourneys ) {
                vm.tourneys = tourneys;
            }, function() {
            } );
        }

        function curatePickDtos() {
            golfPickemService.getEntrants().then( function( entrants ) {
                vm.entrants = entrants;

                golfPickemService.getPicks().then( function( picks ) {
                    vm.picks = [];

                    for ( var i = 0; i < picks.length; i++ ) {
                        var pick = picks[i];

                        if ( !vm.activeTourney || vm.activeTourney.tid != pick.tid ) {
                            continue;
                        }

                        var dto = {};

                        dto.name = getNameByEid( pick.eid );

                        dto.pick1 = pick.n1;
                        dto.pick2 = pick.n2;
                        dto.pick3 = pick.n3;
                        dto.pick4 = pick.n4;
                        dto.pick5 = pick.n5;

                        dto.winShares1 = pick.w1;
                        dto.winShares2 = pick.w2;
                        dto.winShares3 = pick.w3;
                        dto.winShares4 = pick.w4;
                        dto.winShares5 = pick.w5;

                        dto.points = pick.p;
                        dto.rank = pick.place;

                        dto.isPaid = pick.isPaid;

                        vm.picks.push( dto );
                    }
                }, function() {
                } );
            }, function() {
            } );
        }

        function getNameByEid( eid ) {
            for ( var i = 0; i < vm.entrants.length; i++ ) {
                var entrant = vm.entrants[i];
                if ( entrant.eid === eid ) {
                    return entrant.name;
                }
            }
            return 'unknown';
        }
    }
} )();

(function(){angular.module("golf-pickem.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/golf-pickem-dashboard/golf-pickem-dashboard.html","<div class=\"dashboard-wrapper\">\n    <div class=\"col-md-2 dashboard-sidebar-wrapper\">\n        <div class=\"dashboard-sidebar\">\n\n            <div class=\"dropdown\">\n                <button\n                    class=\"btn btn-default dropdown-toggle\"\n                    type=\"button\"\n                    id=\"tourneyMenu\"\n                    data-toggle=\"dropdown\"\n                    aria-haspopup=\"true\"\n                    aria-expanded=\"true\">\n                    Dropdown <span class=\"caret\"></span>\n                </button>\n                <ul\n                    class=\"dropdown-menu\"\n                    aria-labelledby=\"tourneyMenu\">\n                    <li ng-repeat=\"tourney in $ctrl.tourneys\"><a ng-click=\"$ctrl.displayTourney(tourney)\">{{tourney.name}}</a></li>\n                </ul>\n            </div>\n\n        </div>\n    </div>\n    <div class=\"col-md-10 pull-right dashboard-main-wrapper\">\n        <div class=\"dashboard-main\">\n\n            <div ng-hide=\"$ctrl.activeTourney\">please select a tournament from the left.</div>\n\n            <div\n                class=\"panel panel-default\"\n                ng-show=\"$ctrl.activeTourney\">\n                <div class=\"panel-heading\">picks</div>\n                <div class=\"panel-body\">\n                    <p>TODO: add a filter here</p>\n                </div>\n\n                <!-- Table -->\n                <table class=\"table table-hover\">\n                    <thead>\n                        <tr>\n                            <th>rank</th>\n                            <th>name</th>\n                            <th>pick 1</th>\n                            <th>pick 2</th>\n                            <th>pick 3</th>\n                            <th>pick 4</th>\n                            <th>pick 5</th>\n                            <th>win shares 1</th>\n                            <th>win shares 2</th>\n                            <th>win shares 3</th>\n                            <th>win shares 4</th>\n                            <th>win shares 5</th>\n                            <th>total points</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat=\"pick in $ctrl.picks\">\n                            <td>{{pick.rank}}</td>\n                            <td>{{pick.name}}</td>\n                            <td>{{pick.pick1}}</td>\n                            <td>{{pick.pick2}}</td>\n                            <td>{{pick.pick3}}</td>\n                            <td>{{pick.pick4}}</td>\n                            <td>{{pick.pick5}}</td>\n                            <td>{{pick.winShares1}}</td>\n                            <td>{{pick.winShares2}}</td>\n                            <td>{{pick.winShares3}}</td>\n                            <td>{{pick.winShares4}}</td>\n                            <td>{{pick.winShares5}}</td>\n                            <td>{{pick.points}}</td>\n                        </tr>\n                    </tbody>\n\n                </table>\n            </div>\n\n        </div>\n\n        <div class=\"footer\">hand rolled by nick.</div>\n    </div>\n</div>\n");}]);})();