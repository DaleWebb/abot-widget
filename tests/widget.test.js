describe('abot fn', function() {
	it('should exist', function() {
		expect(AbotChat).toBeDefined();
	});
});

describe('chatbox functions', function() {
	beforeEach(function() {
		AbotChat.init({
			server: 'localhost:4200'
		});
	});

	it('should open the chatbox', function() {
		var launcherButton = document.getElementById('abot-launcher');
		var chatBox = document.getElementById('abot-chatbox');

		expect(chatBox.style.display).toBe('none');
		expect(launcherButton.classList.contains('abot-launcher-active')).toBe(true);
		expect(launcherButton.classList.contains('abot-launcher-inactive')).toBe(false);

		AbotChat.open();

		expect(chatBox.style.display).toBe('block');
		expect(launcherButton.classList.contains('abot-launcher-active')).toBe(false);
		expect(launcherButton.classList.contains('abot-launcher-inactive')).toBe(true);
	});

	it('should close the chatbox', function() {
		var launcherButton = document.getElementById('abot-launcher');
		var chatBox = document.getElementById('abot-chatbox');

		AbotChat.open();

		expect(chatBox.style.display).toBe('block');
		expect(launcherButton.classList.contains('abot-launcher-active')).toBe(false);
		expect(launcherButton.classList.contains('abot-launcher-inactive')).toBe(true);

		AbotChat.close();

		expect(chatBox.style.display).toBe('none');
		expect(launcherButton.classList.contains('abot-launcher-active')).toBe(true);
		expect(launcherButton.classList.contains('abot-launcher-inactive')).toBe(false);
	});
})
