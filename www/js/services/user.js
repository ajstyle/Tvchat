var app = angular.module('tvchat.services.userService', []);


app.service('UserService', function ($q, $rootScope, $localstorage, $ionicPopup, ngFB, $firebaseAuth, $ionicPush , $ionicUser) {

   

  

	var self = {
		/* This contains the currently logged in user */
		current: {},

		/*
		 Makes sure the favorites property is preset on the current user.

		 firebase REMOVES any empty properties on a save. So we can't
		 bootstrap the user object with favorites: {}.
		 */
		ensureFavorite: function () {
			if (!self.current.favorites) {
				self.current.favorites = {};
			}
		},

		/*
		 If adds or removes a show from the users favorites list
		 */
		toggleFavorite: function (show) {
			// Toggles the favorite setting for a show for the current user.
			self.ensureFavorite();
			if (self.current.favorites[show.showid]) {
				self.removeFavorite(show)
			} else {
				self.addFavorite(show)
			}
			self.current.$save();
		},
		/*
		 Adds a show to the users favorites shows list
		 */
		addFavorite: function 	
(show) {
			self.ensureFavorite();
			self.current.favorites[show.showid] = show;
		},
		/*
		 Removes a show from the users favorites shows list
		 */
		removeFavorite: function (show) {
			self.ensureFavorite();
			self.current.favorites[show.showid] = null;
		},
		/*
		 Logout the user
		 */
		logoutUser: function () {
			var auth = $firebaseAuth();
			return auth.$signOut();
		},
		/*
		 Login the user
		 */
		/*
		 Login the user
		 */
		loginUser: function () {
			var d = $q.defer();

			//
			// Initiate the facebook login process
			//
			console.log('Calling facebook login');
			ngFB.login({scope: 'email'}).then(
				function (response) {
					if (response.status === 'connected') {
						console.log('Facebook login succeeded');
						var token = response.authResponse.accessToken;
					
						   
                         ngFB.api({
                            path: '/me',
                            params: {}
                        }).then(
                            function (user) {
                                var user = user;
                                
                            },
                            function (error) {
                                alert('Facebook error: ' + error.error_description);
                            });

						//
						// We are logged in so now authenticate via firebase
						//

						
						console.log('Authenticating with firebase');
						var auth = $firebaseAuth();
						console.log(auth);
						var credential = firebase.auth.FacebookAuthProvider.credential(token);

						console.log( credential);
						auth.$signInWithCredential(credential)
							.then(function (firebaseUser) {
								//
								// All good, resolve the promise and lets rock!
								//
								console.log("Signed in as:", firebaseUser.uid);
								console.log(firebaseUser);
								self.current = firebaseUser ; 
								self.identifyUser();
								d.resolve();

							})
							.catch(function (error) {
								console.error(error.message);
								console.error(error.code);
								
								$ionicPopup.alert({
									title: "Facebook Error",
									template: 'Failed to login with facebook'
								});
								d.reject(error);
							});
							

					} else {
						//
						// There was an error authenticating with facebook
						// Show the user an error message
						//
						alert('Facebook login failed');
						$ionicPopup.alert({
							title: "Facebook Error",
							template: 'Failed to login with facebook'
						});
						d.reject(error);
					}
				});

			return d.promise;
			
		},
		identifyUser: function(){
                var user = $ionicUser.get();
	       if(!user.user_id) {
		// Set your user_id here, or generate a random one.
		  user.user_id = $ionicUser.generateGUID();
	   };
 
	// Metadata
	angular.extend(user, {
		name: 'Amit',
		bio: 'Author of Devdactic'
	});
 
	// Identify your user with the Ionic User Service
	$ionicUser.identify(user).then(function(){
		$scope.identified = true;
		console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
	});
          


		}
	};
        
	return self;
})
;
