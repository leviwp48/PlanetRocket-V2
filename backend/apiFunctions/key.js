var Key = require('../models/key');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var rand = require('random-key');

exports.issue_key = function(req, res){
    var postUsername = req.body.username;
    var postPassword = req.body.password;

    //see if the username matches with a stored user
    User.findOne({username:postUsername}, function(err, result){
        if(err){
            console.log(err);
            var jsonResponse = {loginSuccess: false, yourKey: null };
            res.send(jsonResponse);
        }
        else{
            //once the user is found, compare passwords
            bcrypt.compare(postPassword, result.password, function(err, goodHash){
                //if the passwords match, first search to see if they have any other existing api keys
                if(goodHash){
                    console.log('passwords match');
                    Key.findOne({ownedBy: result._id}, function(err, existingKey){

                        if(err){
                            console.log(err);
                        }

                        //if there are no api keys currently assigned to the user, then create and issue a new one
                        else if(existingKey == null){

                            apiKey = rand.generate(32);
                            //hash the apiKey and store it in mongo (or should we store the apikey and respond with the hash?)
                            bcrypt.hash(apiKey, 10, function(err, apiHash){
                                if(err){
                                    console.log(err);
        
                                }
                                else{
                                    //create the mongo key document with the key value and a reference to the user that will be using the apiKey hash
                                    Key.create({keyID: apiKey, ownedBy: result._id}, function(err, key){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            //send the user the hashed apiKey
                                            var jsonResponse = {loginSuccess: true, yourKey: apiHash};
                                            res.send(jsonResponse);
                                            
                                        }
                                    });
                                    
                                }
                            });
                        
                        }
                        
                        //if there is already an apiKey, update it its expiration time and return it
                        else{
                            
                            existingKey.createdAt = Date.now;
                            existingKey.save(function(err){
                                if(err){
                                    console.log(err);
                                }
                            });

                            //hash the key and send the hash to the user
                            bcrypt.hash(existingKey.keyID, 10, function(err, apiHash){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    var jsonResponse = {loginSuccess: true, yourKey: apiHash}; 
                                    res.send(jsonResponse);
                                }
                            });
                        

                        }

                    });


                
                    
                   
                }
                //otherwise, return an error
                else{
                    console.log('passwords do not match');
                }
            })
        }
    })
    
}