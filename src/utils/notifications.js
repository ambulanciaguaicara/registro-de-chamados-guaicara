const notificationContainer = document.createElement('div');
notificationContainer.id = 'notification-container';
notificationContainer.style.cssText = `
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
document.body.appendChild(notificationContainer);

export function notify(message, type = 'info', duration = 4000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <span style="font-size: 24px;">${icons[type] || icons.info}</span>
      <div style="flex: 1;">
        <strong style="display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 12px;">
          ${type.toUpperCase()}
        </strong>
        <p style="margin: 0; font-size: 14px;">
          ${message}
        </p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: none; border: none; font-size: 20px; cursor: pointer;">
        ×
      </button>
    </div>
  `;
  
  notificationContainer.appendChild(notification);
  
  if (duration > 0) {
    setTimeout(() => notification.remove(), duration);
  }
}

export const notifySuccess = (msg) => notify(msg, 'success');
export const notifyError = (msg) => notify(msg, 'error');
export const notifyWarning = (msg) => notify(msg, 'warning');
export const notifyInfo = (msg) => notify(msg, 'info');
