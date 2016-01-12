angular.module('starter')

.controller('DashCtrl', function($scope,$cordovaImagePicker,$cordovaCamera) {
  var options = {
   maximumImagesCount: 1,
   width: 800,
   height: 800,
   quality: 80
  };
  $scope.getpicture = function(){
    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          alert('Image URI: ' + results[i]);
        }
      }, function(error) {
        // error getting photos
    });
  }
  $scope.getcamera = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        alert(imageData);
    }, function(err) {
      // error
    });
  }
})
.controller('SearchTextCtrl', function($scope,$state,$ionicPopup){
  $scope.data = {};
  $scope.search = function(data){
      var ans = "";
      var text = data.keyword;
      if(typeof data.keyword=="undefined"){
        var alertPopup = $ionicPopup.alert({
               title : 'Warning',
               template : 'You must fill the keywords'
           });
        return;
      } else {
          ans+=text;
      }
      var site = data.site;
      if(typeof data.site=="undefined"){
        var alertPopup = $ionicPopup.alert({
               title : 'Warning',
               template : 'You must fill the site you want to search.'
           });
        return;
      } else {
          ans+=" "+site;
      }
      var location = "";
      if(typeof data.location!="undefined"){
          location = data.location;
          ans+=" "+location;
      }
      $state.go('app.search_result_text/:q',{q: ans});
  }
})
.controller('SearchResultTextCtrl', function($scope,$cordovaInAppBrowser,$state,$stateParams,$ionicPopup,$ionicLoading,$http){
    var q = $stateParams.q;
    $scope.q = q;
    var obj = {
      q : q
    }
    $scope.loadingData = true;
    $scope.openbrowser = function(l){
      $cordovaInAppBrowser.open(l, '_blank')
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
      });
    }
    var again = function(){
      $http.post('http://localhost:1337/api/v1/search_image', obj)
      .success(function(datas){
          $ionicLoading.hide();
          if(datas.code!=200){
              again();
          } else {
            $scope.loadingData=false;
            $scope.list = datas.result[0].results;
            // if(datas.merchants.length==0){
            //   $scope.flag_no = "show";
            //   $scope.flag_yes = "hide";
            // }
          }
      })
      .error(function(err){
        $ionicLoading.hide();
        $scope.loadingData = false;
        var alertPopup = $ionicPopup.alert({
            title : 'Warning',
            template : 'Sorry, there is a problem in your network connection.'
        })
      })
    }
    $http.post('http://localhost:1337/api/v1/search_text', obj)
    .success(function(datas){
        $ionicLoading.hide();
        if(datas.code!=200){
            again();
        } else {
          $scope.loadingData=false;
          $scope.list = datas.result[0].results;
          // if(datas.merchants.length==0){
          //   $scope.flag_no = "show";
          //   $scope.flag_yes = "hide";
          // }
        }
    })
    .error(function(err){
      $ionicLoading.hide();
      $scope.loadingData = false;
      var alertPopup = $ionicPopup.alert({
          title : 'Warning',
          template : 'Sorry, there is a problem in your network connection.'
      })
    })
})
.controller('DiscoverCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // Just to get random data
	var titles = ["Tesla autopilot 'driving dangerously'", "The war on the 'hoverboard'", "The perils of unlimited holiday", "The most venomous animal of all", "Google’s Alphabet in big profit jump"],
			likes = ["119", "86", "261", "203", "206", "358"],
			prices = ["1,495", "49.00", "952", "85.00", "425", "1,645"],
			comments = ["1", "3", "23", "13", "2", "8"],
			users = [
				{
					name: "jsa",
					image: "https://s3.amazonaws.com/uifaces/faces/twitter/jsa/73.jpg"
				},
				{
					name: "gt",
					image: "https://s3.amazonaws.com/uifaces/faces/twitter/gt/73.jpg"
				},
				{
					name: "adellecharles",
					image: "https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/73.jpg"
				},
				{
					name: "mantia",
					image: "https://s3.amazonaws.com/uifaces/faces/twitter/mantia/73.jpg"
				},
				{
					name: "pinceladasdaweb",
					image: "https://s3.amazonaws.com/uifaces/faces/twitter/pinceladasdaweb/73.jpg"
				}
			];

	$scope.cards = [
		{
			title: titles[Math.floor(Math.random()*titles.length)],
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
			image: "http://lorempixel.com/480/450/technics",
			user: users[Math.floor(Math.random()*users.length)]
		},
		{
			title: titles[Math.floor(Math.random()*titles.length)],
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
			image: "http://lorempixel.com/480/450/technics",
			user: users[Math.floor(Math.random()*users.length)]
		},
		{
			title: titles[Math.floor(Math.random()*titles.length)],
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
			image: "http://lorempixel.com/480/450/technics",
			user: users[Math.floor(Math.random()*users.length)]
		}
	];

	$scope.doRefresh = function() {
		var last_index = $scope.cards.length + 1,
				new_card = {
					title: "New Card "+last_index,
					likes: likes[Math.floor(Math.random()*likes.length)],
					price: prices[Math.floor(Math.random()*prices.length)],
					comments: comments[Math.floor(Math.random()*comments.length)],
					image: "http://lorempixel.com/480/450/technics",
					user: users[Math.floor(Math.random()*users.length)]
				};
		$scope.cards.unshift(new_card);
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply();
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
