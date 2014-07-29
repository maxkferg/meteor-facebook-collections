

FacebookCollections = new function() {
    
     this._get = function(path,callback){
        // Manually call the Facebook Graph with correct domain and access_token
        // Throw an error if the user is not authenticated, or doesn't have a facebook username
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
        if (path.indexOf(domain)==-1){
            path = domain + path.strip("/");
        }
        // Add accessToken to request
        if (path.indexOf("?")>-1){
            path = path + "&access_token="+user.services.facebook.accessToken;
        } else {
            path = path + "?access_token="+user.services.facebook.accessToken;
        }
        HTTP.get(path,callback);
    };
    
    
    
    this._getCollection = function(query,maxItems){
        // Return a Meteor.Collection object that will be filled with the results of @query
        // @query will be requested repetitively until there a @maxItems in the collection 
        // @query: A path on the facebook graph (/posts?fields=id,source)
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


    

    this.getPosts = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook posts
        // @username: The page to request post from, can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        fields = (fields || []).join(",");
        maxItems = maxItems || 500;
        var query = user+"/posts?fields="+fields+"&limit=50";
        return this._getCollection(query,maxItems);
    };



    this.getFriends = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook friends
        // @username: The user to list post from. Can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        fields = (fields || []).join(",");
        maxItems = maxItems || 500;
        var query = user+"/friends?fields="+fields+"&limit=50";
        return this._getCollection(query,maxItems);
    };



    this.getPhotos = function(user,fields,maxItems){
        // Return an empty collection that will be filled with Facebook photos
        // @username: The user to list post from. Can be 'me'
        // @fields: A list of fields to be requested
        // @maxItems: The maximum number of posts to be added to the collection
        fields = (fields || []).join(",");
        maxItems = maxItems || 500;
        var query = user+"/photos?fields="+fields+"&limit=50";
        return this._getCollection(query,maxItems);
    };
}


