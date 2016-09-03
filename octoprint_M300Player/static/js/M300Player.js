$(function() {
    function M300PlayerViewModel(parameters) {
        var self = this;
		
		self.settings = parameters[0];
		
		self.waveType = ko.observable();
		self.gainLevel = ko.observable();
		
		self.notesBuffer = [];
		
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
		self.oscillator.type = self.settings.settings.plugins.M300Player.waveType();
		self.oscillator.frequency.value = 300; // value in hertz
		self.oscillator.detune.value = 100; // value in cents
		self.oscillator.start();
		
		self.gainNode.gain.value = parseFloat(self.settings.settings.plugins.M300Player.gainLevel());
		
		self.audioCtx.suspend();

		self.oscillator.onended = function() {
			console.log("oscillator stopped.");
		}
		
		self.audioCtx.onstatechange = function(){
			console.log(self.audioCtx.currentTime + ':' + self.audioCtx.state + ':' + self.notesBuffer.length + ' notes queued.');
		}
		
		self.playNotes = function() {
			self.noteFrequency = self.notesBuffer[0][0];
			self.noteDuration = self.notesBuffer[0][1];
			self.notesBuffer.shift();
			self.oscillator.frequency.value = self.noteFrequency;
			self.audioCtx.resume();
			setTimeout(function(){
							if (self.notesBuffer.length > 0) {
								self.playNotes();
							} else {
								self.audioCtx.suspend();
							}
						},self.noteDuration);
			}

		self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin != "M300Player") {
                return;
            }
			
			if(data.type == "beep") {
				self.notesBuffer.push([parseInt(data.freq.replace("S","")),parseInt(data.duration.replace("P",""))]); //push frequency,duration values into array for processing
				if (self.audioCtx.state === "suspended") {
					self.playNotes();
				}
			}
		}
		
		self.onBeforeBinding = function() {
            self.waveType(self.settings.settings.plugins.M300Player.waveType());
			self.gainLevel(self.settings.settings.plugins.M300Player.gainLevel());
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
        ["settingsViewModel"],

        // Finally, this is the list of selectors for all elements we want this view model to be bound to.
        ["#settings_plugin_M300Player"]
    ]);
});