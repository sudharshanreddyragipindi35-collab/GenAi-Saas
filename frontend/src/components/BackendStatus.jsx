import './BackendStatus.css'

const statusLabels = {
  checking: 'Checking backend',
  online: 'Backend online',
  offline: 'Backend offline',
}

function BackendStatus({ mode, status }) {
  const label = statusLabels[status]
  const detail = status === 'online' && mode ? mode : label

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
