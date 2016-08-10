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
