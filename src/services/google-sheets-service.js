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
                            var value = row[prop].$t;

                            if ( value.includes( '/' ) ) { // assuming date: M/d/yyyy
                                var dateParts = value.split( '/' );
                                value = new Date( parseInt( dateParts[2], dateParts[1] - 1, dateParts[0] ) );
                            } else if ( !isNan( Number( value ) ) ) {
                                if ( value.includes( '.' ) ) {
                                    value = parseFloat( value );
                                } else {
                                    value = parseInt( value );
                                }
                            }

                            // TODO: add parsing logic to make numbers numbers, dates dates, etc.
                            obj[key] = value;
                        }
                    }
                }

                rs.push( obj );
            }
            return rs;
        }
    }
} )();
