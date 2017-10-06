module.export = function(API_BASE_URL, $resource) {
  return $resource(API_BASE_URL + '/backoffice/invitation/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
}
