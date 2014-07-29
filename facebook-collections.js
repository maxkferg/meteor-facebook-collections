

FacebookCollections = new function() {
    
    this._get = function(query,callback){
        // Manually call the Facebook Graph with correct domain and access_token
        // Throw an error if the user is not authenticated, or doesn't have a facebook username
        // @query: A path on the facebook graph "/posts?fields=id,source"
        // @callback: A function to be called like callback(error,response)
        var domain = "https://graph.facebook.com/";
        var user = Meteor.user();
        if (!user){
            throw "User is not logged in";
        } else if (!user.services.facebook){
            throw "User does not have a Facebook account";
        } else if (!user.services.facebook.accessToken){
            throw "User does not have an accessToken";    
        }
        // Add the domain to the request 
        if (query.indexOf(domain)==-1){
            query = domain + query.strip("/");
        }
        // Add accessToken to request
        if (query.indexOf("?")>-1){
            query = query + "&access_token="+user.services.facebook.accessToken;
        } else {
            query = query + "?access_token="+user.services.facebook.accessToken;
        }
        HTTP.get(query,callback);
    };
    
    
    
    this._getCollection = function(query,maxItems){
        // Return a Meteor.Collection object that will be filled with the results of @query
        // Request @query repetitively until there a @maxItems in the collection 
        // @query: A path on the facebook graph like "/posts?fields=id,source"
        var collection = new Meteor.Collection(null);
        var retries = 0;
        var count = 0;
        var self = this;
        
        function handleResponse(error,response){
            if (response && !error){
                var items = response.data.data;
                var paging = response.data.paging;
                _.each(items, function(doc){
                   collection.insert(doc); 
                });
                count += items.length;
                if (count<maxItems && paging && paging.next){
                    retries = 0;
                    self._get(paging.next,handleResponse);
                }
            } else if (retries<3) {
                retries+=1;
                console.log("FB: ",error);
                self._get(query,handleResponse);
            } else {
                console.log("FB: Max tries exceeded");
            }
        }
        
        // Start the recursive process
        self._get(query,handleResponse);
                
        //Return the (empty) posts collection
        return collection;
    };

    
    
    this.getCollection = function(path,fields,maxItems){
        // Wrapper for this._getCollection that handles default values
        // @path: A path on the facebook graph like "/me/posts/"
        // @fields(optional): A list of fields to be requested
        // @maxItems(optional): The maximum number of posts to be added to the collection
        if (_.isNumber(fields)){
            maxItems = fields;
            fields = [];
        } else { 
            maxItems = maxItems || 500;
            fields = fields || [];
        }
        var limit = Math.max(Math.ceil(maxItems/5),25);
        var query = path + "?fields="+fields.join(",") + "&limit="+limit;
        return this._getCollection(query,maxItems);
    }
    

    this.getPosts = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook posts
        // @username: The page to request post from, can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        return this.getCollection(user+"/posts",fields,maxItems);
    };



    this.getFriends = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook friends
        // @username: The user to list post from. Can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        return this.getCollection(user+"/friends",fields,maxItems);
    };



    this.getPhotos = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook photos
        // @username: The user to list post from. Can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        return this.getCollection(user+"/photos",fields,maxItems);
    };
}



