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
