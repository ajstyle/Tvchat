var mod = angular.module('tvchat.controllers.show', []);



mod.controller('ShowCtrl', function ($scope,$stateParams,
                                     $firebaseArray,$ionicScrollDelegate,
                                     UserService,ShowsService) {

	$scope.user = UserService;
    $scope.showId = $stateParams.showId ; 
    $scope.show  = ShowsService.getShow(parseInt($scope.showId)) ; 

	
	console.log($scope.show) ; 

	$scope.data = {
		messages: [],
		message: '',
		loading: true,
		showInfo: false
	};

	var messagesRef = firebase.database().ref();

	$scope.loadMessages = function () {

		var query = messagesRef.child("messages")
		                      .orderByChild("showId")
		                      .equalTo($scope.showId)
                              .limitToLast(200) ; 

       	$scope.data.messages = $firebaseArray(query) ; 
       	console.log($scope.data.messages) ; 
         
        $scope.data.messages.$loaded().then(function(data){
        	console.log("Angularfire loaded") ; 
        	$scope.data.loading = false ;   
        	 $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
        });
	};

	$scope.sendMessage = function () {
		console.log("send Message");
	
		if($scope.data.message){
      
          $scope.data.messages.$add({
              showId : $scope.showId, 
              text : $scope.data.message , 
              username : $scope.user.current.displayName, 
              userId : $scope.user.current.m ,
              profilePic : $scope.user.current.photoURL ,
              timestamp : new Date().getTime()
          }) ; 
          
          $scope.data.message = '' ;
          $ionicScrollDelegate.$getByHandle('show-page').scrollBottom(true);
		}
	};

	console.log("ShowCtrl-Created");

	$scope.$on("$ionicView.enter", function () {
		console.log("ShowCtrl-Enter");
		
	});

	$scope.$on("$ionicView.beforeLeave", function () {
		console.log("ShowCtrl-Leave");
	});
$scope.loadMessages() ; 
});