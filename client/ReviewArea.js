Template.reviewArea.events({
  'click #verifiedReviewTabBtn'(){
    Session.set('tabReviewMode', 'verified');
    $('#reviewArea #tabstripNav li').removeClass('active');
    $('#verifiedReviewTabBtn').addClass('active');
  },
  'click #popularReviewTabBtn'(){
    Session.set('tabReviewMode', 'popular');
    $('#reviewArea #tabstripNav li').removeClass('active');
    $('#popularReviewTabBtn').addClass('active');
  },
  'click #freshReviewTabBtn'(){
    Session.set('tabReviewMode', 'fresh');
    $('#reviewArea #tabstripNav li').removeClass('active');
    $('#freshReviewTabBtn').addClass('active');
  },
})
Template.reviewArea.helpers({
    reviews: function(){
      tabReviewMode = Session.get('tabReviewMode');
      if(tabReviewMode == 'popular'){
        return Reviews.find({$and: [
                    {archive:false}]}, 
                    {sort: {likersCount: -1}});
      } else if(tabReviewMode == 'fresh'){
        return Reviews.find({$and: [
                    {archive:false}]}, 
                    {sort: {createdAt: -1}});
      } else {
      return Reviews.find({$and: [{verified:true},
                    {archive:false}]}, 
                    {sort: {createdAt: -1}});
      }
    },

});