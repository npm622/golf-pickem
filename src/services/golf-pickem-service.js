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
