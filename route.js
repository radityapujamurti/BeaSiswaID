Router.route('/admin');

Router.route('/',{
	template: 'home'
});

Router.route('/home');

Router.configure({
    layoutTemplate: 'main'
});

