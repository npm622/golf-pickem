( function() {
    'use strict';

    angular.module( 'golf-pickem' )

    .component( 'golfPickemDashboard', {
        templateUrl : 'components/golf-pickem-dashboard/golf-pickem-dashboard.html',
        controller : [ GolfPickemDashboardCtrl ]
    } );

    function GolfPickemDashboardCtrl() {
        var vm = this;
    }
} )();
