angular.module('redash', [
    'redash.directives',
    'redash.admin_controllers',
    'redash.controllers',
    'redash.filters',
    'redash.services',
    'redash.renderers',
    'redash.visualization',
    'highchart',
    'ui.select2',
    'angular-growl',
    'angularMoment',
    'ui.bootstrap',
    'smartTable.table',
    'ngResource',
    'ngRoute',
    'ui.select'
  ]).config(['$routeProvider', '$locationProvider', '$compileProvider', 'growlProvider',
    function ($routeProvider, $locationProvider, $compileProvider, growlProvider) {
      if (featureFlags.clientSideMetrics) {
        Bucky.setOptions({
          host: '/api/metrics'
        });

        Bucky.requests.monitor('ajax_requsts');
        Bucky.requests.transforms.enable('dashboards', /dashboard\/[\w-]+/ig, '/dashboard');
      }

      function getQuery(Query, $route) {
        var query = Query.get({'id': $route.current.params.queryId });
        return query.$promise;
      };

      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|data):/);
      $locationProvider.html5Mode(true);
      growlProvider.globalTimeToLive(2000);

      $routeProvider.when('/dashboard/:dashboardSlug', {
        templateUrl: '/views/dashboard.html',
        controller: 'DashboardCtrl',
        reloadOnSearch: false
      });
      $routeProvider.when('/queries', {
        templateUrl: '/views/queries.html',
        controller: 'QueriesCtrl',
        reloadOnSearch: false
      });
      $routeProvider.when('/queries/new', {
        templateUrl: '/views/query.html',
        controller: 'QuerySourceCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', function newQuery(Query) {
            return Query.newQuery();
          }]
        }
      });
      $routeProvider.when('/queries/search', {
        templateUrl: '/views/queries_search_results.html',
        controller: 'QuerySearchCtrl',
        reloadOnSearch: true,
      });
      $routeProvider.when('/queries/:queryId', {
        templateUrl: '/views/query.html',
        controller: 'QueryViewCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', '$route', getQuery]
        }
      });
      $routeProvider.when('/queries/:queryId/source', {
        templateUrl: '/views/query.html',
        controller: 'QuerySourceCtrl',
        reloadOnSearch: false,
        resolve: {
          'query': ['Query', '$route', getQuery]
        }
      });
      $routeProvider.when('/admin/status', {
        templateUrl: '/views/admin_status.html',
        controller: 'AdminStatusCtrl'
      });
      $routeProvider.when('/admin/data_sources', {
        templateUrl: '/views/admin_data_sources.html',
        controller: 'AdminDataSourcesCtrl'
      });

      $routeProvider.when('/', {
        templateUrl: '/views/index.html',
        controller: 'IndexCtrl'
      });
      $routeProvider.when('/personal', {
        templateUrl: '/views/personal.html',
        controller: 'PersonalIndexCtrl'
      });
      $routeProvider.otherwise({
        redirectTo: '/'
      });


    }
  ]);
