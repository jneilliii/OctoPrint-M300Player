# coding=utf-8

import octoprint.plugin

class M300Player(octoprint.plugin.AssetPlugin):
	def PlayM300(self, comm_instance, phase, cmd, cmd_type, gcode, *args, **kwargs):
		if gcode: #and gcode.startswith("M300"):
			# temp = gcode.split()
			# iFrequency = temp[1]
			# iDuration = temp[2]
			self._plugin_manager.send_plugin_message(self._identifier, gcode))
			return
			
	def get_assets(self):
		return dict(js=["js/M300Player.js"])
		
	def get_version(self):
		return self._plugin_version
		
	##~~ Softwareupdate hook
	def get_update_information(self):
		return dict(
			M300Player=dict(
				displayName="M300Player",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="jneilliii",
				repo="OctoPrint-M300Player",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/jneilliii/OctoPrint-M300Player/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "M300Player"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = M300Player()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.comm.protocol.gcode.queuing": __plugin_implementation__.PlayM300,
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}