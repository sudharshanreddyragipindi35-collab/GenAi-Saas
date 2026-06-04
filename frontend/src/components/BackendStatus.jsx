import './BackendStatus.css'

const statusLabels = {
  checking: 'Checking backend',
  online: 'Backend online',
  offline: 'Backend offline',
}

function BackendStatus({ mode, model, status }) {
  const label = statusLabels[status]
  const detail =
    status === 'online' && mode
      ? [mode, model].filter(Boolean).join(' / ')
      : label

  return (
    <span
      className={`backend-status ${status}`}
      role="status"
      title={detail}
    >
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  )
}

export default BackendStatus
