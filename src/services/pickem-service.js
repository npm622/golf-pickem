( function() {
    'use strict';

    angular.module( 'golf-pickem' )

    .factory( 'Pickem', [ '$http', '$q', Pickem ] )

    function Pickem( $http, $q ) {
        var pickemDataUrl = 'https://spreadsheets.google.com/feeds/list/1WLKOV-YUvt-UMST362DyVX94pQJjaEX34EMZ8SfD4Mk/default/public/values?alt=json';

        function parsePickemData( data ) {
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

        return {
            fetchEntriesByTourneyId : function( tid ) {
                var deferred = $q.defer();

                $http.get( pickemDataUrl ).then( function( response ) {
                    deferred.resolve( parsePickemData( response.data ) );
                }, function() {
                    deferred.reject();
                } );

                return deferred.promise;
            }
        };
    }
} )();
