Template.newContribution.events({
	'click .fa-close': function(){
		Session.set('newPost', false);
	},
	'click .newPostBtn' : function() {
      Session.set('newPost', true);
    }
})