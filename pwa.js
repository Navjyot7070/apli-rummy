(() => {
  const area = document.querySelector('#installArea');
  const button = document.querySelector('#installApp');
  const help = document.querySelector('#installHelp');
  const displayMode = matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  const installed = () => displayMode.matches || navigator.standalone === true;
  const updateDisplay = () => area.classList.toggle('hide', installed());
  updateDisplay();
  displayMode.addEventListener('change', updateDisplay);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    updateDisplay();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    area.classList.add('hide');
  });
  button.addEventListener('click', async () => {
    if (!installPrompt) {
      help.textContent = /iPad|iPhone|iPod/.test(navigator.userAgent)
        ? 'Safari मध्ये Share → Add to Home Screen निवडा.'
        : 'Browser च्या ⋮ मेनूमधून Install app / Add to Home screen निवडा. पर्याय दिसत नसल्यास Chrome मध्ये ही लिंक उघडा.';
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    button.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      help.textContent = choice.outcome === 'accepted' ? 'Install मंजूर झाले. फोनच्या Home Screen वरून app उघडा.' : 'नंतरही install करता येईल.';
    } catch {
      help.textContent = 'Browser च्या मेनूमधून Install app निवडा.';
    } finally {
      button.disabled = false;
    }
  });
  const updateNetwork = () => document.querySelector('#offlineNotice').classList.toggle('hide', navigator.onLine);
  updateNetwork();
  window.addEventListener('online', updateNetwork);
  window.addEventListener('offline', updateNetwork);
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(error => {
      console.warn('App offline setup unavailable:', error);
    });
  }
})();
