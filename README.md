FacebookCollections
====================

Expose the facebook-graph on the client as a set of Meteor collections


Installation
------------------
FacebookCollections can be installed with Meteorite. From inside a Meteorite-managed app:
```shell
$ meteor add maxkferg:facebook-collections
```



Usage
---------------
The FacebookCollections object will be exposed on the client.
The current user must be associated with a facebook account to use facebook-collections.
Once the user has logged in via the meteor accounts-facebook package, the package can be used.


###.getPosts(user,fields,maxItems)

Return an empty collection that will be filled with Facebook posts<br/>
@user: The page to request post from, can be 'me'<br/>
@fields: A list of fields to be requested<br/>
@maxItems: The maximum number of posts to be added to the collection<br/>
    
```javascript
var MyPosts = FacebookCollections.getPosts("me",["type","picture"],300); // --> Meteor.Collection
var KatysPosts = FacebookCollections.getPosts("katyperry",100); // --> Return all fields
var ObamasPosts = FacebookCollections.getPosts("barackobama"); // --> Defaults to 500 posts 
```

Initially, the collection will be empty. The Deps package can be used to run a function
each time results are added to the collection:

```javascript
// Fetch posts as they are loaded from Facebook
Deps.autorun(function(){
    var posts = KatysPosts.find().fetch();
    console.log(posts);
}

// Alternatively use .observe to catch posts as they are added
MyPosts.observe({
"added":function(){
    var photos = MyPosts.findOne({type:"photo"});
    console.log(photos);
}
});
```


###.getPhotos(user,fields,maxItems)

Return an empty collection that will be filled with Facebook photos<br/>
@user: The page to request post from, can be 'me'<br/>
@fields: A list of fields to be requested<br/>
@maxItems: The maximum number of photos to be added to the collection<br/>
    
```javascript
var Photos = FacebookCollections.getPhotos("me",100); // --> Meteor.Collection()
```


###.getFriends(user,fields,maxItems)

Return an empty collection that will be filled with Facebook friends<br/>
@user: The page to request post from, can be 'me'<br/>
@fields: A list of fields to be requested<br/>
@maxItems: The maximum number of friends to be added to the collection<br/>

```javascript
var Friends = FacebookCollections.getFriends("me",["id","name"],100); // --> Meteor.Collection
```


###.getCollection(path,fields,maxItems)

Return an empty collection that will be filled with Facebook friends<br/>
Generic version of the previous functions. Experimental.<br/>
@path: A path on the Facebook graph "/me/albums/" or "/katy/photos/<br/>
@fields: A list of fields to be requested<br/>
@maxItems: The maximum number of friends to be added to the collection<br/>

```javascript
var Albums = FacebookCollections.getFriends("/me/albums/",["id","name"],100);
```


Reactivity
----------
The collections returned are just instances of Meteor.Collection(null) so they are inherently reactive.
This makes the collections ideal as a reactive data source.

```javascript
// Create the collection when the page is loaded
var Posts = FacebookCollections.getPosts("me",100);

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


