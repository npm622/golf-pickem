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
