$(function() {
    function M300PlayerViewModel(parameters) {
        var self = this;
		
		// create web audio api context
		self.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		// create Oscillator and gain node
		self.oscillator = self.audioCtx.createOscillator();
		self.gainNode = self.audioCtx.createGain();

		// connect oscillator to gain node to speakers
		self.oscillator.connect(self.gainNode);
		self.gainNode.connect(self.audioCtx.destination);
		//gainNode.disconnect(audioCtx.destination);

		// set options for the oscillator
		self.oscillator.type = 'square';
		self.oscillator.frequency.value = 300; // value in hertz
		self.oscillator.detune.value = 100; // value in cents
		self.oscillator.start(0);
		
		self.gainNode.gain.value = .02;
		
		self.audioCtx.suspend();

		self.oscillator.onended = function() {
		  console.log('Your tone has now stopped playing!');
		}

		self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "M300Player") {
                return;
            }
			
			if(data.type == "beep") {				
				do{
					console.log(self.audioCtx.state);
				}
				while(self.audioCtx.state === 'running');				
				
				self.audioCtx.resume();
				self.oscillator.frequency.value = parseInt(data.freq.replace("S",""));
				setTimeout(function(){ self.audioCtx.suspend(); }, parseInt(data.duration.replace("P","")));
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