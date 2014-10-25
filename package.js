Package.describe({
    name:"maxkferg:facebook-collections",
    summary: "Expose the facebook-graph as a set of meteor collections",
    version: "0.8.0",
    git: "https://github.com/maxkferg/meteor-facebook-collections.git"
});

Package.on_use(function(api) {
    api.use('http');
    api.use('accounts-facebook');
    api.add_files(['facebook-collections.js'], 'client');
    api.export(["FacebookCollections"],'client');
    api.versionsFrom('METEOR@0.9.0')
});