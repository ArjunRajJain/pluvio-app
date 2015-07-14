// var Images = new FS.Collection("images", {
//   stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
// });

Meteor.methods({
    getRain : function(loc) {
      result = Async.runSync(function(done) {
        HTTP.get("https://api.forecast.io/forecast/2f807d4fda5900e3d851a575dd5a461d/"+loc,{},function(err,data) {
          if(data) {
            // console.log(data);
            daily = data.data.daily.data;
            // console.log(daily);
            prob = 0;
            for(i = 0 ; i < daily.length;i++) {
              // console.log(daily[i].precipProbability);
              if(daily[i].precipProbability > prob) prob = daily[i].precipProbability;
            }
            console.log(prob);
            done(null,prob);
          }
          if(err) {
            console.log(err);
            throwError(err);
          }
        });
      });
      return result.result;
    },
    base64tos3 : function(photo){
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_KEY, 
        region: process.env.region
      });

      buf = new Buffer(photo.replace(/^data:image\/\w+;base64,/, ""),'base64')
      str = +new Date + Math.floor((Math.random() * 100) + 1)+ ".jpg";
      var params = {
        Bucket: 'dtc-photos',
        Key: str, 
        Body: buf,
        ACL:'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };

      var s3 = new AWS.S3();
      var result = Async.runSync(function(done) {
        s3.putObject(params, function(err, data) {
        if (err) console.log(err)
        else {
          console.log(data);
          console.log("Successfully uploaded data to s3");
          var urlParams = {Bucket: 'dtc-photos', Key: str};
          s3.getSignedUrl('getObject', urlParams, function(err, url){
              console.log('the url of the image is ' +  url);
              newurl = url.split('?')[0].split("https://dtc-photos.s3.amazonaws.com")[1];
              newurl = "http://d2kt29ohe4uht6.cloudfront.net"+newurl;
              console.log("new url - " + newurl);
              done(null, newurl);
          });
        }
        });
      });

      return result.result; 
    },
    
    sendSms : function(id) {
      console.log(id);
      contact = Contacts.findOne({_id:id});
      name = Meteor.user().profile.name;

      twilioClient = Twilio("key", "secret");
      
      twilioClient.sendSms({
          to: contact.fullNumber,
          from: "+12672974329",
          body: name + ' is down to chill with you. See who else is down at http://downtochill.com/app'
      },Meteor.bindEnvironment(function(err, data) {
        Contacts.update({_id:contact._id},{$set:{sendSms: false},$addToSet:{seenBy:Meteor.userId()}});
      }));
      
    },
    pushMessageToAll : function(message) {
      users = Meteor.users.find({},{fields:{_id:1}}).fetch();
      if(Meteor.user().profile.name == "Arjun Raj Jain") {
        for(var i = 0; i < users.length;i++) {
          Meteor.call("publishPush",users[i]._id,message);
        }
      }
    },
    registerDevice: function(token,type,location) {
      this.unblock();

        platformarn = process.env.application_arniOS;

        if(type == "android") {
          platformarn = process.env.application_arnAndroid;
        }
        params = {
          PlatformApplicationArn: platformarn,
          Token: token, 
          CustomUserData: location
        };

        var result = Async.runSync(function(done) {
          sns.createPlatformEndpoint(params, Meteor.bindEnvironment(function(err, data) {
          if(data) {
            Pluvios.insert({endpointarn:data.EndpointArn,location:location});
            // Meteor.users.update(_this.userId, {$set: {"profile.notifcationToken": token,"profile.endpointarn": data.EndpointArn}});
            done(null,data.EndpointArn);
          }
        }));
        });
        return result.result;
  },
  publishPush: function(userId, mess) {
    this.unblock();
    user = Meteor.users.findOne(userId,{fields:{profile:1,unread:1}});
    
    if(user) {
      count = 0
      if(user.unread) count = user.unread.length;
      message = JSON.stringify({ 
        "default" : mess,
        "APNS":"{\"aps\":{\"alert\":\""+mess+"\",\"title\": \""+"DTC"+"\",\"sound\":\"default\",\"badge\":"+count+"}}",
        "GCM": "{ \"data\": { \"message\": \""+mess+"\",\"title\": \""+"DTC"+"\" } }"
      });
      if(user.profile && user.profile.endpointarn) {
        Meteor.users.update(userId,{$set : {lastPush: +new Date}});
        var params = {
          Message: message, // required
          TargetArn: user.profile.endpointarn,
          MessageStructure : 'json'
        };
        sns.publish(params, function(err, data) {
          if (err) console.log(err); // an error occurred
          else     console.log(data);           // successful response
        });
      }
    }
  }
});

var sns;
if(Meteor.isServer){
    // console.log(process.env);
    Meteor.startup(function () {
      // SyncedCron.start();
      // Kadira.connect("oMbB4yMRmEXJ3vGx2", "ef31a65f-f384-48d8-93de-43f6b7111efa");

      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_KEY, 
        region: process.env.region
      });

      sns = new AWS.SNS();

    });
}
