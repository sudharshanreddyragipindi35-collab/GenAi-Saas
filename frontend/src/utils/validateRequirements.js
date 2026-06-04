function validateText(value, fieldName) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return `${fieldName} is required.`
  }

  if (trimmedValue.length < 2) {
    return `${fieldName} must be at least 2 characters.`
  }

  return ''
}

export function validateRequirements(requirements) {
  const errors = {
    businessType: validateText(requirements.businessType, 'Business type'),
    companyName: validateText(requirements.companyName, 'Company name'),
    targetAudience: validateText(requirements.targetAudience, 'Target audience'),
    requiredFeatures:
      requirements.requiredFeatures.length > 0
        ? ''
        : 'Select at least one website feature.',
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message)),
  )
}
