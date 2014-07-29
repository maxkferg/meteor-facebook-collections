Package.describe({
    summary: "Expose the facebook-graph as a set of meteor collections"
});

Package.on_use(function(api) {
    api.use(['accounts-facebook','http']);
    api.add_files(['facebook-collections.js'], 'client');
    api.export(["FacebookCollections"],'client');
});
