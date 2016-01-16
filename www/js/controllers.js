angular.module('starter')
.controller('DashCtrl', function($scope,$cordovaToast,$ionicPopup,$ionicLoading,$http,$q,$ionicModal,$state,$cordovaImagePicker,$cordovaCamera) {
  var image = "";
  $scope.loadingData = true;
  $scope.loadingData2 = false;
  //modal
  $ionicModal.fromTemplateUrl('templates/modal_search.html', {
    scope: $scope,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });
  //end-modal
  var options = {
   maximumImagesCount: 1,
   width:800,
   height:800,
   quality: 80
  };
  $scope.getpicture = function(){
    //$state.go('app.search_image');
    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        window.plugins.Base64.encodeFile(results[0], function(base64){
            var image = base64;
            $scope.image = image;
            var canceller = $q.defer();
            $scope.cancel = function(){
                canceller.resolve("user cancelled");
                $scope.modal.hide();
            };
            $scope.modal.show();
            var obj = {
              image : image
            }
            $http.post('https://www.kolexia.com/api/v1/search_image', obj, { timeout: canceller.promise })
            .success(function(datas){
                if(datas.code!=200){
                    // again();
                } else {
                  $scope.loadingData= false;
                  $scope.loadingData2 = true;
                  var config = {
                    headers:  {
                          "X-Mashape-Key" : "9L4Z8XyKhOmshCsCTAaOpbhKWNY1p1uBqvyjsnJQv74uIMHP9U",
                          'Accept': 'application/json'
                      },
                      timeout: canceller.promise
                  };
                  var url = 'https://camfind.p.mashape.com/image_responses/'+datas.result;
                  var again = function(){
                    $http.get(url,config)
                      .success(function(resp) {
                        var name = resp.name;
                        if(typeof name=="undefined" || name=="undefined")
                        {
                            again();
                            return;
                        } else {
                          $scope.modal.hide();
                          $scope.loadingData= true;
                          $scope.loadingData2 = false;
                          $state.go('app.search_result_text/:q',{q: name});
                        }
                      })
                  }
                  $http.get(url,config)
                    .success(function(resp) {
                      var name = resp.name;
                      if(typeof name=="undefined" || name=="undefined")
                      {
                          again();
                          return;
                      }
                      else {
                        $scope.modal.hide();
                        $scope.loadingData= true;
                        $scope.loadingData2 = false;
                        $state.go('app.search_result_text/:q',{q: name});
                      }
                    })
                }
            })
            .error(function(err){
              $scope.modal.hide();
              $scope.loadingData= true;
              $scope.loadingData2 = false;
              var alertPopup = $ionicPopup.alert({
                  title : 'Warning',
                  template : 'Sorry, there is a problem in your network connection.'
              })
            })
        });
      }, function(error) {
        // error getting photos
    });
  }
  $scope.getcamera = function(){
    var options = {
      quality: 80,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      targetWidth :800,
      targetHeight :800,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = 'data:image/jpeg;base64,'+imageData;
      $scope.image = image;
      var canceller = $q.defer();
      $scope.cancel = function(){
          canceller.resolve("user cancelled");
          $scope.modal.hide();
      };
      $scope.modal.show();
      var obj = {
        image : image
      }
      $http.post('https://www.kolexia.com/api/v1/search_image', obj, { timeout: canceller.promise })
      .success(function(datas){
          if(datas.code!=200){
              // again();
          } else {
            $scope.loadingData= false;
            $scope.loadingData2 = true;
            var config = {
              headers:  {
                    "X-Mashape-Key" : "9L4Z8XyKhOmshCsCTAaOpbhKWNY1p1uBqvyjsnJQv74uIMHP9U",
                    'Accept': 'application/json'
                },
                timeout: canceller.promise
            };
            var url = 'https://camfind.p.mashape.com/image_responses/'+datas.result;
            var again = function(){
              $http.get(url,config)
                .success(function(resp) {
                  var name = resp.name;
                  if(typeof name=="undefined" || name=="undefined")
                  {
                      again();
                      return;
                  } else {
                    $scope.modal.hide();
                    $scope.loadingData= true;
                    $scope.loadingData2 = false;
                    $state.go('app.search_result_text/:q',{q: name});
                  }
                })
            }
            $http.get(url,config)
            .success(function(resp) {
              var name = resp.name;
              if(typeof name=="undefined" || name=="undefined")
              {
                  again();
                  return;
              } else {
                $scope.modal.hide();
                $scope.loadingData= true;
                $scope.loadingData2 = false;
                $state.go('app.search_result_text/:q',{q: name});
              }
            })
          }
      })
      .error(function(err){
        $scope.modal.hide();
        $scope.loadingData= true;
        $scope.loadingData2 = false;
        var alertPopup = $ionicPopup.alert({
            title : 'Warning',
            template : 'Sorry, there is a problem in your network connection.'
        })
      })
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
      $http.post('https://www.kolexia.com/api/v1/search_text', obj)
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
    $http.post('https://www.kolexia.com/api/v1/search_text', obj)
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
.controller('DiscoverCtrl', function($scope,$state) {
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
			title: 'Zara Tokopedia Indonesia',
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
			image: "http://www.destinationcentreville.com/files/destination-centre-ville/zara_01_0.jpg",
      keyword:'zara tokopedia indonesia',
			user: users[Math.floor(Math.random()*users.length)]
		},
		{
			title: 'Jam Tangan Bonia',
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
			image: "https://anekajammurah.files.wordpress.com/2013/12/bonia-215rb.jpg",
      keyword:'jam tangan bonia',
			user: users[Math.floor(Math.random()*users.length)]
		},
		{
			title: 'Alinskiebrothers',
			likes: likes[Math.floor(Math.random()*likes.length)],
			price: prices[Math.floor(Math.random()*prices.length)],
			comments: comments[Math.floor(Math.random()*comments.length)],
      keyword:'alinskiebrother',
			image: "https://ecs7.tokopedia.net/img/cache/300/product-1/2015/10/28/5464194/5464194_110a8b9b-a4a1-4f29-b65e-22194115b6c8.jpg",
			user: users[Math.floor(Math.random()*users.length)]
		}
	];
  $scope.search = function(keyword){
      $state.go('app.search_result_text_discover/:q',{q: keyword});
  }
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

.controller('ChatDetailCtrl', function($scope, $state,$stateParams) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$state) {
  $scope.cards = [
		{
			title: 'Zara Tokopedia Indonesia',
			image: "http://www.destinationcentreville.com/files/destination-centre-ville/zara_01_0.jpg",
      keyword:'zara tokopedia indonesia',
		},
		{
			title: 'Jam Tangan Bonia',
			image: "https://anekajammurah.files.wordpress.com/2013/12/bonia-215rb.jpg",
      keyword:'jam tangan bonia',
		},
		{
			title: 'Alinskiebrothers',
      keyword:'alinskiebrother',
			image: "https://ecs7.tokopedia.net/img/cache/300/product-1/2015/10/28/5464194/5464194_110a8b9b-a4a1-4f29-b65e-22194115b6c8.jpg",
		}
	];
  $scope.search = function(keyword){
      $state.go('app.search_result_text_profile/:q',{q: keyword});
  }
});
