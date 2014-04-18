/*
* @Author: sergiovilar
* @Date:   2014-03-18 16:28:56
* @Last Modified by:   sergiovilar
* @Last Modified time: 2014-04-18 08:38:37
*/

App.Page.Home = function(){

	var SubscriptionController = new App.Controller.Subscription();

	this.init = function(){

		var that = this;

		this.listeners();
		window.clearReaderDB = openDatabase('clear-reader', '1.0', 'Banco de dados do Clear Reader', 2 * 1024 * 1024);

		// Verifica se o usuário tem algum feed cadastrado
		var noSubscription = $('.no-subscription');

		SubscriptionController.list(function(data){

			if(!data){

				new App.View.AddSubscription({el: noSubscription.find('#homeAddSubscription')});
				noSubscription.removeClass('hidden');

			}else{
				that.listSubscriptions();
			}

		});

	};

	this.listeners = function(){

		var that = this;

		mediator.subscribe('subscription_added', function(){
			$('.no-subscription').addClass('hidden');
			that.listSubscriptions();
		});

		mediator.subscribe('feed_selected', function(id){
			new App.View.FeedItem({id: id});
		});

		$('.app-container').delegate('.close', 'click', function(){
			console.log('clicou');
			$('.app-container').find('sidebar').addClass('hidden');
			return false;
		});

		$('#add-subscription').click(function(){

			var SubscriptionController = new App.Controller.Subscription();

			var value = window.prompt('Insira a URL do Feed:');

			var sendObject = {
				title: '',
				url: value
			};

			SubscriptionController.add(sendObject, function(){
				mediator.publish('subscription_added', true);
			});

		});

		$('.feed-item-view').on('click', function(){

			gui.Shell.openExternal($(this).attr('href'));
			return false;

		});

	};

	this.listSubscriptions = function(){

		console.log('atualizando');

		new App.View.ListSubscriptions({el: $('#catalog-select').find('.categories')});
		new App.View.ListFeeds({el: $('.app-container').find('.feeds')});

	};

	this.init();

	return this;

};
