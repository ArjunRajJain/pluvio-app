famous.core.famous;
famous.polyfills;

Template.home.created = function(){
    var typename;
    var latlon = {};
    var token;
    var FastClick = famous.inputs.FastClick;
    EventHandler = famous.core.EventHandler;
    var SpringTransition = famous.transitions.SpringTransition;
    var Transitionable   = famous.transitions.Transitionable;
    Transitionable.registerMethod('spring', SpringTransition);
    var Utility = require('famous/utilities/Utility');
    var View = famous.core.View;
    var InputSurface = famous.surfaces.InputSurface;
    var RenderNode =  famous.core.RenderNode;
    var Group = famous.core.Group;
    var Surface = famous.core.Surface;
    var Transform = famous.core.Transform;
    var StateModifier = famous.modifiers.StateModifier;
    var Engine = famous.core.Engine;
    var mainContext = Engine.createContext();
    var HeaderFooter = famous.views.HeaderFooterLayout;
    var ImageSurface = famous.surfaces.ImageSurface;
    var TabBarController = require('famous-flex/src/widgets/TabBarController');
    var TouchSync = famous.inputs.TouchSync;
    var Transitionable  = famous.transitions.Transitionable;
    var Modifier = famous.core.Modifier;
    var RenderController = famous.views.RenderController;
    var eventHandler = new EventHandler();
    var Lightbox = famous.views.Lightbox;
    var Easing  = famous.transitions.Easing;
    bottomNode = new RenderNode();
    otherNode = new RenderNode();
    var pageview;
    bottomController = new RenderController();

    var lightbox = new Lightbox({ 
        inOpacity: 1,
        outOpacity: 1,
        inTransform: Transform.identity,
        outTransform: Transform.identity,
        inTransition: { duration: 20 },  
        outTransition: { duration: 20}});

     var heightScreen = window.innerHeight;
     var widthScreen = window.innerWidth;
     // if(!isMobile.any()) var ble;

    function PageViewLogin() { 
        View.apply(this, arguments);
        this.visible = this.options.visible;

        var adam = this;

       this.mainContextBacking = new Surface({
         properties: {
            backgroundColor: '#fff'
          }
      });
      var mainContextBackingMod = new Modifier({
        transform: Transform.behind
      });
      this.add(mainContextBackingMod).add(this.mainContextBacking);
      
        var pluvio = new Surface({
          size: [true,true],
          content: '<div style="text-align: center;font-family: Righteous; font-size:' + widthScreen / 8 + 'px; color: black;"> pluvio </div>'
        });

        var pluvioMod = new Modifier({
          origin: [0.5,0.5],
          align: [0.5,0.15],
          transform: Transform.translate(0,0,1)
        }); 

        this.add(pluvioMod).add(pluvio);

        var description = new Surface({
          size: [true,true],
          content:  '<div style="text-align: center;font-family: Righteous; color: #737373; font-size:' + widthScreen / 20 + 'px;">the ultimate umbrella</div>'
        });
        var descriptionMod = new Modifier({
          origin: [0.5,0.5],
          align: [0.5, 0.22],
          transform: Transform.translate(0,0,1)
        });

        this.add(descriptionMod).add(description);

        var zipButton = new InputSurface({
          size : [widthScreen*0.5,true],
          placeholder: "19104",
          properties: {
            fontFamily: 'Open Sans, sans-serif',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "5px",
            borderRadius: "5px",
            paddingLeft: "5px",
            textAlign:"center",
            fontSize: heightScreen/20 + 'px',
            boxShadow: '0 0 5px rgba(0,0,0,0.5)'
          }
        });


        var textSurface = new Surface({
          size: [widthScreen*0.8,true],
          content: 'finding your location...',
          properties: {
            fontFamily: "Open Sans,sans-serif",
            fontWeight: "600",
            textAlign: "center",
            fontSize: heightScreen / 20 + 'px',
            color: "#000",
          }
        });

        var textMod = new Modifier({
          origin: [0.5,0.5],
          align: [0.5,0.40],
          transform: Transform.translate(0,0,2)
        });

        var zipMod = new Modifier({
          origin: [0.5,0.5],
          align: [0.5,0.5],
          transform: Transform.translate(0,0,1),
          opacity: 0
        });

        var continueButton = new Surface({
        size: [100,100],
        content: '<img src="save1.svg" style="height:100px" />',
        properties: {
          backgroundColor: "transparent",
          // borderRadius: '5px',
          fontSize: heightScreen / 20 + 'px',
          color: "#000",
          fontFamily: 'Open Sans, sans-serif',
          textAlign: 'center',
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: heightScreen*0.015 + 'px',
          // border: '3px solid #000'
        } 
      });

     var continueButtonMod = new Modifier({
        origin: [0.5,0.5],
        align: [0.5,0.8],
        transform: Transform.translate(0,0,1),
        opacity:0
     });


     // renderMatch.add(continueButtonMod).add(continueButton);

     continueButton.on('touchstart', function(){
        continueButtonMod.setOpacity(0.2, {duration: 150});
     });

     foundthat = false;
     function startScanSuccess(status) {
      // alert(status);
      if(status && status.id) {
        foundthat = true;
        // alert(status.id);
        // console.log(status.id);
        window.localStorage.setItem("ibeacon",status.id);
        text2Surface.setContent("pluvio found and synced");
        window.localStorage.setItem("lastTime",+new Date);
        ble.stopScan(function() { console.log("Scan complete")},function() { console.log("stopScan failed"); });
        continueThis.show(continueNode);
         navigator.geolocation.getCurrentPosition( function(position) {
            console.log(position);  
            if(position) {
              latlon = {lat: position.coords.latitude, lon: position.coords.longitude};
              latlon2 = position.coords.latitude + "," + position.coords.longitude;
              window.localStorage.setItem("lastLocation",latlon2);
            }
          });
      }
     }

     function startScanerror(error) {
      alert(error);
     }

     continueButton.on('touchend', function(){
        continueButtonMod.setOpacity(1, {duration: 150});
        if(index == 0) {
          renderThis.hide();
          setTimeout(function() {
            renderThis.show(beaconNode);
          },200);
          continueThis.hide();
          window.localStorage.setItem('zip',zipButton.getValue());
          index++;
          if(ble) {
            ble.isEnabled(
                function() {
                    text2Surface.setContent("finding your pluvio...");
                    console.log("Bluetooth is enabled");
                    ble.startScan([],startScanSuccess, startScanerror);
                    setTimeout(function() {
                              if(!foundthat) {
                                  ble.stopScan(
                                    function() { console.log("Scan complete"); },
                                    function() { console.log("stopScan failed"); }
                                  );

                                window.localStorage.setItem("ibeacon","B4:99:4C:52:78:B8");
                                text2Surface.setContent("pluvio found and synced");
                                ble.stopScan(function() { console.log("Scan complete")},function() { console.log("stopScan failed"); });
                                continueThis.show(continueNode);
                              }
                            },5000);
                },
                function() {
                    console.log("Bluetooth is *not* enabled");
                    ble.enable(
                        function() {
                            text2Surface.setContent("finding your pluvio...");
                            console.log("Bluetooth is enabled");
                            ble.startScan([],startScanSuccess, startScanerror);

                            setTimeout(function() {
                              if(!foundthat) {
                                  ble.stopScan(
                                    function() { console.log("Scan complete"); },
                                    function() { console.log("stopScan failed"); }
                                  );

                                window.localStorage.setItem("ibeacon","B4:99:4C:52:78:B8");
                                text2Surface.setContent("pluvio found and synced");
                                ble.stopScan(function() { console.log("Scan complete")},function() { console.log("stopScan failed"); });
                                continueThis.show(continueNode);
                              }
                            },5000);
       
                        },
                        function() {
                            alert("You must enable bluetooth to find your pluvio");
                            console.log("The user did *not* enable Bluetooth");
                        }
                    );
                }
            );
          }
        }
        else {
          lightbox.hide();
          Meteor.call('registerDevice',token,typename,latlon,function(err,data){
            window.localStorage.setItem("endarn",data);
         });
          appView = new AppView();
          lightbox.show(appView);
        }
     });

     index = 0;

       var text2Surface = new Surface({
          size: [widthScreen*0.8,true],
          content: 'enabling your bluetooth...',
          properties: {
            fontFamily: "Open Sans,sans-serif",
            fontWeight: "600",
            textAlign: "center",
            fontSize: heightScreen / 20 + 'px',
            color: "#000",
          }
        });


        var text2Mod = new Modifier({
          origin: [0.5,0.5],
          align: [0.5,0.40],
          transform: Transform.translate(0,0,2)
        });


       renderThis = new RenderController();
       renderNode = new RenderNode();

       beaconNode = new RenderNode();
       continueNode = new RenderNode();

       continueThis = new RenderController();

        // renderNode.add(findButtonMod).add(findButton);
        continueNode.add(continueButtonMod).add(continueButton);
        
        renderNode.add(zipMod).add(zipButton);
        renderNode.add(textMod).add(textSurface);
        beaconNode.add(text2Mod).add(text2Surface);
        this.add(renderThis);
        this.add(continueThis);

        renderThis.show(renderNode);

                         window.localStorage.getItem('zip',"19104");
                 zipButton.setValue("19104");
                 continueButtonMod.setOpacity(1,{duration:500});
                 textSurface.setContent("confirm zip code");
                 zipMod.setOpacity(1,{duration:500});
                 continueThis.show(continueNode);

    }


    PageViewLogin.prototype = Object.create(View.prototype);
    PageViewLogin.prototype.constructor = PageViewLogin;

    PageViewLogin.DEFAULT_OPTIONS = {};

    function Bottom(){
      View.apply(this, arguments);
      
      if(widthScreen < heightScreen) toBe = widthScreen;
      else toBe = heightScreen;
      var logo = new ImageSurface({
        size: [toBe*0.6,toBe*0.6],
        content: 'umbrella.svg'
      });

      var logoMod = new Modifier({
        origin: [0.5,0.5],
        align: [0.5,0.3],
        transform: Transform.translate(0,0,1)
      });

      var noMore = new Surface({
        size: [widthScreen * 0.8,true],
        content: 'getting chance of rain...',
        classes : ['text-center'],
        properties: {
          textAlign: "center",
          fontFamily: 'Open Sans, sans-serif',
          fontWeight: 400,
          lineHeight: heightScreen / 15 + 'px',
          fontSize: heightScreen / 20 + 'px',
        }
      });

      var noMoreMod = new Modifier({
        origin: [0.5,0.5],
        align: [0.5,0.3],
        transform: Transform.translate(0,toBe*0.61,1)
      });

      Meteor.call("getRain",window.localStorage.getItem("location"),function(err,data){
        if(!err) {
          console.log(data);
          intense = data;
          console.log(intense);
          if(intense == 0) noMore.setContent("You won't need your pluvio today");
          else if(intense < .20) {
            noMore.setContent("There's a small chance you'll need your pluvio");
          }
          else if (intense < .40) {
            noMore.setContent("There's a chance you might not need your pluvio");
          }
          else if (intense < .60) {
            noMore.setContent("You'll be safe brining your pluvio");
          }
          else if (intense <= 1) {
            noMore.setContent("Better bring your pluvio!");
          }
          
        }
        if(err) {
          console.log(err);
        }
      });

      if(ble) {
        // ble.connect('B4:99:4C:52:78:B8', function(){
        //   alert("pluvio in vicinity");
        // }, function(){
        //   alert("lost umbrella");
        // });

        var theId = window.setInterval(function() {
          found = false;
          ble.isEnabled(
                function() {
                    console.log("Bluetooth is enabled");
                    scanIt();
                },
                function() {
                    console.log("Bluetooth is *not* enabled");
                    ble.enable(
                        function() {
                            console.log("Bluetooth is enabled");
                            scanIt();
                        },
                        function() {
                            alert("You must enable bluetooth to find your pluvio");
                            console.log("The user did *not* enable Bluetooth");
                        }
                    );
                }
          );

          function scanIt() {
            ble.startScan([], function(device) {
              if(device.id ==  'B4:99:4C:52:78:B8') {
                found = true;
                window.localStorage.setItem("lastTime",+new Date);
                navigator.geolocation.getCurrentPosition( function(position) {
                  console.log(position);  
                  if(position) {
                    latlon = {lat: position.coords.latitude, lon: position.coords.longitude};
                    latlon2 = position.coords.latitude + "," + position.coords.longitude;
                    window.localStorage.setItem("lastLocation",latlon2);
                  }
                });
                ble.stopScan(
                    function() { console.log("Scan complete"); },
                    function() { console.log("stopScan failed"); }
                );
              }
          }, function(){
            console.log('not found');
          });

          setTimeout(function() {
            ble.isEnabled(
                function() {
                    console.log("Bluetooth is enabled");
                    if(!found) {
                        ble.stopScan(
                          function() { console.log("Scan complete"); },
                          function() { console.log("stopScan failed"); }
                      );
                        // window.clearInterval(theId);
                      alert("Pluvio out of range");
                    }
                },
                function() {
                    console.log("Bluetooth is *not* enabled");
                }
          );

          },10000);
        }
        },15000);
     }
          else {
            // alert('bluetooth plugin not there');
          }

        var position = new Transitionable([0,0]);
        var sync = new TouchSync();

       logo.pipe(sync);

        sync.on('update', function(data){
            var currentPosition = position.get();
            position.set([
                currentPosition[0] + data.delta[0],
                currentPosition[1] + data.delta[1]
            ]);
          
        });
        sync.on('end', function(data){
            position.set([0,0], { method: 'spring', period: 500, dampingRatio: 0.2});

        }.bind(this));

        this.positionModifier = new Modifier({
            transform : function(){
                var currentPosition = position.get();
                return Transform.translate(currentPosition[0], currentPosition[1], 0);
            }
        });

        bottomNode.add(noMoreMod).add(noMore);
        bottomNode.add(this.positionModifier).add(logoMod).add(logo);
        bottomController.show(bottomNode);
        this.add(bottomController);
    }


  function _createBody() {

     this.rootModifier = new Modifier({
        transform: Transform.translate(0,0,20)
      });

     var bodyMod = new Modifier({
      transform:  Transform.translate(0, 0, 0)
     })
      this.mainNode = this.add(this.rootModifier);
      this.mainBody = this.layout.content.add(bodyMod);
      this.mainBody.add(new Bottom());

    }

   function _createHeader() {
      var adam = this;

      this.downtochill = new Surface({
          size: [true, true],
          content: '<div style="color:#FFF;font-family: Righteous; font-size:' + heightScreen / 22 + 'px;">pluvio</div>'
      });

      this.downtochillMod = new Modifier({
          origin: [0.5, 0.5],
          align : [0.5, 0.5],
          transform: Transform.translate(0,0,2)
      });

        this.backgroundSurface = new Surface({
        size: [undefined,undefined],
        properties: {
            backgroundColor: '#000',
            borderBottom: "1px solid #d8d8d8"
        }
      });

      var backgroundSurfaceMod = new Modifier({
        opacity: 1.0,
        transform: Transform.translate(0,0,1)
      });

      iconsHeaderRender = new RenderNode();
      iconsHeaderRender.add(this.downtochillMod).add(this.downtochill);


      var renderHeader = new RenderNode(new Modifier({transform: Transform.translate(0,0,21)}));
      renderHeader.add(backgroundSurfaceMod).add(this.backgroundSurface)
      this.layout.header.add(renderHeader);
      renderHeader.add(iconsHeaderRender);
    }

  function _createFooter(){
        var adam = this;

      tab = new Surface({
          size: [true, true],
          content: 'Last Seen',
          properties : {
            fontFamily: 'Righteous',
            color: "#FFF",
            backgroundColor: 'grey',
            borderRadius: '20px',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '5px',
            paddingBottom: '5px',
            fontSize: heightScreen / 22 + 'px'
          }
      });

      tabMod = new Modifier({
          origin: [0.5, 0.5],
          align : [0.5, 0.4],
          transform: Transform.translate(0,0,2)
      });


      var dummyMod = new Modifier({
        origin: [0.5, 0.5],
        align : [0.5, 0.5],
        transform: Transform.translate(0,0,3)
      });

      this.dummySurface = new Surface({
        size: [widthScreen,heightScreen*0.2],
      });

      home = true;

      this.dummySurface.on('touchstart', function(){
        // bottomController.hide();
        tabMod.setOpacity(0.2, {duration: 150});
     });

      this.dummySurface.on('touchend', function(){
        tabMod.setOpacity(1, {duration: 150});
        bottomController.hide();
        if(home) {
          tab.setContent("Home");
          bottomController.show(otherNode);
          home = false;
        }
        else {
          tab.setContent("Last Seen");
          bottomController.show(bottomNode);
          home = true;
        }
     });

      if(window.localStorage.getItem("lastTime")&&window.localStorage.getItem('lastLocation')) {
              var logo2 = new ImageSurface({
                size: [widthScreen*0.8,widthScreen*0.8],
                content: 'http://maps.google.com/maps/api/staticmap?center='+window.localStorage.getItem('lastLocation')+'&markers=icon:http://tinyurl.com/2ftvtt6|'+window.localStorage.getItem('lastLocation')+'&zoom=19&size=500x500&sensor=false',
              });

              var logo2Mod = new Modifier({
                origin: [0.5,0.5],
                align: [0.5,0.5],
                transform: Transform.translate(0,0,1)
              });

              console.log(window.localStorage.getItem('lastTime'));
              if(window.localStorage.getItem('lastTime')) {
              var noMore2 = new Surface({
                size: [widthScreen * 0.8,true],
                content: 'last seen ' + timeago(parseInt(window.localStorage.getItem('lastTime'))),
                classes : ['text-center'],
                properties: {
                  textAlign: "center",
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 400,
                  lineHeight: heightScreen / 30 + 'px',
                  fontSize: heightScreen / 30 + 'px',
                }
              });

              var noMore2Mod = new Modifier({
                origin: [0.5,0.5],
                align: [0.5,0.5],
                transform: Transform.translate(0,widthScreen*0.4+20,1)
              });
              otherNode.add(noMore2Mod).add(noMore2);
            }
              otherNode.add(logo2Mod).add(logo2);
              
            }




      iconsHeaderRender = new RenderNode();
      iconsHeaderRender.add(tabMod).add(tab);

      var renderHeader = new RenderNode(new Modifier({transform: Transform.translate(0,0,21)}));
      renderHeader.add(dummyMod).add(this.dummySurface)
      renderHeader.add(iconsHeaderRender);
      this.layout.footer.add(renderHeader);

  }

  function _createLayout(){
        var adam = this;

        this.rootModifier = new Modifier({
            transform: Transform.inFront
        });
        this.mainNode = this.add(this.rootModifier);

        this.layout = new HeaderFooter({
          footerSize: heightScreen*0.1,
          headerSize: heightScreen*0.1
        });

        var layoutModifier = new Modifier({
            transform: Transform.inFront
        });


        detailsViewLightbox = new Lightbox({
          inOpacity: 1,
          outOpacity: 1,
          inTransform: Transform.identity,
          outTransform: Transform.identity,
          inTransition: {duration: 10},
          outTransition: {duration: 10}
        });

        this.mainNode.add(new Modifier({transform: Transform.translate(0,0,heightScreen*0.1)})).add(detailsViewLightbox);

        
          mainBacking = new Surface({
           size: [undefined, heightScreen],
            properties: {
             backgroundColor: "#fff"
           }
        });
        //mainBacking.pipe(this._eventOutput);
         var mainBackingMod = new Modifier({
          origin: [0,0],
          align: [0,0]
         });

        this.layout.header.add(mainBacking);
        
        //this.layout.content.add(backing);
        this.mainNode.add(layoutModifier).add(this.layout);
    }


//pageview
    function PageView() {
        View.apply(this, arguments);
        _createLayout.call(this);
        _createHeader.call(this);
        if(window.localStorage.getItem("lastTime")&&window.localStorage.getItem('lastLocation')) _createFooter.call(this);
        _createBody.call(this);
    }

    function _createPageView(){

        pageview = new PageView();

        this.add(pageview);
        var adam = this;
    }

//appview    
    function AppView(){
          View.apply(this, arguments);

          var adam = this;

          this.rootModifier = new Modifier({
            origin: [1,0],
            align: [0,0],
            size: [undefined, heightScreen],
            transform: function(){
              return Transform.translate(adam.pageviewPos.get(), 0, 20);
            }
          });

          this.mainNode = this.add(this.rootModifier);
          this.menuToggle = false;
          this.menuToggleChat = false;
          this.pageviewPos = new Transitionable(0);

          
          _createPageView.call(this);
          // _handleSwipe.call(this);

          var back = new Surface({
            properties: {
              backgroundColor: '#fff',
             // borderRight: "1px solid #909090"
            }
          });

          var backMod = new Modifier({
            transform: Transform.behind
          });
          
          this.mainNode.add(backMod).add(back)
          
          back.pipe(pageview._eventOutput);

    }


    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;


     AppView.prototype.slideLeft = function() {
        hamburgerToggle = true;
        this.pageviewPos.set(0, this.options.transition, function() {
            this.menuToggle = false;
        }.bind(this));
    };

    AppView.prototype.slideRight = function() {
        hamburgerToggle = false;
        this.pageviewPos.set(this.options.openPosition, this.options.transition, function() {
            this.menuToggle = true;
        }.bind(this));
    };

  

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    Bottom.prototype = Object.create(View.prototype);
    Bottom.prototype.constructor = Bottom;

//options
    AppView.DEFAULT_OPTIONS = {
          openPosition: widthScreen*0.7,
        transition: {
            duration: 200,
            curve: 'easeOut'
        },
        posThreshold: 0.6*widthScreen,
        velThreshold: 0.2
            };

    PageView.DEFAULT_OPTIONS = {
       headerSize : heightScreen / 8
    };



    var appView;
    var pageviewLogin;

   if(Meteor.status().connected===false) Meteor.reconnect();

   if(window.localStorage.getItem('zip')!=null){
        // Meteor.call('getInfo');
        if(appView == null) {
         appView = new AppView();
         lightbox.show(appView);
        }
    }
    else{
        if(pageviewLogin == null) {
          console.log('we in');
          window.localStorage.setItem("location","40.7142,-74.0064");
          window.localStorage.setItem("lastLocation","40.7142,-74.0064");
          var pageviewLogin = new PageViewLogin();
          lightbox.show(pageviewLogin);
          
        }
    }

    lastCheck = +new Date;

     var privateConvoLightbox;
     var postLightbox;
     var messengerLightbox;
     var commentsLightbox;
    
    
    mainContext.add(lightbox);
    mainContext.setPerspective(1000);

  //deviceReady executes once everything is loaded the first time, resume is for when you get back on the app without reload
  document.addEventListener("backbutton", onBackKeyDown, false);
  function onBackKeyDown(e) {
    e.preventDefault();
  }

  document.addEventListener("deviceready", function(){


    ///call to facebook events
    document.addEventListener("pause",function() {

    });

  
    document.addEventListener("resume", function(){
      if(Meteor.status().connected===false) Meteor.reconnect();
    }, false);

    if(!(device.platform == "android" || device.platform == "Android")) {
      if(Meteor.isCordova) cordova.plugins.Keyboard.disableScroll(true);
    }

    if(Meteor.isCordova) cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
       
    pushNotification = window.plugins.pushNotification;

    if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
      pushNotification.register(successHandler, errorHandler, {"senderID":"252006756181","ecb":"onNotificationGCM"});    // required!
    } 
    else {
      pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});  // required!
    }

  },true);

  window.onNotificationGCM = onNotificationGCM;
  window.addEventListener('native.keyboardshow', keyboardShowHandler);
  window.addEventListener('native.keyboardhide', keyboardHideHandler);

  function keyboardHideHandler(e){
    translateScrollEvent.emit("translateScrollBack");
    translateScrollEvent2.emit('translateScrollBack');
}

function keyboardShowHandler(e){
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) navigator.notification.alert(e.alert);
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    if (e.badge) pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
          if ( e.regid.length > 0 ) {
            token = e.regid;
            typename = "android";
          }
        break;
        
        case 'message':
        break;
        
        case 'error':
        break;
        
        default:
        break;
    }
}

function tokenHandler (result) {
    token = result;
    typename = "ios";
}

function successHandler (result) {

}

function errorHandler (error) {
    //$("#app-status-ul").append('<li>error:'+ error +'</li>');
}

  // });

 function deg2rad(deg) {
    return deg * (Math.PI/180)
 }  


var lastIndex = null;
function formatTime(date){
        var a_p = "";
        var d = date;
        var theDate = "";

        if(date < new Date().getTime() - 1000*60*60*24){
          if(date > new Date().getTime() - 1000*60*60*48){
            theDate = "Yesterday"
          }
          else{
            month = date.getMonth() + 1;
            theDate = month + "/" + date.getDate();
          }
        }
          else{
          var curr_hour = d.getHours();
          if (curr_hour < 12){
             a_p = "AM";
          }
          else{
             a_p = "PM";
          }
          if (curr_hour == 0){
             curr_hour = 12;
          }
          if (curr_hour > 12){
             curr_hour = curr_hour - 12;
          }
          var curr_min = d.getMinutes();

          if(curr_min < 10){
            curr_min = "0" + curr_min;
          }
          theDate = curr_hour + ":" + curr_min + " " + a_p;
      }
        return theDate;
    }
  };
  var isMobile = {
      Android: function() {
          return /Android/i.test(navigator.userAgent);
      },
      BlackBerry: function() {
          return /BlackBerry/i.test(navigator.userAgent);
      },
      iOS: function() {
          return /iPhone|iPad|iPod/i.test(navigator.userAgent);
      },
      Windows: function() {
          return /IEMobile/i.test(navigator.userAgent);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
      }
  };
