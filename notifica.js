if ('Notification' in window && 'serviceWorker' in navigator) {
  // Verifica se o navegador suporta notificações e Service Workers

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Se a permissão for concedida, envia a notificação
      navigator.serviceWorker.getRegistration().then(reg => {
        reg.showNotification('Bem vindo!', {
          body: 'Aproveite para apreciar um ambiente onde novas pessoas aparecem todos os dias!',
          icon: 'icone.png',
          tag: 'notificacao-pwa'
        });
      });
    }
  });
}
