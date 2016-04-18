
Router.route('/admin', {
    name: 'Admin',
    template: 'admin',
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser == "DAevKXNQH9FcFKdPH"){
            this.next();
        } else {
            this.render("home");
        }
    }
});

Router.route('/',{
	template: 'home'
});

Router.route('/home');

Router.configure({
    layoutTemplate: 'main'
});

