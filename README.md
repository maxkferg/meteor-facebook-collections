facebook-collections
====================

Expose the facebook-graph on the client as a set of meteor collections

How to Install
------------------

mrt add facebook-collections



Usage
---------------

The FacebookCollections object will be exposed on the client.
The active user must be associate with a facebook account to use facebook-collections
Once the user has logged in via the meteor accounts-facebook package, the package can be used.

###.getPosts(user,fields,maxItems)


Return an empty collection that will be filled with Facebook posts
@username: The page to request post from, can be 'me'
@fields: A list of fields to be requested
@maxItems: The maximum number of posts to be added to the collection
    
```javascript
    var MyPosts = FacebookCollections.getPosts("me",[],100); // --> Return Meteor.Collection()
    var KatysPosts = FacebookCollections.getPosts("katyperry",["id","source","name"],500);
    
    // Fetch posts as they are loaded from Facebook
    Deps.autorun(function(){
        var posts = KatysPosts.find().fetch();
        console.log(posts);
    }
    
    // Alternatively use .observe to catch posts as they are added
    MyPosts.observe({
        "added":function(){
            var post = MyPosts.findOne({name:"My cool post"});
            console.log(post);
        }
    });
```

###.getPhotos(user,fields,maxItems)


Return an empty collection that will be filled with Facebook photos
@username: The page to request post from, can be 'me'
@fields: A list of fields to be requested
@maxItems: The maximum number of photos to be added to the collection
    
```javascript
    var Photos = FacebookCollections.getPhotos("me",[],100); // --> Meteor.Collection()
```

###.getFriends(user,fields,maxItems)


Return an empty collection that will be filled with Facebook friends
@username: The page to request post from, can be 'me'
@fields: A list of fields to be requested
@maxItems: The maximum number of friends to be added to the collection

```javascript
    var Friends = FacebookCollections.getFriends("me",["id","name"],100); // --> Meteor.Collection()
```


Reactivity
----------
All of the collections returned are reactive (They are just instances of Meteor.Collection(null));
The collections will initially be empty, but items are added to them as they are loaded.
This makes the collections ideal as a reactive data source.

```javascript
    // Create the collection when the page is loaded
    var Posts = FacebookCollections.getPosts("me",[],100);

    Template.main.posts = function(){
        return Posts.find();
    }
```

Contributers
------------
Max Ferguson


License
-------

MIT 


