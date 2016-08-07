$(function() {
    function M300PlayerViewModel(parameters) {
        var self = this;
		
		// create web audio api context
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		// create Oscillator and gain node
		var oscillator = audioCtx.createOscillator();
		var gainNode = audioCtx.createGain();

		gainNode.gain.value = .02;

		// connect oscillator to gain node to speakers
		oscillator.connect(gainNode);
		//gainNode.connect(audioCtx.destination);
		//gainNode.disconnect(audioCtx.destination);

		// set options for the oscillator
		oscillator.type = 'square';
		oscillator.frequency.value = 300; // value in hertz
		oscillator.detune.value = 100; // value in cents
		oscillator.start(0);

		oscillator.onended = function() {
		  console.log('Your tone has now stopped playing!');
		}

		self.onDataUpdaterPluginMessage = function(plugin, data) {
			console.log(plugin);
			console.log(data);
            if (plugin != "M300Player") {
                return;
            }
			
			if(data.type == "beep") {
				oscillator.frequency.value = parseInt(data.freq);
				gainNode.connect(audioCtx.destination);
				setTimeout(function(){ gainNode.disconnect(audioCtx.destination); }, parseInt(data.duration));
			}
		}

    }

    // This is how our plugin registers itself with the application, by adding some configuration
    // information to the global variable OCTOPRINT_VIEWMODELS
    ADDITIONAL_VIEWMODELS.push([
        // This is the constructor to call for instantiating the plugin
        M300PlayerViewModel,

        // This is a list of dependencies to inject into the plugin, the order which you request
        // here is the order in which the dependencies will be injected into your view model upon
        // instantiation via the parameters argument
        [],

        // Finally, this is the list of selectors for all elements we want this view model to be bound to.
        []
    ]);
});