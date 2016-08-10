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
            test();
        };

        function test() {
            var string = 'string';
            var int = '3';
            var decimal = '2,900,321.23';
            var date = '5/12/99';

            console.log( int.test( '/\d/' ) )
        }

        vm.tourneyMenuDisplay = function() {
            if ( vm.activeTourney ) {
                return vm.activeTourney.name;
            } else {
                return "none selected";
            }
        }

        vm.displayTourney = function( tourney ) {
            if ( !vm.activeTourney || vm.activeTourney.tid != tourney.tid ) {
                vm.activeTourney = tourney;
            }

            setupSortAndSearch();
            curatePickDtos();
        }

        vm.search = function() {
            vm.filter.$ = vm.searchInput;
        }

        vm.sortBy = function( col ) {
            if ( vm.sortExpression === col ) {
                vm.sortDirection = !vm.sortDirection;
            } else {
                vm.sortExpression = col;
                vm.sortDirection = false;
            }
        }

        function setupSortAndSearch() {
            vm.filter = {};
            vm.sortExpression = 'name';
            vm.sortDirection = false;
        }

        function getTourneys() {
            golfPickemService.getTourneys().then( function( tourneys ) {
                vm.tourneys = tourneys;

                determineActiveTourney();
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

        function getTourneyByTid( tid ) {
            for ( var i = 0; i < vm.tourneys.length; i++ ) {
                var tourney = vm.tourneys[i];
                if ( tourney.tid === tid ) {
                    return tourney;
                }
            }
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
