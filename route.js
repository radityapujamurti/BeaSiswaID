
Router.route('/admin', {
    name: 'Admin',
    template: 'admin',
    onBeforeAction: function(){
        //localhost: "DAevKXNQH9FcFKdPH"
        var currentUser = Meteor.userId();
        if(currentUser == "TWFHrTkLYzeYDdp88"){
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

