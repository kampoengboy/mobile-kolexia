angular.module('starter')
.directive('preImg', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			ratio:'@',
			helperClass: '@'
		},
		controller: function($scope) {
			$scope.loaded = false;

			this.hideSpinner = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
				});
			};
		},
		templateUrl: 'templates/misc/pre_img.html'
	};
})
.directive('spinnerOnLoad', function() {
	return {
		restrict: 'A',
		require: '^preImg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, preImgController) {
			element.on('load', function() {
		    // Set visibility: true + remove spinner overlay
				preImgController.hideSpinner();
		  });
		  // scope.$watch('ngSrc', function() {
		  //   // Set visibility: false + inject temporary spinner overlay
		  // });
		}
	};
})
.controller('IntroCtrl', function($scope,$state){
    
})
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
                          $state.go('app.search_result_text/:q/:image',{q: name,image:image});
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
                        $state.go('app.search_result_text/:q/:image',{q: name,image:image});
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
                    $state.go('app.search_result_text/:q/:image',{q: name,image:image});
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
                $state.go('app.search_result_text/:q/:image',{q: name,image:image});
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
.controller('SeeImagesCtrl', function($scope,$cordovaInAppBrowser,$state,$stateParams,$http,$ionicLoading){
    $scope.image = $stateParams.link;
    var link = $stateParams.link2;
    link = link.split('&')[1];
    link = link.replace("imgrefurl=","");
    $scope.openbrowser = function(l){
      $cordovaInAppBrowser.open(link, '_blank')
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
      });
    }
})
.controller('RelatedImagesCtrl', function($scope,$state,$stateParams,$http,$ionicLoading){
    var q = $stateParams.q;
    var conf = {
        'Content-Type':'application/json'
    }
    $scope.loadingDataImage = true;
    var link_google = 'https://www.google.com/images?q='+q;
    var link = 'https://api.import.io/store/connector/_magic?_apikey=c8fae5e094bc41c48b811bc6544f848ac80cdaf78adeac488ef79c6b924272eaf5d2362b0de757aed9d71ef5c2a3368383e5625b0af25241c3eb73421518fea01846a1d0f2bdc6e7dbdcaa285da960ff&connectorVersionGuid=1bf5b144-5496-7c11-344a-e027215e6049&url='+link_google+'&format=JSON&js=false';
    var again_image = function(){
      $http.get(link,conf)
      .success(function(datas){
          $ionicLoading.hide();
          if(typeof error!="undefined"){
              again_image();
          } else {
              $scope.loadingDataImage = false;
              $scope.images = [];
              var data = datas.tables[0].results;
              for(var i=0;i<data.length;i++){
                  var tmp = {
                      src : data[i].rgi_image,
                      link : data[i].rgl_link
                  }
                  $scope.images.push(tmp);
              }
          }
      })
      .error(function(err){
        $ionicLoading.hide();
        $scope.loadingDataImage = false;
        //$scope.loadingData = false;
        // var alertPopup = $ionicPopup.alert({
        //     title : 'Warning',
        //     template : 'Sorry, there is a problem in your network connection.'
        // })
      })
    }
    $scope.see_images = function(link,link2){
      var from_link = $state.current.url;   
      if(from_link=="app/related_images_discover/:q"){
          $state.go('app.see_images_discover/:link/:link2',{link: link,link2:link2});
      }
      else if(from_link=="app/related_images_profile/:q"){
          $state.go('app.see_images_profile/:link/:link2',{link: link,link2:link2});
      }
      else if(from_link=="app/related_images/:q"){
          $state.go('app.see_images/:link/:link2',{link: link,link2:link2});
      }
    }
    $http.get(link,conf)
      .success(function(datas){
          $ionicLoading.hide();
          if(typeof error!="undefined"){
              again_image();
          } else {
              $scope.loadingDataImage = false;
              $scope.images = [];
              var data = datas.tables[0].results;
              for(var i=0;i<data.length;i++){
                  var tmp = {
                      src : data[i].rgi_image,
                      link : data[i].rgl_link
                  }
                  $scope.images.push(tmp);
              }
          }
      })
      .error(function(err){
        $ionicLoading.hide();
        $scope.loadingDataImage = false;
        //$scope.loadingData = false;
        // var alertPopup = $ionicPopup.alert({
        //     title : 'Warning',
        //     template : 'Sorry, there is a problem in your network connection.'
        // })
      })
})
.controller('SearchTextCtrl', function($scope,$state,$ionicPopup){
  $scope.data = {};
   $scope.focused = function() {
    var txt_box = document.getElementById('show-border');
    txt_box.className = "";
    txt_box.className = "list list-inset blue-border";
  }
   $scope.blurred = function() {
    var txt_box = document.getElementById('show-border');
    txt_box.className = "";
    txt_box.className = "list list-inset gray-border";
  }
  $scope.search = function(data){
      var ans = "";
      var text = data.keyword;
      if(typeof data.keyword=="undefined"){
        var alertPopup = $ionicPopup.alert({
               title : 'Warning',
               template : 'You must fill the input text'
           });
        return;
      } else {
          ans+=text;
      }
      $state.go('app.search_result_text/:q/:image',{q: ans,image:""});
  }
})
.controller('SearchResultTextCtrl', function($scope,$cordovaInAppBrowser,$state,$stateParams,$ionicPopup,$ionicLoading,$http){
    var q = $stateParams.q;
    var image = $stateParams.image;
    $scope.hasImage = true;
    $scope.image = image;
    if(typeof image=="undefined" || image=="undefined" || image.length==0){
        $scope.hasImage = false;     
    }
    $scope.q = q;
    var obj = {
      q : q
    }
    $scope.loadingData = true;
    $scope.loadingDataImage = true;
    $scope.openbrowser = function(l){
      $cordovaInAppBrowser.open(l, '_blank')
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
      });
    }
    var conf = {
        'Content-Type':'application/json'
    }
    var link_google = 'https://www.google.com/images?q='+q;
    var link = 'https://api.import.io/store/connector/_magic?_apikey=c8fae5e094bc41c48b811bc6544f848ac80cdaf78adeac488ef79c6b924272eaf5d2362b0de757aed9d71ef5c2a3368383e5625b0af25241c3eb73421518fea01846a1d0f2bdc6e7dbdcaa285da960ff&connectorVersionGuid=1bf5b144-5496-7c11-344a-e027215e6049&url='+link_google+'&format=JSON&js=false';
    var again_image = function(){
       $http.get(link,conf)
      .success(function(datas){
          $ionicLoading.hide();
          if(typeof error!="undefined"){
              again_image();
          } else {
              $scope.loadingDataImage = false;
              scope.data_images = [];
              
              var data = datas.tables[0].results;
              for(var i=0;i<3;i++){
                  $scope.data_images.push(data[i].rgi_image);
              }
          }
      })
      .error(function(err){
        $ionicLoading.hide();
        $scope.loadingDataImage = false;
        //$scope.loadingData = false;
        // var alertPopup = $ionicPopup.alert({
        //     title : 'Warning',
        //     template : 'Sorry, there is a problem in your network connection.'
        // })
      })
    }
    $scope.go_related_images = function(){
      var from_link = $state.current.url;   
      if(from_link=="app/search_result_text_discover/:q/:image"){
          $state.go('app.related_images_discover/:q',{q: q});
      }
      else if(from_link=="app/search_result_text_profile/:q/:image"){
          $state.go('app.related_images_profile/:q',{q: q});
      }
      else if(from_link=="app/search_result_text/:q/:image"){
          $state.go('app.related_images/:q',{q: q});
      }
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
    $http.get(link,conf)
      .success(function(datas){
          $ionicLoading.hide();
          if(typeof error!="undefined"){
              again_image();
          } else {
              $scope.data_images = [];
              $scope.loadingDataImage = false;
              var data = datas.tables[0].results;
              for(var i=0;i<3;i++){
                  $scope.data_images.push(data[i].rgi_image);
              }
          }
      })
      .error(function(err){
        $ionicLoading.hide();
        $scope.loadingDataImage = false;
        //$scope.loadingData = false;
        // var alertPopup = $ionicPopup.alert({
        //     title : 'Warning',
        //     template : 'Sorry, there is a problem in your network connection.'
        // })
      })
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
  $scope.search = function(keyword,image){
      $state.go('app.search_result_text_discover/:q/:image',{q: keyword,image:image});
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
  $scope.search = function(keyword,image){
      $state.go('app.search_result_text_profile/:q/:image',{q: keyword,image:image});
  }
});
