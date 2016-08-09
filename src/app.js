( function() {
    'use strict';

    angular.module( 'golf-pickem', [ 'golf-pickem.templates' ] )

    .provider( 'golfPickem', function() {
        var vm = this;

        vm.state = 'golfPickem';
        vm.setState = function( state ) {
            vm.state = state;
        }

        vm.url = '#/golf-pickem';
        vm.setUrl = function( url ) {
            vm.url = url;
        }

        vm.display = 'golf pickem';
        vm.setDisplay = function( display ) {
            vm.display = display;
        }

        vm.page = {
            state : vm.state,
            url : vm.url,
            template : '<golf-pickem-dashboard></golf-pickem-dashboard>',
            display : vm.display
        }

        vm.$get = function() {
            return vm;
        };
    } );
}() );
