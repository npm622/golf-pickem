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
            vm.pickCount = 5;

            getTourneys();
            curatePickDtos();
        };

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
                        var dto = {};
                        var pick = picks[i];

                        dto.name = getNameByEid( pick.eid );

                        for ( var n = 1; n <= vm.pickCount; n++ ) {
                            dto['pick' + n] = pick['n' + n];
                        }

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
                    return entrant;
                }
            }
            return 'unknown';
        }
    }
} )();
