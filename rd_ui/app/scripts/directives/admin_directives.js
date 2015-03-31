(function () {
  'use strict';

  var directives = angular.module('redash.directives');

  directives.directive('dataSourceForm', ['$window', function ($window) {
    return {
      restrict: 'E',
      replace: true,
      template: 'test',
      scope: {
        'dataSource': '='
      },
      link: function ($scope) {
          console.log('test');
      }
    }
  }]);
})();
