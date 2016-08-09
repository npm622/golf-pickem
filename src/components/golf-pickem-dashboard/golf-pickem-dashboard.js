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
            vm.entries = entries;
        }, function() {
        } );
    }
} )();
